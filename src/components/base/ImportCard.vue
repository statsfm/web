<template>
  <Card class="flex justify-between items-center py-2 relative overflow-hidden">
    <!-- <div class="absolute top-0 h-1 bg-primary left-2 right-2 rounded-2xl"></div> -->
    <div class="w-full">
      <div class="flex justify-between">
        <span class="text-textGrey font-medium truncate">{{ t('import.imported_on') }}</span>
        <span>{{ dayjs(props.import.createdAt).format('DD/M/YYYY hh:mm') }}</span>
      </div>
      <div class="flex justify-between truncate">
        <span class="text-textGrey font-medium">{{ t('import.count') }}</span>
        <span>{{ props.import.count }}</span>
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

import Card from '../layout/Card.vue';
import Icon from './Icon.vue';
import Modal from './Modals/Modal.vue';

import dayjs from 'dayjs';
import { useI18n } from 'vue-i18n';
import Button from './Button.vue';
import { ref } from 'vue';
import api from '~/api';
import { useStore } from '~/store';
import { BacktrackUserImport } from '~/types';

const { t } = useI18n();
const store = useStore();

const props = defineProps<{
  import: BacktrackUserImport;
}>();

const isDeleteModalActive = ref(false);

const deleteImport = async () => {
  const { data } = await api.post(`/import/remove/${props.import.hash}`);

  if (data[0] !== 200) {
    store.commit('setError', {
      message: t('errors.failed_removing_import'),
      type: 'error'
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
