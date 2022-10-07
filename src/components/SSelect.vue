<template>
  {{ isShowOptions }}
  <div class="s-select" :style="[__selectStyle]" @mousedown.stop>
    <!-- for control select's display -->
    <input
      type="text"
      ref="hiddenInput"
      @focus="focusFunction"
      @blur="blurFunction"
    />
    <!-- select-value -->
    <div
      class="s-select-value"
      :style="[_selectValueStyle]"
      @mousedown.stop
      @click.stop="onClickSelect"
    >
      <slot name="value" :value="modelValue">
        <div v-html="modelValue.text"></div>
      </slot>
    </div>
    <!-- select-options -->
    <div v-show="isShowOptions" class="s-options" :style="[_optionsStyle]">
      <div
        v-for="(option, i) of options"
        class="s-option"
        :style="[_optionStyle]"
        :key="i"
        @mousedown="() => onMouseDownOption(option)"
      >
        {{ option.text }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TValue } from "@/types/components";
import { computed, ref, type CSSProperties } from "vue";

const props = defineProps<{
  modelValue: TValue;
  options?: Array<TValue>;
  selectStyle?: CSSProperties;
  selectValueStyle?: CSSProperties;
  optionsStyle?: CSSProperties;
  optionStyle?: CSSProperties;
  disabled?: boolean;
  disabledStyle?: CSSProperties;
}>();

const emit = defineEmits(["update:modelValue"]);

const hiddenInput = ref<HTMLElement>();

const isShowOptions = ref(false);

const __selectStyle = computed(() => ({
  ...props.selectStyle,
  ...(props.disabled ? props.disabledStyle : {}),
}));

const _selectValueStyle = computed(() => ({
  cursor: props.disabled ? "unset" : "pointer",
  ...props.selectValueStyle,
}));

const _optionsStyle = computed(() => ({
  ...props.optionsStyle,
}));

const _optionStyle = computed(() => ({
  ...props.optionStyle,
}));

const _disabledStyle = computed(() => ({
  backgroundColor: "#F5F5F5",
  cursor: "unset !important",
  color: "#BDBDBD",
  ...props.disabledStyle,
}));

/**event handler function */
const focusFunction = () => {
  console.log("focus");
  isShowOptions.value = true;
};
const blurFunction = () => {
  console.log("blur");
  isShowOptions.value = false;
};

function onClickSelect() {
  if (props.disabled) return;
  console.log(hiddenInput.value, document.activeElement);
  if (hiddenInput.value === document.activeElement) hiddenInput.value.blur();
  else {
    hiddenInput.value?.focus();
  }
}

function onMouseDownOption(option: TValue) {
  console.log("onClickOption");
  emit("update:modelValue", option);
  isShowOptions.value = false;
}

// watch(props, (newValue) => {
//   emit("update:modelValue", newValue.modelValue);
// });
</script>

<style lang="scss" scoped>
@import "@/assets/stylesheets/colors.scss";
.s-select {
  cursor: pointer;
  .s-select-value {
    outline: 1px solid $border-color;
    border-radius: 4px;
    padding: 8px 12px;
  }
  .s-options {
    outline: 1px solid $border-color;
    border-radius: 4px;
    .s-option {
      padding: 8px 12px;
    }
  }
}
</style>
