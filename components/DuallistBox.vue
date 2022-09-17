<template>
  <div class="duallist" :style="{ width: width, height: height }">
    <div
      class="duallist-left"
      :style="{
        width: boxWidth,
        height: boxHeight,
        color: themeStore.darkmodeColor,
      }"
    >
      <input
        type="text"
        class="duallist-searchbar"
        @input="onInputLeftSearchbar($event)"
        :style="{
          color: themeStore.darkmodeColor,
          outline: themeStore.darkmodeBorder,
        }"
        :placeholder="Util.getI18NTxt(stores, 'I18N/BUTTON/SEARCH')"
      />
      <div
        class="duallist-left-options"
        :style="{
          width: boxWidth,
          outline: themeStore.darkmodeBorder,
          height: boxHeight,
        }"
      >
        <template v-for="(option, index) in leftOptions">
          <div
            class="duallist-left-option"
            v-if="isShowLeftOption(option.text)"
            :key="option?.key"
            v-html="makeDisplayTxt(option)"
            :style="{
              backgroundColor: isSelecetedLeftOptions[index] ? '#5c6bc0' : '',
              color: isSelecetedLeftOptions[index] ? 'white' : '',
            }"
            @click="(e) => onClickLeftOption(e, index)"
          />
        </template>
      </div>
    </div>
    <div class="duallist-btns">
      <div @click="onClickSelectedRightBtn">
        <v-icon :icon="mdiChevronRight" />
      </div>
      <div @click="onClickSelectedLeftBtn">
        <v-icon :icon="mdiChevronLeft" />
      </div>
      <div @click="onClickAllRightBtn">
        <v-icon :icon="mdiChevronDoubleRight" />
      </div>
      <div @click="onClickAllLeftBtn">
        <v-icon :icon="mdiChevronDoubleLeft" />
      </div>
    </div>
    <div
      class="duallist-right"
      :style="{
        width: boxWidth,
        height: boxHeight,
        color: themeStore.darkmodeColor,
      }"
    >
      <input
        type="text"
        class="duallist-searchbar"
        :style="{
          color: themeStore.darkmodeColor,
          outline: themeStore.darkmodeBorder,
        }"
        @input="onInputRightSearchbar"
        :placeholder="Util.getI18NTxt(stores, 'I18N/BUTTON/SEARCH')"
      />
      <div
        class="duallist-left-options"
        :style="{
          width: boxWidth,
          outline: themeStore.darkmodeBorder,
          height: boxHeight,
        }"
      >
        <template v-for="(option, index) in rightOptions">
          <div
            class="duallist-right-option"
            v-if="isShowRightOption(option.text)"
            :key="option?.key"
            v-html="makeDisplayTxt(option)"
            :style="{
              backgroundColor: isSelecetedRightOptions[index] ? '#5c6bc0' : '',
              color: isSelecetedRightOptions[index] ? 'white' : '',
            }"
            @click="(e) => onClickRightOption(e, index)"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export type DuallistItem<T> = {
  text: string;
  key: string;
  data: T;
  replaceTxt: string;
  replaceTxt_length: number;
  count: number;
};
export type DuallistItems<T> = DuallistItem<T>[];

import * as Util from "@/assets/javascripts/ipedit_util";
import { onBeforeUnmount, onMounted, ref, toRef } from "vue";
import type { Ref } from "vue";
import {
  mdiChevronDoubleRight,
  mdiChevronDoubleLeft,
  mdiChevronRight,
  mdiChevronLeft,
  mdiTreasureChest,
} from "@mdi/js";
import useAppStore from "@/store/useAppStore";
import useI18NStore from "@/store/useI18NStore";
import useThemeStore from "@/store/useThemeStore";
import useWorkspaceStore from "@/store/useWorkspaceStore";

const props = withDefaults(
  defineProps<{
    modelValue: DuallistItems<any>;
    rightOptions?: DuallistItems<any>;
    width?: string;
    height?: string;
    boxWidth?: string;
    boxHeight?: string;
  }>(),
  {
    modelValue: () => [],
    width: "100%",
    height: "500px",
    boxWidth: "100%",
    boxHeight: "440px",
  }
);
const emit = defineEmits(["update:selected"]);

const appStore = useAppStore();
const i18nStore = useI18NStore();
const themeStore = useThemeStore();
const workspaceStore = useWorkspaceStore();

const stores = {
  as: appStore,
  is: i18nStore,
  ts: themeStore,
  ws: workspaceStore,
};

const isSelecetedLeftOptions = ref<boolean[]>([]);
const isSelecetedRightOptions = ref<boolean[]>([]);

const leftOptions: Ref<DuallistItems<any>> = toRef(props, "modelValue");
const rightOptions: Ref<DuallistItems<any>> = ref([]);

/**서치바 부분 */
const leftSearchbarQuery = ref<string>("");
const rightSearchbarQuery = ref<string>("");

function makeDisplayTxt(option: any) {
  let returnTxt = "";
  returnTxt = option?.text + " → " + option?.count;
  const count = Util.isKIPO(stores)
    ? "회 등장"
    : Util.isJPO(stores)
    ? "回登場"
    : " times shown";
  returnTxt = returnTxt + count;
  return returnTxt;
}

function onInputLeftSearchbar(e: Event) {
  leftSearchbarQuery.value = (e.target as HTMLInputElement).value;
}

