<template>
  <div class="switch d-flex" @click="onClickSwitch">
    <div
      class="switch-body"
      :class="{ inactive: modelValue }"
      :style="{
        '--color-body': bodyColor,
        opacity: !disabled ? '1' : '0.4',
        height: inset ? '1.125rem' : '0.875rem',
        borderRadius: inset ? '0.875rem' : '0.5rem',
        top: inset ? '0' : '0.1875rem',
      }"
    />
    <div
      class="switch-toggle"
      :class="{ inactive: modelValue }"
      :style="{
        '--color-toggle': toggleColor,
        opacity: !disabled ? '1' : '0.6',
        left: !modelValue
          ? inset
            ? '0.313rem'
            : '0rem'
          : inset
          ? '1.344rem'
          : '1.43rem',
        width: inset ? '1.094rem' : '1.25rem',
        height: inset ? '1.094rem' : '1.25rem',
        top: inset ? '0.0313rem' : '0',
        boxShadow: inset ? '' : '0rem 0.0625rem 0.125rem 0.0063rem #999999',
      }"
    ></div>
    <div
      v-if="!disabled && !inset"
      class="switch-toggle-back"
      :class="{ inactive: modelValue }"
      :style="{
        '--color-toggle': toggleColor,
        left: !modelValue ? '-0.5rem' : '0.9375rem',
      }"
    />
    <div class="switch-label" :style="{ ...labelStyle }">
      {{ label }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch, type CSSProperties } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    color?: string;
    bodyColor?: string;
    toggleColor?: string;
    disabled?: boolean;
    label?: string;
    labelColor?: string;
    inset?: boolean;
    labelStyle?: CSSProperties;
  }>(),
  {
    modelValue: false,
    color: "#5c6bc0",
    bodyColor: "#C5CAE9",
    toggleColor: "#5c6bc0",
    disabled: false,
  }
);

const emit = defineEmits(["update:modelValue"]);
const modelValue = ref(props.modelValue);

function onClickSwitch() {
  if (!props?.disabled) {
    modelValue.value = !modelValue.value;
  }
}

watch(props, (newValue) => {
  modelValue.value = newValue.modelValue;
});

watch(modelValue, () => {
  emit("update:modelValue", modelValue.value);
});
</script>

<style lang="scss" scoped>
.switch {
  position: relative;
  width: 2.56rem;
  height: 1.25rem;
  cursor: pointer;

  &:hover {
    .switch-toggle-back {
      visibility: visible;
    }
  }
  &-body {
    position: absolute;
    width: 2.125rem;
    top: 0.1875rem;
    left: 0.3125rem;
    background-color: #eeeeee;
    border-radius: 0.4375rem;
    opacity: 0.4;
    &.inactive {
      background-color: var(--color-body);
    }
  }
  &-toggle {
    position: absolute;
    top: -0.0625rem;
    background-color: white;
    border-radius: 50%;
    transition: all 0.15s;
    &.inactive {
      background-color: var(--color-toggle);
    }
    &-back {
      position: absolute;
      visibility: hidden;
      width: 2.25rem;
      height: 2.25rem;
      top: -0.5625rem;
      background-color: #eeeeee;
      opacity: 0.4;
      border-radius: 50%;
      box-shadow: 0rem 0.0625rem 0.125rem 0.0063rem #999999;
      transition: all 0.15s;
      &.inactive {
        background-color: var(--color-toggle);
      }
    }
  }
  .switch-label {
    position: absolute;
    white-space: nowrap;
    left: 3.125rem;
    top: -0.25rem;
  }
}
</style>
