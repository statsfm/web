<template>
  <div class="flex gap-5 flex-col md:flex-row">
    <div class="w-full md:basis-6/12">
      <h2>{{ t('import.import') }}</h2>
      <p>
        {{ t('import.import.description') }}
      </p>

      <label
        class="mt-2 block w-full border-0 cursor-pointer transition-colors duration-300 font-bold bg-primary/10 hover:bg-primary/20 active:bg-primary/5 text-primary py-3 px-5 rounded-2xl text-center"
      >
        <input type="file" accept="application/json" class="hidden" @change="onFileSelect" />

        {{ t('import.select_file') }}
      </label>
    </div>

    <div class="w-full md:basis-6/12">
      <h2>{{ t('import.previous_imports') }}</h2>
      <p>
        {{ t('import.previous_imports.description') }}
      </p>

      <div class="mt-2">
        <div class="flex flex-col gap-2" v-if="imports.length > 0">
          <ImportCard v-for="(importFile, index) in imports" :key="index" :import="importFile" />
        </div>
        <div v-else>
          <Card>{{ t('import.no_imports_yet') }}</Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ImportCard from '~/components/base/ImportCard.vue';
import Card from '~/components/layout/Card.vue';
import { useApi, useToaster } from '~/hooks';
import { BacktrackUserImport, GetImportListResponse, PostImportUploadResponse } from '~/types';
import { code } from './state';

const { t } = useI18n();
const toaster = useToaster();
const api = useApi();

const formData = new FormData();

const emit = defineEmits(['setDisabledState', 'continue', 'back']);

const imports: Ref<BacktrackUserImport[]> = ref([]);

const getImports = async (): Promise<BacktrackUserImport[]> => {
  return await api.http
    .httpGet<GetImportListResponse>('/import/list', {
      headers: {
        Authorization: code.value ?? ''
      }
    })
    .then((res) => res.data.items);
};

onMounted(async () => {
  imports.value = await getImports();
});

const onFileSelect = async (e: any) => {
  if (!code.value) {
    toaster.error({
      message: t('errors.no_code_recieved')
    });

    emit('back');

    return;
  }

  formData.append('code', code.value.toUpperCase());

  const files: FileList = e.target.files;

  if (files.length === 0) {
    toaster.error({
      message: t('errors.no_files_selected')
    });

    return;
  }

  if (files.length > 1) {
    toaster.error({
      message: t('errors.multiple_files')
    });

    return;
  }

  const file = files.item(0);

  // check if filename is valid
  if (file && file.name.match(/endsong_[0-9]+\.json/i)) {
    formData.append('files', file);

    await api.http.httpPost<PostImportUploadResponse>(`/import/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': null!
      },
      body: formData
    });

    // set current step to disabled so you can't go back to the import step
    emit('setDisabledState', true);
    // continue to the next step
    emit('continue');

    toaster.success({
      message: t('import.successfully_uploaded_file', {
        filename: file.name
      })
    });
  } else if (file?.name.match(/StreamingHistory[0-9][0-9]?.json/g)) {
    toaster.error({
      message: t('errors.invalid_filename_streaminghistory'),
      duration: 8 * 1000 // show the toaster for 8 seconds
    });
  } else {
    toaster.error({
      message: t('errors.invalid_filename')
    });
  }
};
</script>
