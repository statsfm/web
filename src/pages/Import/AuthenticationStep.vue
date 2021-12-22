<template>
  <input
    type="text"
    name="code"
    pattern="[A-Z,a-z,0-9]{6}"
    maxlength="6"
    class="bg-bodySecundary font-bold rounded-2xl p-5 mb-5 uppercase"
    @input="onCodeInput"
  />
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from "vue";
import api from "~/api";

import Button from "~/components/base/Button.vue";
import { useStore } from "~/store";

export default defineComponent({
  components: {
    Button,
  },
  props: {
    currentStep: {
      type: Number,
      required: true,
    },
  },
  emits: ["setDisabledState"],
  setup(props, { emit }) {
    const store = useStore();

    const code: Ref<string | null> = ref(null);
    const codeLength = 6;

    const onCodeInput = async (e: any) => {
      const value = e.target.value;

      if (value.length == codeLength) {
        emit("setDisabledState", false);

        const { data, success } = await api.post("/import/code", {
          body: JSON.stringify({
            code: value,
          }),
        });

        if (!success) {
          store.commit("setError", { message: data.message, type: "error" });
        }

        console.log(data);
      } else {
        emit("setDisabledState", true);
      }
    };

    return { onCodeInput };
  },
});
</script>
