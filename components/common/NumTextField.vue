<template>
  <input
    ref="numTextField"
    class="num-textfield"
    type="text"
    v-model="modelValue"
    @keydown="numberOnly"
    :maxlength="maxLength"
    :style="{ width: width ? width : '', height: height ? height : '' }"
  />
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

const props = defineProps<{
  modelValue: string;
  maxLength?: string;
  width?: string;
  height?: string;
}>();
const numTextField = ref<HTMLElement>();
const emit = defineEmits(["update:modelValue"]);
const modelValue = ref<string>(props.modelValue);
function numberOnly(e: KeyboardEvent) {
  if (
    (e.keyCode > 48 && e.keyCode < 57) ||
    e.keyCode === 8 || // backspace key
    e.keyCode === 37 ||
    e.keyCode === 39 || // <- -> key
    e.keyCode === 46 // delete key
  ) {
  } else {
    return false;
  }
}

watch(modelValue, (newValue) => {
  // 숫자 외에 다 없애는 정규식
  numTextField.value?.focus();
});

watch(props, (newValue) => {
  modelValue.value = newValue.modelValue.toString().replace(/[^0-9]/g, "");
});
</script>

<style lang="scss">
input {
  height: 2.5rem;
  width: 100%;
  padding: 0.625rem;
  border: 0.0625rem solid #e0e0e0;
  border-radius: 0.25rem;
  background-color: white;
  font-size: 0.875rem;
  &::placeholder {
    font-size: 0.875rem;
    color: #7c7f90;
  }
}
</style>
