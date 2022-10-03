<template>
  <div class="modal-wrapper" v-if="isOpen">
    <!-- 모달 컨텐츠 -->
    <div
      class="modal-body"
      ref="modalBody"
      :style="{
        left: left + 'px',
        top: top + 'px',
        opacity: modalOpaSliderValue,
        backgroundColor: stores.ts.darkmodeBackgroundColor,
      }"
    >
      <!-- 모달 헤더 -->
      <div
        class="modal-header d-flex align-center justify-space-between px-4"
        :style="{
          backgroundColor: stores.ts.darkmodeBackgroundColor,
        }"
      >
        <div
          class="modal-title text-700-20-black pb-4"
          :class="{ 'pt-7': title, 'pt-2': !title }"
          @mousedown="onMouseDownModalHeader"
          @mouseup="onMouseUpModalHeader"
          @click="onMouseUpModalHeader"
          :style="{
            color: stores.ts.darkmodeColor,
          }"
        >
          {{ title }}
        </div>
        <div class="d-flex align-center" :class="{ 'pt-3': title }">
          <template v-if="opacityBar && !disabled">
            <IconBtn
              class="mr-2"
              :color="Util.getColor(stores, 'PRIMARY')"
              :icon="mdiCircleOpacity"
            />
            <v-slider
              class="mr-4"
              :style="{ width: '5rem', height: '1.875rem', zIndex: '10000' }"
              v-model="modalOpaSliderValue"
              track-color="#7C7F90"
              :color="Util.getColor(stores, 'PRIMARY')"
              max="1"
              step="0.01"
              min="0.2"
            />
          </template>
          <IconBtn
            v-if="closeBtn && !disabled"
            :icon="mdiClose"
            @click="() => (closeFunc ? closeFunc() : '')"
          />
        </div>
      </div>
      <div class="modal-contents mx-4 mb-2">
        <div class="description pt-2">{{ description }}</div>

        <slot />
      </div>

      <!-- button-area -->
      <!-- no버튼일 때 -->
      <div
        style="padding: 1rem"
        :style="{
          borderTop: stores.ts.darkmodeBorder,
        }"
      >
        <div
          class="d-flex"
          :class="{ 'justify-space-between': check, 'justify-end': !check }"
          v-if="buttonType === 'N'"
        >
          <div class="d-flex align-center mr-4" v-if="check">
            <input
              class="mr-4"
              :style="{ width: '0.9375rem', height: '0.9375rem' }"
              type="checkbox"
              v-model="isChecked"
            />
            <span :style="{ fontSize: '0.875rem' }">{{ checkTxt }}</span>
          </div>
          <v-btn
            :disabled="disabled"
            flat
            border="none"
            :style="{
              backgroundColor: Util.getColor(stores, 'BUTTON'),
              color: Util.getColor(stores, 'BUTTON_TEXT'),
              fontWeight: '400',
              fontSize: '0.875rem',
            }"
            @click="isOpen = false"
            >{{ noTxt }}</v-btn
          >
        </div>
        <!-- yes버튼일 때 -->
        <div
          class="d-flex"
          :class="{ 'justify-space-between': check, 'justify-end': !check }"
          v-else-if="buttonType === 'Y'"
        >
          <div class="d-flex align-center mr-4" v-if="check">
            <input
              class="mr-4"
              :style="{ width: '0.9375rem', height: '0.9375rem' }"
              type="checkbox"
              v-model="isChecked"
            />
            <span :style="{ fontSize: '0.875rem' }">{{ checkTxt }}</span>
          </div>
          <v-btn
            :disabled="disabled"
            color="#5c6bc0"
            text-color="white"
            style="color: white"
            flat
            @click="yesFunc"
            >{{ yesTxt }}</v-btn
          >
        </div>
        <!-- buttonType === NY모드일 때 -->
        <div
          class="d-flex"
          :class="{
            'justify-space-between': check || deleteBtn,
            'align-center': check,
            'justify-end': !check,
          }"
          v-else-if="buttonType === 'NY'"
        >
          <div class="d-flex align-center mr-4" v-if="check">
            <input class="mx-1" type="checkbox" v-model="isChecked" />
            <span :style="{ fontSize: '0.875rem' }">{{ checkTxt }}</span>
            {{ deleteBtn }}
          </div>
          <v-btn
            v-if="deleteBtn"
            flat
            border="none"
            :disabled="disabled"
            :style="{
              color: Util.getColor(stores, 'BUTTON'),
              backgroundColor: stores.ts.darkmodeBackgroundColor,
            }"
            @click="deleteFunc"
            >{{ deleteTxt }}</v-btn
          >
          <div>
            <v-btn
              class="mr-2"
              flat
              border="none"
              :disabled="disabled"
              :style="{
                backgroundColor: stores.ts.isDarkmode
                  ? stores.ts.darkmodePalette.backgroundColor
                  : '',
                color: Util.getColor(stores, 'BUTTON'),
              }"
              @click="noFunc"
              >{{ noTxt }}</v-btn
            >
            <v-btn
              :disabled="disabled"
              :style="{
                backgroundColor: Util.getColor(stores, 'BUTTON'),
                color: Util.getColor(stores, 'BUTTON_TEXT'),
              }"
              flat
              @click="yesFunc"
              >{{ yesTxt }}</v-btn
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import IconBtn from "@/components/common/IconBtn.vue";
import { mdiCircleOpacity, mdiClose } from "@mdi/js";
import * as Util from "@/assets/javascripts/ipedit_util";
// 스토어 import
import useAppStore from "@/store/useAppStore";
import useI18NStore from "@/store/useI18NStore";
import useModalStore from "@/store/useModalStore";
import useThemeStore from "@/store/useThemeStore";
import useUserStore from "@/store/useUserStore";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import { ref, watch } from "vue";

