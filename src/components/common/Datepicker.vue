<template>
  <div class="datepicker" :style="{ width: '100%' }">
    <datepicker
      class="text-500-14-black"
      :style="{
        width: '100%',
        alignItems: 'center',
        padding: '0.625rem 0.5rem 0.625rem 0.75rem',
        height: '2.375rem',
        background: 'white',
        /* Gray/300 */
        boxSizing: 'border-box',
        borderRadius: '0.25rem',
        outline: 'none',
        '--color-primary': Util.getColor(stores, 'PRIMARY'),
      }"
      style="font-weight: 400"
      v-model="modelValue"
      :typeable="typeable"
      :minimumView="minimumView"
      :inputFormat="inputFormat"
      :locale="locale"
      :key="minimumView"
      :placeholder="placeholder"
      :clearable="clearable"
      :disabled="disabled"
    />
    <v-icon
      v-if="dateIcon"
      class="datepicker-icon"
      :style="{ position: 'absolute', right: '1rem', top: '25%' }"
      color="#1B1A1B"
      :icon="mdiCalendar"
    />
  </div>
</template>

<script lang="ts" setup>
import { mdiCalendar } from "@mdi/js";
import { enUS, ja, ko, zhCN } from "date-fns/locale";
import { ref, watch } from "vue";
import datepicker from "vue3-datepicker";
import useUserStore from "@/store/useUserStore";
import useThemeStore from "@/store/useThemeStore";
import * as Util from "@/assets/javascripts/ipedit_util";

const userStore = useUserStore();
const themeStore = useThemeStore();
const stores = {
  ts: themeStore,
};

const minimumView = ref("day");

const props = withDefaults(
  defineProps<{
    modelValue?: Date | string;
    dateIcon?: boolean;
    inputFormat?: string;
    placeholder?: string;
    typeable?: boolean;
    clearable?: boolean;
    disabled?: boolean;
    lang?: string;
  }>(),
  {
    dateIcon: true,
    placeholder: "",
    typeable: true,
    clearable: false,
    disabled: false,
    lang: "UI_LANGUAGE/KO",
  }
);
const modelValue = ref(props.modelValue);
let locale = ko;
const emit = defineEmits(["update:modelValue"]);

// props.lang 내려온 UI 언어에 따라 locale 설정
// -> props로 안내려와져서 그냥 userStore 바로 가져다 씀
if (userStore.getLang === "UI_LANGUAGE/KO") locale = ko;
else if (userStore.getLang === "UI_LANGUAGE/JA") locale = ja;
else if (userStore.getLang === "UI_LANGUAGE/EN") locale = enUS;
else if (userStore.getLang === "UI_LANGUAGE/ZH") locale = zhCN;

watch(props, () => {
  modelValue.value = props.modelValue;
});

watch(modelValue, () => {
  emit("update:modelValue", modelValue.value);
});
</script>

<style lang="scss" scoped>
@import "@/styles/draft/text";

.datepicker {
  position: relative;

  box-sizing: border-box;

  ::v-deep(.v3dp__clearable) {
    position: absolute;
    width: 1rem;
    top: 0.4rem;
    left: unset;
    right: 3rem;
  }
  ::v-deep(.v3dp__input_wrapper) {
    position: relative;
  }
  ::v-deep(.v3dp__datepicker) {
    --vdp-hover-bg-color: var(--color-primary);
    --vdp-selected-bg-color: var(--color-primary);
  }

  ::v-deep(.v3dp__datepicker .v3dp__input_wrapper input) {
    border: 0.0625rem solid #dfdfdf;
    border-radius: 0.25rem;
    &:hover {
      border: 0.0625rem solid var(--color-primary);
      opacity: 0.7;
    }
    &:focus {
      border: 0.0625rem solid var(--color-primary);
      opacity: 1;
    }
  }
}
</style>
