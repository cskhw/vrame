<template>
  {{ isShowOptions }}
  <div class="r-select" :style="[__selectStyle]">
    <!-- for control select's display -->
    <input
      class="hidden-input"
      ref="hiddenInput"
      type="text"
      @focus="focusFunction"
      @blur="blurFunction"
    />
    <!-- select-value -->
    <div
      class="r-select-value"
      :style="[_selectValueStyle]"
      @mousedown.prevent
      @click.stop="onClickSelect"
    >
      <!-- select-value-slot -->
      <slot name="value" :value="modelValue">
        <div v-html="modelValue.text"></div>
      </slot>
    </div>
    <!-- select-options -->
    <div
      class="r-select-options"
      :style="[
        _optionsStyle,
        // set disabled style
        isShowOptions ? {} : { visibility: 'hidden' },
      ]"
    >
      <!-- select-option -->
      <div
        class="r-select-option"
        v-for="(option, i) of options"
        :key="i"
        @mousedown="() => onMouseDownOption(option)"
        :style="[_optionStyle]"
      >
        <!-- select-option-slot -->
        <slot name="option" :option="option" :idx="i">
          <div v-html="option.text"></div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TValue } from "vrame";
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
  selectHoverColor?: string;
  optionHoverColor?: string;
  maxOptionHeight?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const hiddenInput = ref<HTMLElement>();

const isShowOptions = ref(false);

const __selectStyle = computed(() => ({
  ...props.selectStyle,
  ...(props.disabled ? _disabledStyle.value : {}),
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
const focusFunction = () => (isShowOptions.value = true);
const blurFunction = () => (isShowOptions.value = false);

function onClickSelect() {
  if (props.disabled) return;
  if (hiddenInput.value === document.activeElement) hiddenInput.value.blur();
  else hiddenInput.value?.focus();
}

function onMouseDownOption(option: TValue) {
  console.log("onClickOption");
  emit("update:modelValue", option);
  isShowOptions.value = false;
}
</script>

<style lang="scss">
@import "@/styles/components/r-select.scss";
</style>
