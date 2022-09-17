<template>
  <div class="search-bar">
    <v-icon
      class="search-bar-icon"
      :icon="mdiMagnify"
      color="grey"
      style="width: 1.125rem !important"
    />
    <input
      v-model="modelValue"
      class="search-bar-input"
      type="text"
      placeholder="Search"
      :style="{
        '--color-border': stores.ts.darkmodeBorder,
        color: stores.ts.darkmodeColor,
        '--color-hover': outline
          ? rgbToRgba(outline, '0.8')
          : rgbToRgba('#5c6bc0', '0.8'),
        '--color-active': outline ? outline : '#5c6bc0',
        ...inputStyle,
      }"
    />
  </div>
</template>

<script lang="ts" setup>
import { rgbToRgba } from "@/assets/javascripts/utils/css";
import useThemeStore from "@/store/useThemeStore";
import { mdiMagnify } from "@mdi/js";
import { ref, watch, type CSSProperties } from "vue";

const props = defineProps<{
  modelValue: string;
  width?: string;
  height?: string;
  outline?: string;
  inputStyle?: CSSProperties;
}>();
const emit = defineEmits(["update:modelValue"]);
const modelValue = ref(props.modelValue);

console.log(props.inputStyle);

const stores = {
  ts: useThemeStore(),
};

watch(props, () => {
  modelValue.value = props.modelValue;
});
watch(modelValue, () => {
  emit("update:modelValue", modelValue.value);
});
</script>

<style lang="scss" scoped>
.search-bar {
  position: relative;
  min-width: 2rem;
  min-height: 2rem;
  background-color: white;
  border-radius: 0.25rem;
  input::placeholder {
    color: #9e9e9e !important;
    line-height: 0.875rem !important;
    margin-top: 0.625rem !important;
  }
  .search-bar-input {
    width: 100%;
    height: 100%;
    padding: 0.75rem 0.625rem 0.75rem 2.5rem;
    border-radius: 0.25rem;
    outline: none;
    border: var(--color-border);
    &:hover {
      border: 0.0625rem solid var(--color-hover);
    }
    &:focus {
      border: 0.0625rem solid var(--color-active);
    }
  }
  .search-bar-icon {
    position: absolute;
    height: 50%;
    top: 25%;
    margin-left: 0.75rem;
  }
}
</style>
