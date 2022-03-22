<template>
  <Header />
  <div
    class="py-50 fixed top-0 left-0 flex h-screen w-screen items-center justify-center bg-black bg-opacity-70"
    style="z-index: 10000"
    v-if="loading"
  >
    <Loading class="m-auto" />
  </div>
  <Container>
    <h2>Imports</h2>
    <p>
      Check more about importing your lifetime streaming history
      <a
        class="text-primary hover:opacity-90"
        href="https://support.stats.fm/docs/import"
        target="blank"
      >
        here in the support docs</a
      >. Scroll down to import a new file.
    </p>

    <div class="flex flex-col gap-2" v-if="imports.length > 0">
      <div v-for="(importFile, index) in imports" :key="index">
        <div class="relative flex items-center justify-between overflow-hidden py-2">
          <div class="w-full">
            <h4>{{ importFile.name }}</h4>
            <span class="text-2sm text-neutral-400"
              >Imported on {{ dayjs(importFile.createdAt).format('DD/M/YYYY hh:mm') }}</span
            >
            <br />
            <span class="text-2sm text-neutral-400">{{ importFile.count }} streams</span>
            <br />
            <span class="text-2sm text-neutral-400">{{ getStatus(importFile.status) }}</span>
          </div>
          <!-- <Button size="small" @click="showDeleteModal">Delete</Button> -->
        </div>

        <Modal v-if="isDeleteModalActive" @hide="hideDeleteModal">
          <p class="max-w-prose">
            {{ t('import.delete_notice', { count: importFile.count }) }}
          </p>
          <div class="mt-5 flex gap-2">
            <Button @click="hideDeleteModal">{{ t('buttons.cancel') }}</Button>
            <Button @click="deleteImport(importFile.id)">{{ t('buttons.continue') }}</Button>
          </div>
        </Modal>
      </div>
    </div>
    <div v-else>
      <h4 class="my-5 text-neutral-400">{{ t('import.no_imports_yet') }}</h4>
    </div>
    <Divider class="my-5" />
    <label
      class="mt-2 block w-full cursor-pointer rounded-2xl border-0 bg-primary/10 py-3 px-5 text-center font-bold text-primary transition-colors duration-300 hover:bg-primary/20 active:bg-primary/5"
    >
      <input type="file" accept="application/json" class="hidden" @change="onFileSelect" />

      Import a new file (only the endsong.json files)
    </label>
    <br />
  </Container>
</template>

<script lang="ts" setup>
import * as statsfm from '@statsfm/statsfm.js';
import dayjs from 'dayjs';
import { onBeforeMount, Ref, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import Button from '~/components/base/Button.vue';
import Divider from '~/components/base/Divider.vue';
import Loading from '~/components/base/Loading.vue';
import Modal from '~/components/base/Modals/Modal.vue';
import Card from '~/components/layout/Card.vue';
import Container from '~/components/layout/Container.vue';
import Header from '~/components/layout/Header.vue';
import { useApi, useAuth, useToaster } from '~/hooks';

const { t } = useI18n();
const toaster = useToaster();
const api = useApi();
const auth = useAuth();
const router = useRouter();

const imports: Ref<statsfm.UserImport[]> = ref([]);
const loading = ref(false);

const loadImports = async () => {
  imports.value = await api.me.imports();
};

onBeforeMount(async () => {
  if (!auth.isLoggedIn()) {
    auth.login();
  }

  await loadImports();
});

const getStatus = (status: number) => {
  return {
    '-1': 'Errored!',
    '0': 'Queued (waiting to be processed)',
    '1': 'Processing',
    '2': 'Successfully processed'
  }[status.toString()];
};

const formData = new FormData();

const onFileSelect = async (e: any) => {
  if (!auth.isLoggedIn()) {
    toaster.error({
      message: t('errors.not_logged_in')
    });

    return;
  }

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

  const file = files.item(0)!;

  // check if filename is valid
  if (file && file.name.match(/endsong(?:_[0-9]+)?\.json/i)) {
    formData.append('files', file);

    loading.value = true;
    const oldUrl = api.http.config.baseUrl;
    try {
      api.http.config.baseUrl = 'https://import.stats.fm/api/v1';
      await api.me.import({
        headers: {
          'Content-Type': null!
        },
        body: formData
      });

      toaster.success({
        message: t('import.successfully_uploaded_file', {
          filename: file.name
        })
      });
    } catch (e) {
      toaster.error({
        // @ts-ignore
        message: JSON.stringify(e).toString(),
        duration: 8 * 1000 // show the toaster for 8 seconds
      });
    }
    api.http.config.baseUrl = oldUrl;
    loading.value = false;

    window.location.reload();
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

const isDeleteModalActive = ref(false);

const deleteImport = async (id: number) => {
  try {
    await api.me.removeImport(id);
  } catch (e) {
    toaster.error({
      message: JSON.stringify(e)
    });
  }
  await loadImports();
  hideDeleteModal();
};

const hideDeleteModal = () => {
  isDeleteModalActive.value = false;
};

const showDeleteModal = () => {
  isDeleteModalActive.value = true;
};
</script>
