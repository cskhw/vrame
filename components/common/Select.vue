<template>
  <div
    class="common-select"
    :style="[
      selectLocalStyle,
      selectStyle ? selectStyle : {},
      outlineStyle,
      { backgroundColor: isHover ? selectHoverBgColor : '' },
    ]"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
    @mousedown.prevent
    @click="onClickSelect"
  >
    <div
      class="common-select-value d-flex align-center justify-space-between"
      :class="selectClass"
      :style="{ cursor: disabled ? 'unset' : 'pointer', color: selectColor }"
      v-if="modelValue?.text"
    >
      <div style="width: 100%">
        {{ staticName ? staticName : modelValue.text }}
      </div>
      <IconBtn v-if="!disabled && downIcon" :icon="mdiChevronDown" />
      <v-icon
        v-if="!disabled && downFullIcon"
        :style="{
          width: '1.5rem',
          height: '1.5rem',
          color: selectColor,
        }"
        :icon="mdiMenuDown"
      />
      <input
        type="text"
        ref="hiddenInput"
        @focus="focusFunction"
        @blur="blurFunction"
        style="width: 0rem; height: 0rem"
      />
    </div>
    <!-- 셀렉트 옵션 -->
    <div
      class="common-select-options"
      :class="{ 'd-flex': horizontal }"
      :style="{
        width: isShowOptions ? '100%' : '0',
        height: isShowOptions ? 'max-content' : '0',
        outline: isShowOptions ? themeStore.darkmodeBorder : '',
        left: left ? left : '',
        maxHeight: optionsMaxHeight,
        backgroundColor: 'white',
        color: 'black',
        ...optionsStyle,
      }"
    >
      <div
        class="common-select-option"
        :class="optionsClass"
        :style="{
          '--color-hover': optionHoverColor
            ? optionHoverColor
            : rgbToRgba('#5c6bc0', '0.2'),
        }"
        v-for="item in options"
        :key="item.text"
        @click="
          modelValue = item;
          isShowOptions = false;
          item?.func ? item.func() : false;
        "
      >
        {{ item.text }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { rgbToRgba } from "@/assets/javascripts/utils/css";
import IconBtn from "@/components/IconBtn.vue";
import { mdiChevronDown, mdiMenuDown } from "@mdi/js";
import { computed, ref, watch, type CSSProperties } from "vue";
import useThemeStore from "@/store/useThemeStore";

type OptionsType = {
  text: string;
  value?: unknown;
  imgUrl?: string;
  func?: () => unknown;
};

/**
 * selectClass: select에 적용될 클래스 배열
 * selectStyle: select에 적용될 스타일 배열
 * optionsClass: option에 적용될 클래스 배열
 * optionsStyle: option에 적용될 스타일 배열
 */

const props = defineProps<{
  modelValue?: OptionsType;
  outlineColor?: string;
  horizontal?: boolean;
  selectClass?: string[];
  selectStyle?: CSSProperties;
  selectHoverBgColor?: string;
  selectColor?: string;
  optionsClass?: string[];
  optionsStyle?: CSSProperties;
  optionHoverColor?: string;
  optionsMaxHeight?: string;
  left?: string;
  staticName?: string;
  downIcon?: boolean;
  downFullIcon?: boolean;
  options?: Array<OptionsType>;
  disabled?: boolean;
  showBorder?: boolean;
}>();

const emit = defineEmits(["update:modelValue"]);

const modelValue = ref(props.modelValue);
const themeStore = useThemeStore();

const hiddenInput = ref<HTMLElement>();

// 옵션 보이는 유무
const isShowOptions = ref(false);
// 마우스 호버시
const isHover = ref(false);

const selectLocalStyle: CSSProperties = {
  position: "relative",
  borderRadius: "0.125rem",
  whiteSpace: "nowrap",
};

const disabledStyle = {
  backgroundColor: "#F5F5F5",
  cursor: "unset !important",
  outline: themeStore.darkmodeBorder,
  color: "#BDBDBD",
};

const outlineStyle = computed(() => {
  if (props.disabled) return disabledStyle;
  else {
    let outline = "";
    const outlineColor = props.outlineColor ? props.outlineColor : "#5c6bc0";
    if (props.showBorder) {
      if (isShowOptions.value) {
        // 클릭 했을 때
        outline = "0.0625rem solid " + props.outlineColor;
      } else {
        if (isHover.value) {
          // 마우스 호버
          outline = `0.0625rem solid ${rgbToRgba(outlineColor, ".6")}`;
        } else {
          outline = themeStore.darkmodeBorder;
        }
      }
    }
    return { outline: outline };
  }
});

// 셀랙트 클릭했을 때
function onClickSelect() {
  if (props.disabled) return;
  // 포커스가 있을 때 히든 인풋에 포커스 날려줌
  if (hiddenInput.value === document.activeElement) hiddenInput.value.blur();
  // 포커스가 없을 때 포커스 잡아줌
  else hiddenInput.value?.focus();
}
// 포커스 시에 옵션 보여줌
const focusFunction = () => {
  isShowOptions.value = true;
};

// 블러 시에 옵션 가림
const blurFunction = () => {
  isShowOptions.value = false;
};

watch(modelValue, (newValue) => {
  emit("update:modelValue", newValue);
});

watch(props, (newValue) => {
  modelValue.value = newValue.modelValue;
});
</script>

<style lang="scss" scoped>
@import "@/assets/stylesheets/draft/text";

.common-select {
  .common-select-value {
    cursor: pointer;
    padding: 0.6563rem 0.75rem;
    width: 100%;
    height: 100%;
    font-size: 0.875rem;
    font-weight: 400;
    position: relative;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .common-select-options {
    overflow-x: hidden;
    z-index: 10000;
    box-sizing: content-box;

    margin-top: 0.125rem;

    position: absolute;
    max-height: 22rem;

    border-radius: 0.25rem;
  }

  .common-select-option {
    cursor: pointer;
    padding: 0.625rem;
    width: 100%;
    height: max-content;
    z-index: 10000;

    &:hover {
      background-color: var(--color-hover);
      opacity: 1;
    }
  }
}
</style>
