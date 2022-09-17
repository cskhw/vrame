<template>
  <textarea
    class="common-textarea"
    ref="commonTextarea"
    @input="(e) => onInput(e)"
    :value="modelValue"
    :style="textareaStyle"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
  />
</template>

<script lang="ts" setup>
import { rgbToRgba } from "@/assets/javascripts/utils/css";
import { computed, onMounted, ref, watch, type CSSProperties } from "vue";

import colors from "@/assets/javascripts/colors";

/**
 * minHeight: 최소 높이, 기본 높이로 사용
 * height: 고정 높이
 * maxHeight: 최대로 늘어나는 높이, height 사용 안하고 minHeight랑 같이 사용해야 함
 */
const props = defineProps<{
  modelValue?: any;
  placeholder?: string;
  width?: string;
  height?: string;
  minHeight?: string;
  maxHeight?: string;
  disabled?: boolean;
  rows?: number;
  fontSize?: number;
  fontFamily?: string;
  readonly?: boolean;
  overflow?: string;
  cursor?: string;
  borderColor?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const modelValue = ref(props.modelValue);

const commonTextarea = ref<HTMLElement>();

// 콘텐츠 높이, 이 값에 따라서 인풋 높이가 늘어남
const contentHeight = ref("2.6875rem");

const textareaStyle = computed(
  () =>
    ({
      width: props.width,
      height: props.height ? props.height : contentHeight,
      minHeight: props.minHeight ? props.minHeight : "2.6875rem",
      maxHeight: props.maxHeight ? props.maxHeight : "5rem",
      "--color-focus": props.borderColor
        ? props.borderColor
        : rgbToRgba(colors.MAIN, "1"),
      "--color-hover": props.borderColor
        ? props.borderColor
        : rgbToRgba(colors.MAIN, ".8"),
      rows: props.rows,
      fontSize: props.fontSize,
      fontFamily: props.fontFamily,
      overflow: props.overflow ? props.overflow : "visible",
      cursor: props.cursor,
    } as CSSProperties)
);

function onInput(e: Event) {
  const target = e.target as HTMLInputElement;
  modelValue.value = target.value;
  target.style.height = "0.0625rem";
  contentHeight.value = target.scrollHeight + "px";
  emit("update:modelValue", modelValue.value);
}

watch(props, () => {
  modelValue.value = props.modelValue;
});

onMounted(() => {
  contentHeight.value = "0.0625rem";
  if (commonTextarea.value)
    contentHeight.value = 3 + commonTextarea.value.scrollHeight + "px";
});
</script>

<style lang="scss" scoped>
textarea {
  width: 100%;
  padding: 0.875rem;
  border: 0.0625rem solid #e0e0e0;
  border-radius: 0.25rem;
  background-color: white;
  font-size: 0.875rem;
  resize: none;
  outline: none;

  &::placeholder {
    font-size: 0.875rem;
    color: #7c7f90;
  }

  &:focus {
    border: 0.0625rem solid var(--color-focus) !important;
  }
  &:hover {
    border: 0.0625rem solid var(--color-hover) !important;
  }
}
</style>
