<template>
  <Card class="flex justify-between items-center py-2 relative overflow-hidden">
    <div class="w-full">
      <div class="flex justify-between">
        <span class="truncate">{{ t('import.imported_on') }}</span>
        <span class="text-white">{{
          dayjs(props.import.createdAt).format('DD/M/YYYY hh:mm')
        }}</span>
      </div>
      <div class="flex justify-between truncate">
        <span class="truncate">{{ t('import.count') }}</span>
        <span class="text-white">{{ props.import.count }}</span>
      </div>
    </div>
    <div class="pl-5 py-5 cursor-pointer" @click="showDeleteModal">
      <Icon :path="mdiDelete" color="#fc5353" />
    </div>
  </Card>

  <Modal v-if="isDeleteModalActive" @hide="hideDeleteModal">
    <p class="max-w-prose">
      {{ t('import.delete_notice', { count: props.import.count }) }}
    </p>
    <div class="flex gap-2 mt-5">
      <Button @click="hideDeleteModal">{{ t('buttons.cancel') }}</Button>
      <Button @click="deleteImport">{{ t('buttons.continue') }}</Button>
    </div>
  </Modal>
</template>

<script lang="ts" setup>
import { mdiDelete } from '@mdi/js';
import dayjs from 'dayjs';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useApi, useToaster } from '~/hooks';
import { BacktrackUserImport, PostImportRemoveResponse } from '~/types';
import Card from '../layout/Card.vue';
import Button from './Button.vue';
import Icon from './Icon.vue';
import Modal from './Modals/Modal.vue';

const { t } = useI18n();
const toaster = useToaster();
const api = useApi();

const props = defineProps<{
  import: BacktrackUserImport;
}>();

const isDeleteModalActive = ref(false);

const deleteImport = async () => {
  const { data } = await api.http.httpPost<PostImportRemoveResponse>(
    `/import/remove/${props.import.hash}`
  );

  if (data[0] !== 200) {
    toaster.error({
      message: t('errors.failed_removing_import')
    });
  }

  hideDeleteModal();
};

const hideDeleteModal = () => {
  isDeleteModalActive.value = false;
};

const showDeleteModal = () => {
  isDeleteModalActive.value = true;
};
</script>