const props = defineProps<{
  title?: string;
  description?: string;
  check?: boolean;
  checkTxt?: string;
  buttonType?: string;
  noTxt?: string;
  yesTxt?: string;
  deleteTxt?: string;
  noFunc?: (...payload: any[]) => void;
  yesFunc?: (...payload: any[]) => void;
  deleteFunc?: (...payload: any[]) => void;
  deleteBtn?: boolean;
  opacityBar?: boolean;
  closeBtn?: boolean;
  closeFunc?: (...payload: any[]) => void;
  disabled?: boolean;
  left?: number;
  top?: number;
}>();

// 전역 변수
const appStore = useAppStore();
const userStore = useUserStore();
const modalStore = useModalStore();
const i18nStore = useI18NStore();
const themeStore = useThemeStore();
const workspaceStore = useWorkspaceStore();

const stores = {
  as: appStore,
  us: userStore,
  ms: modalStore,
  is: i18nStore,
  ts: themeStore,
  ws: workspaceStore,
};

const isOpen = ref(false);
const show = () => (isOpen.value = true);
const hide = () => (isOpen.value = false);

// modal의  left, top값
const left = ref(Math.ceil(window.innerWidth / 2));
const top = ref(Math.ceil(window.innerHeight / 2));

const modalBody = ref<HTMLElement>();
const modalOpaSliderValue = ref<number>(1);

const onMouseMoveModalHeader = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  // client 너비, 높이 가져옴
  let documentWidth = document.body.clientWidth;
  let documentHeight = document.body.clientHeight;
  // 모달 너비, 높이 가져옴
  let modalContentWidth = modalBody.value?.clientWidth;
  let modalContentHeight = modalBody.value?.clientHeight;
  // undefined 처리
  if (modalContentWidth !== undefined && modalContentHeight !== undefined) {
    left.value = e.clientX - Math.ceil(modalContentWidth / 2);
    top.value = e.clientY - 16;
    // left 값이 윈도우 client창 안으로 들어가도록 함
    if (left.value < 0) left.value = 0;
    if (left.value > documentWidth - modalContentWidth)
      left.value = documentWidth - modalContentWidth;
    if (top.value < 0) top.value = 0;
    if (top.value > documentHeight - modalContentHeight)
      top.value = documentHeight - modalContentHeight;
  }
};

const onMouseDownModalHeader = (e: MouseEvent) => {
  console.log(e.target);
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  window.addEventListener("mousemove", onMouseMoveModalHeader);
};

const onMouseUpModalHeader = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  window.removeEventListener("mousemove", onMouseMoveModalHeader);
};

// 모달이 열리면 스크롤이 안되게 클래스 부착
watch(isOpen, () => {
  if (isOpen.value) {
    document.querySelector("html")?.classList.add("disable-scroll");
  } else {
    window.onscroll = function () {};
    document.querySelector("html")?.classList.remove("disable-scroll");
  }
});

watch(modalBody, () => {
  // 드래그 모달 뜰 때 위치 중앙으로 이동시킴
  if (isOpen.value) {
    const modalContentsHalfWidth = modalBody.value?.clientWidth;
    const modalContentsHalfHeight = modalBody.value?.clientHeight;
    if (modalContentsHalfWidth && modalContentsHalfHeight) {
      left.value = props.left
        ? props.left
        : Math.ceil(window.innerWidth / 2) - modalContentsHalfWidth / 2;
      top.value = props.top
        ? props.top
        : Math.ceil(window.innerHeight / 2) - modalContentsHalfHeight / 2;
    }
  }
});
defineExpose({ isOpen, show, hide });
</script>

<style lang="scss" scoped>
.modal-wrapper {
  z-index: 1;
  display: grid;
  place-content: center;

  .modal-body {
    position: absolute;
    opacity: 1;
    background-color: white;
    box-shadow: 0rem 0.625rem 1.875rem rgba(0, 0, 0, 0.1);
    border-radius: 0.5rem;

    .modal-header {
      max-height: max-content;
      background-color: white;
      border-radius: 0.5rem;

      .modal-title {
        font-weight: bold;
        width: 100%;
        cursor: move;
      }
    }
    .modal-header-divider {
      cursor: move;
    }

    .title {
      font-weight: 600;
      font-size: 1.5rem;
      line-height: 1.8125rem;
      color: #1b1a1b;
    }
    .description {
      font-weight: 500;
      font-size: 1.125rem;
      line-height: 1.5rem;
      color: #1b1a1b;
    }

    .checkBox {
      width: 1rem;
      height: 1rem;
      border: 0.125rem solid #bcbcbc;
      border-radius: 0.25rem;
    }
    // v-slider 버튼
    ::v-deep(.v-slider-thumb__surface) {
      width: 0.625rem !important;
      height: 0.625rem !important;
    }
    // v-slider 버튼 리플
    ::v-deep(.v-slider-thumb__ripple) {
      width: 0.625rem !important;
      height: 0.625rem !important;
    }
  }
}
</style>
