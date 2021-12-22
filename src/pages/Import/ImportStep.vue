<template>
  <LoadingOverlay v-if="isLoading" />
  <label
    class="
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
  <Divider />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import api from "~/api";

import Divider from "~/components/base/Divider.vue";
import LoadingOverlay from "~/components/base/LoadingOverlay.vue";
import { useStore } from "~/store";

export default defineComponent({
  components: {
    Divider,
    LoadingOverlay,
  },
  setup() {
    const { t } = useI18n();
    const store = useStore();

    const formData = new FormData();
    const isLoading = ref(false);

    onMounted(() => {
      formData.append("code", "N5E63T");
    });

    const onFileSelect = async (e: any) => {
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
        if (file?.name.match(/endsong_[0-9]+\.json/i)) {
          isLoading.value = true;
          formData.append("files", file);

          const { data, success } = await api.post("/import/upload", {
            body: formData,
            headers: {
              "Content-Type": "multipart/formdata",
            },
          });

          if (success) {
            isLoading.value = true;
            store.commit("setError", {
              message: t("import.successfully_uploaded_file", {
                filename: file.name,
              }),
              type: "info",
            });
          } else {
            store.commit("setError", {
              message: data.message,
              type: "error",
            });
          }
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

    return { t, isLoading, onFileSelect };
  },
});
</script>