const isShowLeftOption = (value: string) =>
  leftSearchbarQuery.value.length === 0 ||
  value.includes(leftSearchbarQuery.value);

const isShowRightOption = (value: string) =>
  rightSearchbarQuery.value.length === 0 ||
  value.includes(rightSearchbarQuery.value);

function onInputRightSearchbar(e: Event) {
  rightSearchbarQuery.value = (e.target as HTMLInputElement).value;
}

/**멀티 셀렉트 부분 */
const startIdx = ref(-1);

// 키 핸들러 함수
function onKeydownElementExtractedModal(e: KeyboardEvent) {
  if (e.shiftKey) {
    workspaceStore.isShift = true;
  } else if (e.ctrlKey) {
    workspaceStore.isCtrl = true;
  }
}

function onKeyupElementExtractedModal(e: KeyboardEvent) {
  if (e.key === "Shift") {
    workspaceStore.isShift = false;
  } else if (e.key === "Control") {
    workspaceStore.isCtrl = false;
  }
}

function initOptions() {
  isSelecetedLeftOptions.value.length = 0;
  isSelecetedRightOptions.value.length = 0;
}

function optionClickHandler(options: Ref<boolean[]>, idx: number) {
  if (workspaceStore.isShift) {
    // 쉬프트 + 클릭 시 다중 선택
    const maxIdx = Math.max(startIdx.value, idx);
    const minIdx = Math.min(startIdx.value, idx);

    options.value.length = 0;

    for (let i = minIdx; i <= maxIdx; i++) {
      options.value[i] = true;
    }
  } else if (workspaceStore.isCtrl) {
    // 컨트롤 클릭 시
    startIdx.value = idx;
    options.value[idx] = !options.value[idx];
  } else {
    startIdx.value = idx;
    const orderOptionFlag = options.value[idx];
    options.value.length = 0;
    options.value[idx] = !orderOptionFlag;
  }
}

const onClickLeftOption = (_: any, idx: number) =>
  optionClickHandler(isSelecetedLeftOptions, idx);

// 오른쪽 옵션 클릭 시
const onClickRightOption = (_: any, idx: number) =>
  optionClickHandler(isSelecetedRightOptions, idx);

// 왼쪽 옵션에서 선택한 구성요소를 오른쪽으로 보내는 버튼
function onClickSelectedRightBtn() {
  isSelecetedLeftOptions.value.forEach((flag, idx) => {
    if (flag) rightOptions.value.push(leftOptions.value[idx]);
  });
  for (let i = isSelecetedLeftOptions.value.length - 1; i >= 0; i--) {
    if (isSelecetedLeftOptions.value[i]) leftOptions.value.splice(i, 1);
  }
  isSelecetedLeftOptions.value.length = 0;
  emit("update:selected", rightOptions.value);
}

// 오른쪽 옵션에서 선택한 구성요소를 왼쪽으로 보내는 버튼
function onClickSelectedLeftBtn() {
  isSelecetedRightOptions.value.forEach((flag, idx) => {
    if (flag) leftOptions.value.push(rightOptions.value[idx]);
  });
  for (let i = isSelecetedRightOptions.value.length - 1; i >= 0; i--) {
    if (isSelecetedRightOptions.value[i]) rightOptions.value.splice(i, 1);
  }
  isSelecetedRightOptions.value.length = 0;
  emit("update:selected", rightOptions.value);
}

// 전부 오른쪽 보내는 버튼
function onClickAllRightBtn() {
  rightOptions.value.push(...leftOptions.value);
  leftOptions.value.length = 0;
  emit("update:selected", rightOptions.value);
  initOptions();
}

// 전부 왼쪽 보내는 버튼
function onClickAllLeftBtn() {
  leftOptions.value.push(...rightOptions.value);
  rightOptions.value.length = 0;
  emit("update:selected", rightOptions.value);
  initOptions();
}

// 키다운 이벤트 핸들링
onMounted(() => {
  window.addEventListener("keydown", onKeydownElementExtractedModal);
  window.addEventListener("keyup", onKeyupElementExtractedModal);
});
onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydownElementExtractedModal);
  window.removeEventListener("keyup", onKeyupElementExtractedModal);
});
</script>

<style scoped lang="scss">
.duallist {
  display: flex;
  .duallist-left,
  .duallist-right {
    flex: 1;
    width: 40%;
    height: 100%;
    border-radius: 0.25rem;
    .duallist-searchbar {
      width: 100%;
      padding: 0.5rem;
      margin-bottom: 1rem;
      height: 2.5rem;
      border-radius: 0.25rem;
      &:hover {
        outline: 1px solid var(--color-primary) !important;
      }
      &:focus {
        outline: 1px solid var(--color-primary) !important;
      }
    }

    .duallist-left-options {
      overflow: auto;
    }
    .duallist-left-option,
    .duallist-right-option {
      user-select: none;
      padding: 0.25rem 0.5rem;
      word-break: break-all;
      cursor: pointer;
      &:hover {
        background-color: #5c5bc0;
        opacity: 0.4;
        color: white;
      }
    }
  }

  .duallist-btns {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    gap: 0.5rem;
    margin: 0.625rem;
    height: 100%;
    div {
      padding: 0.125rem;
      color: gray;
      cursor: pointer;
      border-radius: 0.25rem;
      &:hover {
        opacity: 0.6;
        background-color: #efefef;
      }
    }
  }
}
</style>
