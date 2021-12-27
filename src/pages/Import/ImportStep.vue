<template>
  <LoadingOverlay v-if="isLoading" />
  <div class="flex gap-5 flex-col md:flex-row">
    <div class="w-full md:basis-6/12">
      <h1 class="text-2xl font-bold">{{ t("import.import") }}</h1>
      <p class="font-medium text-textGrey">
        {{ t("import.import.description") }}
      </p>

      <label
        class="
          mt-2
          block
          w-full
          border-0
          cursor-pointer
          transition-colors
          duration-300
          font-bold
          bg-primary/10
          hover:bg-primary/20
          active:bg-primary/5
          text-primary
          py-3
          px-5
          rounded-2xl
          text-center
        "
      >
        <input
          type="file"
          accept="application/json"
          class="hidden"
          @change="onFileSelect"
        />

        {{ t("import.select_file") }}
      </label>
    </div>

    <div class="w-full md:basis-6/12">
      <h1 class="text-2xl font-bold">{{ t("import.previous_imports") }}</h1>
      <p class="font-medium text-textGrey">
        {{ t("import.previous_imports.description") }}
      </p>

      <div class="mt-2">
        <div class="flex flex-col gap-2" v-if="imports.length > 0">
          <ImportCard
            v-for="(importFile, index) in imports"
            :key="index"
            :import="importFile"
          />
        </div>
        <div v-else>
          <Card>{{ t("import.not_imported_yet") }}</Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref } from "vue";
import { useI18n } from "vue-i18n";
import api from "~/api";

import LoadingOverlay from "~/components/base/LoadingOverlay.vue";
import Card from "~/components/layout/Card.vue";
import ImportCard from "~/components/base/ImportCard.vue";

import { useStore } from "~/store";
import { code } from "./state";

const { t } = useI18n();
const store = useStore();

const formData = new FormData();
const isLoading = ref(false);

const emit = defineEmits(["setDisabledState"]);

const imports: Ref<BacktrackUserImport[]> = ref([]);

const getImports = async (): Promise<BacktrackUserImport[]> => {
  return await api
    .get("/import/list", {
      headers: {
        Authorization: code.value ?? "",
      },
    })
    .then((res) => res.data.items);
};

onMounted(async () => {
  imports.value = await getImports();
});

const onFileSelect = async (e: any) => {
  if (!code.value) {
    store.commit("setError", {
      message: t("errors.no_code_recieved"),
      type: "error",
    });
    return;
  }

  formData.append("code", code.value.toUpperCase());

  const files: FileList = e.target.files;

  if (files.length === 0) {
    store.commit("setError", {
      message: t("errors.no_files_selected"),
      type: "error",
    });

    return;
  }

  if (files.length > 1) {
    store.commit("setError", {
      message: t("errors.multiple_file"),
    });

    return;
  }

  for (let i = 0; i < files.length; i++) {
    const file = files.item(i);

    // check if filename is valid
    if (file && file.name.match(/endsong_[0-9]+\.json/i)) {
      isLoading.value = true;
      formData.append("files", file);

      const res = await fetch(`${new api().baseUrl}/import/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        store.commit("setError", {
          message: data.message,
          type: "error",
        });

        return;
      }

      isLoading.value = false;
      emit("setDisabledState", false);

      store.commit("setError", {
        message: t("import.successfully_uploaded_file", {
          filename: file.name,
        }),
        type: "info",
      });
    } else if (file?.name.match(/StreamingHistory[0-9][0-9]?.json/g)) {
      store.commit("setError", {
        message: t("errors.invalid_filename_streaminghistory"),
        type: "error",
        duration: 8 * 1000, // show the toaster for 8 seconds
      });
    } else {
      store.commit("setError", {
        message: t("errors.invalid_filename"),
        type: "error",
      });
    }
  }
};
</script>
