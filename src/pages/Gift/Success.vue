<template>
  <Header />
  <Container class="h-screen">
    <div class="mt-20 grid place-items-center text-center">
      <img :src="gif" class="mb-5 aspect-square w-48 rounded-full bg-contain bg-center" />
      <h1 class="text-3xl font-bold md:text-4xl">
        {{ t('gift.thanks_plus') }}
      </h1>
      <p class="mt-2 max-w-prose font-bold text-textGrey">
        {{ t('gift.order_info') }}
      </p>
      <Button class="mt-5 max-w-fit" @click="$router.push({ name: 'Gift' })">{{
        t('gift.take_to_coupons_page')
      }}</Button>
    </div>
  </Container>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import Header from '~/components/layout/Header.vue';
import Container from '~/components/layout/Container.vue';
import Button from '~/components/base/Button.vue';

const { t } = useI18n();

const gifs = [
  'https://c.tenor.com/BnEKiDKJisEAAAAC/claire-dancing.gif',
  'https://c.tenor.com/4-C47Bn_MUgAAAAd/friday-happy-dance.gif',
  'https://c.tenor.com/2_6lWnksyaUAAAAd/dancing-dirty.gif',
  'https://c.tenor.com/cKf7FeLja6cAAAAC/cant-wait-excited.gif',
  'https://c.tenor.com/uFy_1B10El0AAAAC/aye-ouu.gif',
  'https://c.tenor.com/LzFmt_ca1AEAAAAd/aye-aye-aye-turnup.gif',
  'https://c.tenor.com/1vzjD25uEjcAAAAC/clapping-yay.gif',
  'https://c.tenor.com/PXVgzio7BmcAAAAC/happy-dance.gif',
  'https://c.tenor.com/xgDmUszn5PYAAAAd/clapping-happy.gif',
  'https://c.tenor.com/Hrzj4EjdX58AAAAd/dance-happy.gif',
  'https://media2.giphy.com/media/26DOpJRJMhRPGqUsE/giphy.gif',
  'https://media0.giphy.com/media/3o85g2cRAMwUTuPfGM/giphy.gif'
];

const gif = gifs[Math.floor(Math.random() * gifs.length)];
</script>
