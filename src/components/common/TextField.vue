<template>
  <div class="common-textfield">
    <div v-if="title" class="text-500-14-gray">{{ title }}</div>
    <input
      :id="id"
      class="common-textfield-input"
      :class="{ invalid: !isValid && isShowMsg }"
      ref="textfieldInput"
      style="font-weight: 400"
      :style="{
        width: width ? width : '100%',
        height: height ? height : '2.5rem',
        backgroundColor: disabled ? '#F5F5F5' : 'white',
        cursor: cursor,
        '--color-active': outlineColor
          ? rgbToRgba(outlineColor, '1')
          : '#5c6bc0',
        '--color-hover': !disabled
          ? outlineColor
            ? rgbToRgba(outlineColor, '0.8')
            : rgbToRgba('#5c6bc0', '0.8')
          : '#E0E0E0',
      }"
      v-model="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
    />
    <template v-if="isShowMsg">
      <div
        v-if="isValid"
        style="font-size: 0.75rem; color: #5c6bc0"
        class="text-500-11-gray mt-1 mb-0"
      >
        {{ successMsg }}
      </div>
      <div
        v-else
        class="text-500-11-gray mt-1 mb-0"
        style="font-size: 0.75rem; color: #d2416d"
      >
        {{ failedMsg }}
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { rgbToRgba } from "@/assets/javascripts/utils/css";
import { ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    id?: string;
    modelValue?: any;
    title?: string;
    placeholder?: string;
    type?: string;
    width?: string;
    height?: string;
    disabled?: boolean;
    readonly?: boolean;
    border?: string;
    outlineColor?: string;
    rule?: (rules: any[]) => {};
    errorMsg?: string;
    isValid?: boolean;
    successMsg?: string;
    failedMsg?: string;
    isShowMsg?: boolean;
    cursor?: string;
  }>(),
  {
    isValid: true,
  }
);
const emit = defineEmits(["update:modelValue"]);
const modelValue = ref(props.modelValue);

watch(props, () => {
  modelValue.value = props.modelValue;
});

watch(modelValue, () => {
  emit("update:modelValue", modelValue.value);
});
</script>

<style lang="scss" scoped>
@import "@/styles/draft/text";
.common-textfield {
  width: 100%;

  &-input {
    width: 100%;
    padding: 0.625rem;
    border: 0.0625rem solid #e0e0e0;
    border-radius: 0.25rem;
    background-color: white;
    font-size: 0.875rem;
    outline: none;
    &::placeholder {
      font-size: 0.875rem;
      color: #7c7f90;
    }
    &[disabled="true"] {
      background-color: #f5f5f5;
    }
    &:hover {
      border: 0.0625rem solid var(--color-hover);
    }
    &:focus {
      border: 0.0625rem solid var(--color-active);
    }
    &.invalid {
      border: 0.0625rem solid #d2416d;
    }
  }
}
</style>
