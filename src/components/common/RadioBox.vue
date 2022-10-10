<template>
  <div class="common-radio-box d-flex align-center" @click="onClickRadio">
    <div>
      <v-icon
        class="common-radio-box-icon"
        v-if="modelValue === props.value"
        :style="{
          width: width ? width : '1.25rem',
          height: height ? height : '1.25rem',
        }"
        :icon="mdiRadioboxMarked"
        :color="color"
      />

      <v-icon
        v-else
        class="common-radio-box-icon"
        :icon="mdiRadioboxBlank"
        :style="{
          width: width ? width : '1.25rem',
          height: height ? height : '1.25rem',
        }"
        color="#757575"
      />
    </div>
    <label
      for=".common-radio-box"
      class="d-flex align-center jusitfy-center"
      v-if="label"
    >
      <div
        class="common-radio-box-label ml-2 mt-1"
        :style="{ fontSize: props.height, ...labelStyle }"
        v-html="label"
      />
    </label>
  </div>
</template>
<script lang="ts" setup>
import { mdiRadioboxBlank, mdiRadioboxMarked } from "@mdi/js";
import { ref, watch, type CSSProperties } from "vue";

const props = defineProps<{
  modelValue: any;
  value: any;
  width?: string;
  height?: string;
  border?: string;
  color?: string;
  label?: string;
  labelStyle?: CSSProperties;
  nullable?: boolean;
}>();

const emit = defineEmits(["update:modelValue"]);
const modelValue = ref(props.modelValue);
const onClickRadio = () => {
  if (props.value === modelValue.value && props.nullable)
    modelValue.value = null;
  else modelValue.value = props.value;
};

watch(modelValue, (newValue) => {
  emit("update:modelValue", newValue);
});

watch(props, (newValue) => {
  modelValue.value = newValue.modelValue;
});
</script>
<style lang="scss" scoped>
@import "@/styles/draft/text";
.common-radio-box {
  &-icon {
    width: "max-content";
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
    &:active {
      opacity: 0.6;
    }
  }
  &-label {
    cursor: pointer;
    white-space: nowrap;
    font-size: 0.875rem;
    font-weight: 400;
  }
}
</style>
