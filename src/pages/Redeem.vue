<template>
  <Loading v-if="loading" />
  <Container>
    <br />
    <h1 class="text-4xl font-bold">Redeem a Plus coupon</h1>
    <br />
    <div class="flex gap-1 mb-5 flex-col md:flex-row">
      <div v-for="i in pinLength" :key="i" class="w-100/10">
        <input
          class="pin-input font-bold"
          type="text"
          name="code"
          pattern="[A-Z,a-z,0-9]"
          maxlength="1"
          v-model="pinInput[i - 1]"
          :readonly="i - 1 != pinNextIndex"
          :id="'pin' + (i - 1)"
          @click="i - 1 != pinNextIndex ? pinFocus() : () => {}"
          :onkeydown="(e) => pinKeypress(e, i - 1)"
        />
        <h1
          class="text-2xl font-bold"
          v-if="i % 4 == 0 && i != pinLength"
          style="display: inline"
        >
          -
        </h1>
      </div>
    </div>
    <Text v-if="message">{{ message }}</Text>
    <br />
    <Button :disabled="code.length != 12" @click="submitCode">Redeem</Button>
  </Container>
</template>

<style lang="scss" scoped>
.pin-input {
  border: none;
  background-color: var(--color-body-secundary);
  color: var(--color-text-primary);
  font-size: 1.8rem;
  letter-spacing: 0px;
  text-transform: uppercase;
  font-family: "Open Sans Bold", sans-serif;
  border-radius: 12px;
  padding: 5px 10px;
  width: 3rem;
  text-align: center;
}
.code-input {
  border: none;
  background-color: var(--color-body-secundary);
  color: var(--color-text-primary);
  font-size: 2.1rem;
  letter-spacing: 5px;
  text-transform: uppercase;
  font-family: "Open Sans Bold", sans-serif;
  font-weight: 600;
  border-radius: 12px;
  padding: 8px 16px;
}
</style>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  Ref,
  onBeforeMount,
  watch,
  computed,
} from "vue";
import { useStore } from "~/store";

import Container from "~/components/layout/Container.vue";
import Header from "~/components/layout/Header.vue";
import Card from "~/components/layout/Card.vue";
import Heading from "~/components/base/Heading.vue";
import Divider from "~/components/base/Divider.vue";
import Loading from "~/components/base/Loading.vue";
import Text from "~/components/base/Text.vue";
import Button from "~/components/base/Button.vue";
import api from "~/api";
import { useAuth } from "~/hooks/auth";

export default defineComponent({
  components: {
    Container,
    Header,
    Card,
    Heading,
    Divider,
    Loading,
    Text,
    Button,
  },
  setup() {
    const auth = useAuth();
    const loading = ref(false);
    const code = ref("");
    const message = ref("");
    const pinLength = 12;
    const pinInputRef = ref(new Array(pinLength).fill(""));
    const pinNextIndex = ref(0);
    const formattedCode = computed({
      get: () => {
        if (pinInputRef.value.join("").length == 0) return "";
        return pinInputRef.value
          .join("")
          .match(new RegExp(".{1,4}", "g"))!
          .join("-");
      },
      set: (val) => {},
    });
    const pinInput = computed({
      get: () => {
        return pinInputRef.value;
      },
      set: (val) => {
        pinInputRef.value = val;
      },
    });

    const pinFocus = () => {
      document.getElementById(`pin${pinNextIndex.value}`)?.focus();
    };
    const pinKeypress = (e, pin) => {
      if (e.which == 8) {
        if (pin == pinLength - 1) {
          if (pinInput.value[pin] == "") {
            if (pinNextIndex.value != 0) pinNextIndex.value--;
            pinInput.value[pin - 1] = "";
          }
        } else {
          if (pinNextIndex.value != 0) pinNextIndex.value--;
          pinInput.value[pin - 1] = "";
        }
        pinInput.value[pin] = "";
        pinFocus();
      } else if (e.which == 13 && pinInput.value[pin] != "") {
        pinNextIndex.value++;
        pinFocus();
      }
    };

    watch(pinInput.value, () => {
      if (pinNextIndex.value != pinLength - 1) {
        pinNextIndex.value = pinInput.value.findIndex((val) => val == "");
      }

      // document.getElementById(`pin${nextIndex}`)?.removeAttribute("readonly");
      pinFocus();
    });

    onBeforeMount(() => {});

    const submitCode = async () => {
      loading.value = true;
      const res = await api.post(`/plus/giftcodes/${code.value}/redeem`);

      if (res.success) {
        message.value = JSON.stringify(res.data);
      } else {
        message.value = res.data.message;
      }

      loading.value = false;
    };

    return {
      auth,
      loading,
      code,
      message,
      submitCode,
      pinLength,
      pinInput,
      pinNextIndex,
      pinFocus,
      pinKeypress,
      formattedCode,
    };
  },
});
</script>
