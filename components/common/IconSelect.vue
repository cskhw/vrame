<template>
  <div class="common-select-wrapper">
    <!-- 셀렉트 벨류 -->
    <div
      class="common-select d-flex align-center justify-space-between"
      :class="selectClass"
      :style="[
        selectStyle ? selectStyle : {},
        outlineStyle,
        { backgroundColor: isHover ? selectHoverBgColor : '' },
      ]"
      @mousedown.prevent
      @click="onClickSelect"
    >
      <v-icon
        v-if="icon"
        class="common-select-area mr-1"
        :color="selectColor"
        :style="{ width: '1.5rem', height: '1.5rem' }"
        :icon="icon"
      />
      <v-icon
        style="width: 1.5rem; height: 1.5rem"
        :style="{
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
      <slot />
    </div>
    <!-- 셀렉트 옵션 -->
    <div
      class="common-select-options"
      :class="optionsClass"
      :style="[
        {
          height: isShowOptions ? 'max-content' : '0',
          outline: isShowOptions ? themeStore.darkmodeBorder : '',
          right: right ? '0' : '',
        },
        optionsStyle ? optionsStyle : {},
      ]"
    >
      <!-- 옵션 -->
      <div
        class="common-select-option d-flex align-center"
        :style="{
          '--color-hover': hoverColor,
          height: isShowOptions ? '100%' : '0',
          left: left ? left : '0',
        }"
        v-for="item in options"
        :key="item.text"
        @mousedown.prevent
        @click="() => onClickOption(item)"
      >
        <IconBtn
          v-if="item?.icon"
          color="#7C7F90"
          class="mr-2"
          :icon="item?.icon"
        />
        {{ item?.imgUrl }}
        <ImgBtn
          v-if="item?.imgUrl"
          color="#7C7F90"
          :imgUrl="item?.imgUrl"
          width="3rem"
          height="3rem"
        />
        <span
          :style="{
            whiteSpace: 'nowrap',
          }"
        >
          {{ item?.text }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, type CSSProperties } from "vue";
import type { OptionsType } from "@/types/tag";
import ImgBtn from "@/components/common/ImgBtn.vue";
import IconBtn from "@/components/IconBtn.vue";
import { mdiMenuDown } from "@mdi/js";
import useThemeStore from "@/store/useThemeStore";
import { rgbToRgba } from "@/assets/javascripts/utils/css";

/**
 * selectClass: select에 적용될 클래스 배열
 * selectStyle: select에 적용될 스타일 배열
 * optionsClass: option에 적용될 클래스 배열
 * optionsStyle: option에 적용될 스타일 배열
 * left: 옵션의 left값 없을 시 0
 */

const props = withDefaults(
  defineProps<{
    modelValue?: OptionsType;
    hoverColor?: string;
    border?: boolean;
    icon: string;
    selectColor?: string;
    left?: string;
    right?: boolean;
    horizontal?: boolean;
    selectClass?: string[];
    selectStyle?: CSSProperties;
    optionsClass?: string[];
    optionsStyle?: CSSProperties;
    check?: boolean;
    options: OptionsType[];
    disabled?: boolean;
    outlineColor?: string;
    selectHoverBgColor?: string;
  }>(),
  {
    hoverColor: "#5c6bc0",
    color: "white",
  }
);
const emit = defineEmits(["update:modelValue"]);

const modelValue = ref(props.modelValue);
const themeStore = useThemeStore();
const hiddenInput = ref<HTMLElement>();

// 옵션 보이는 유무
const isShowOptions = ref(false);
const isHover = ref(false);

const disabledStyle = {
  backgroundColor: "#F5F5F5",
  cursor: "unset !important",
  color: "#BDBDBD",
};

const outlineStyle = computed(() => {
  if (props.disabled) return disabledStyle;
  else {
    let outline = "";
    const outlineColor = props.outlineColor ? props.outlineColor : "#5c6bc0";
    if (props.border) {
      if (isShowOptions.value) {
        outline = "0.0625rem solid " + props.outlineColor;
      } else {
        if (isHover.value) {
          outline = `0.0625rem solid ${rgbToRgba(outlineColor, ".6")}`;
        } else {
          outline = "0.0625rem solid #dfdfdf";
        }
      }
    }
    return { outline: outline };
  }
});

// 셀랙트 클릭했을 때
function onClickSelect() {
  if (!props.disabled) {
    // 포커스가 있을 때 히든 인풋에 포커스 날려줌
    if (hiddenInput.value === document.activeElement) hiddenInput.value.blur();
    // 포커스가 없을 때 포커스 잡아줌
    else hiddenInput.value?.focus();
  }
}
// 포커스 시에 옵션 보여줌
const focusFunction = () => {
  isShowOptions.value = true;
};

// 블러 시에 옵션 가림
const blurFunction = () => {
  isShowOptions.value = false;
};

function onClickOption(option: OptionsType) {
  modelValue.value = option;
  isShowOptions.value = false;
  if (option?.func) {
    option.func();
  }
}

watch(modelValue, (newValue) => {
  emit("update:modelValue", newValue);
});

watch(props, (newValue) => {
  modelValue.value = newValue.modelValue;
});
</script>

<style lang="scss" scoped>
.common-select {
  width: max-content;
  cursor: pointer;
  background-color: transparent;
  border-radius: 0.125rem;
  z-index: 5000;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  &:active {
    background-color: rgba(255, 255, 255, 0.4);
  }
}

.common-select-options {
  z-index: 5000;
  position: absolute;
  margin-top: 0.25rem;
  border-radius: 0.25rem;
  overflow: hidden;
  background-color: white;
  flex-wrap: wrap;
}

.common-select-option {
  padding: 0.5rem;
  cursor: pointer;
  &:hover {
    background-color: var(--color-hover);
  }
}
</style>
