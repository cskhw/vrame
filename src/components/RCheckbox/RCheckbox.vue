<template>
  <div id="r-checkbox" class="r-checkbox" @click="onClickRadioBox">
    <div>
      <r-icon
        :style="[_checkboxStyle]"
        class="r-check-box-icon"
        :icon="radioboxIcon"
        :width="width"
        :height="height"
        :color="bgColor"
        :viewBox="viewBox"
      />
    </div>
    <label for=".r-check-box" class="d-flex align-center jusitfy-center">
      <slot name="label">
        <div
          v-if="label"
          class="r-check-box-label"
          :style="[_labelStyle]"
          v-html="label"
        ></div>
      </slot>
    </label>
  </div>
</template>
<script lang="ts" setup>
import colors from "@/utils/colors";
import { mdiCheckboxBlankOutline, mdiCheckboxMarked } from "@mdi/js";
import { computed, type CSSProperties, type StyleValue } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    checkboxStyle?: CSSProperties;
    width?: number | string;
    height?: number | string;
    label?: string;
    labelStyle?: CSSProperties;
    viewBox?: string;
    color?: string;
    disabled?: boolean;
  }>(),
  {}
);

const _checkboxStyle = computed(() => ({
  ...props.checkboxStyle,
  opacity: props.disabled ? ".2" : "",
}));

const _labelStyle = computed(() => ({
  color: colors.lightGray,
  ...props.labelStyle,
}));

const emit = defineEmits(["update:modelValue"]);

const defaultColor = props.color ? props.color : "#1188ff";
const bgColor = computed(() => {
  if (props.modelValue) {
    return props.disabled ? defaultColor : defaultColor;
  } else {
    return props.disabled ? colors.lightGray : colors.lightGray;
  }
});

const radioboxIcon = computed(() =>
  props.modelValue ? mdiCheckboxMarked : mdiCheckboxBlankOutline
);

function onClickRadioBox() {
  console.log("click");
  if (!props.disabled) emit("update:modelValue", !props.modelValue);
}
</script>
<style lang="scss">
@import "@/styles/components/r-checkbox.scss";
</style>
