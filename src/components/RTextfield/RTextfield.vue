<template>
  <div class="r-textfield">
    <input
      :id="id"
      class="r-textfield-input"
      ref="textfieldInput"
      :style="[
        _textfieldStyle,
        props.isInvaild ? _invaildStyle : {},
        props.disabled ? _textfieldDisabledStyle : {},
      ]"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      @input="(e) => onInputTextfield(e)"
      :value="modelValue"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, watch, type CSSProperties } from "vue";

const props = defineProps<{
  id?: string;
  type?: string;
  modelValue: string;
  textfieldStyle?: CSSProperties;
  invaildStyle?: CSSProperties;
  disabledStyle?: CSSProperties;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  isInvaild?: boolean;
  borders?: {
    border: string;
    focus: string;
    hover: string;
  };
}>();

const emit = defineEmits(["update:modelValue"]);

// 일반 스타일
const _textfieldStyle = computed<CSSProperties>(() => ({
  "--color-hover": props.borders?.hover,
  "--color-focus": props.borders?.focus,
  cursor: "pointer",
  ...props.textfieldStyle,
}));

// 비유효 스타일
const _invaildStyle = computed<CSSProperties>(() => ({
  "--color-hover": props.borders?.hover,
  "--color-focus": props.borders?.focus,
  cursor: "pointer",
  ...props.invaildStyle,
}));

// disabled 스타일
const _textfieldDisabledStyle = computed<CSSProperties>(() => ({
  "--color-hover": props.borders?.hover,
  "--color-focus": props.borders?.focus,
  backgroundColor: "#eeeeee",
  cursor: "unset",
  ...props.disabledStyle,
}));

// v-model binding
function onInputTextfield(e: Event) {
  const target: HTMLInputElement = e.target as HTMLInputElement;
  const value = target.value;
  emit("update:modelValue", value);
}
</script>

<style lang="scss">
@import "@/styles/text";
.r-textfield {
  width: 100%;

  .r-textfield-input {
    width: 100%;
    height: 2.5rem;

    outline: none;

    border: 1px solid $border-color;

    padding: 0.625rem;
    border-radius: 0.25rem;
    background-color: white;
    font-size: 0.875rem;
    &::placeholder {
      font-size: 0.875rem;
      color: #7c7f90;
    }
    &[disabled="true"] {
      background-color: #f5f5f5;
    }
    &:hover {
      border: var(--color-hover, 1px solid $border-color);
    }
    &:focus {
      border: var(--color-focus, 1px solid $border-color);
    }
  }
}
</style>
