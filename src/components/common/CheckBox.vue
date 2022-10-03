<template>
  <div
    id="common-checkbox"
    class="common-check-box d-flex align-center"
    @click="modelValue = !modelValue"
  >
    <div>
      <v-icon
        class="common-check-box-icon"
        :style="{
          width: width ? width : '1.25rem',
          height: height ? height : '1.25rem',
        }"
        :icon="modelValue ? mdiCheckboxMarked : mdiCheckboxBlankOutline"
        :color="bgColor"
      />
    </div>
    <label
      for=".common-check-box"
      class="d-flex align-center jusitfy-center"
      v-if="label"
    >
      <div
        class="common-check-box-label ml-1"
        style="margin-top: 0.375rem"
        :style="{ ...labelStyle, color: labelColor }"
      >
        {{ label }}
      </div>
    </label>
  </div>
</template>
<script lang="ts" setup>
import { rgbToRgba } from "@/assets/javascripts/utils/css";
import { mdiCheckboxBlankOutline, mdiCheckboxMarked } from "@mdi/js";
import { computed, ref, watch, type StyleValue } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    width?: string;
    height?: string;
    border?: string;
    color?: string;
    label?: string;
    labelColor?: string;
    nullable?: boolean;
    disabled?: boolean;
    labelStyle?: { [key: string]: StyleValue };
  }>(),
  {
    labelColor: "#7c7f91",
  }
);
const emit = defineEmits(["update:modelValue"]);
const modelValue = ref(props.modelValue);

const defaultColor = props.color ? props.color : "#5c6bc0";
const bgColor = computed(() => {
  if (modelValue.value) {
    if (props.disabled) return rgbToRgba(defaultColor, ".4");
    else return defaultColor;
  } else {
    if (props.disabled) return rgbToRgba("#7C7F90", ".2");
    else return rgbToRgba("#7C7F90", ".4");
  }
});

// props가 바뀔 때(부모에서 값이 바뀔 때)
watch(props, () => {
  modelValue.value = props.modelValue;
});

// modelValue가 바뀔 때(컴포넌트 내부에서 값이 바뀔 때)
watch(modelValue, () => {
  emit("update:modelValue", modelValue.value);
});
</script>
<style lang="scss" scoped>
.common-check-box {
  width: max-content;
  height: max-content;
  .common-check-box-icon {
    transition: all 0.01s linear;
    width: max-content;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
    &:active {
      opacity: 0.6;
    }
  }
  .common-check-box-label {
    cursor: pointer;
    word-break: keep-all;
    white-space: nowrap;
    font-size: 0.75rem;
  }
}
</style>
