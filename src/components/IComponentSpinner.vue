<template>
  <div
    v-if="isOpen"
    class="ipac-spinner d-flex justify-center align-center"
    :style="{
      backgroundColor: stores.ts.darkmodeBackgroundColor,
      ...spinnerStyle,
      ...containerStyle,
    }"
  >
    <v-progress-circular
      indeterminate
      :color="loadingColor"
      :width="spinnerStyle.thickness"
      :size="spinnerStyle.size"
    />
  </div>
</template>
<script setup lang="ts">
import colors from "@/assets/javascripts/colors";
import * as Util from "@/assets/javascripts/ipedit_util";
// 스토어 import
import useAppStore from "@/store/useAppStore";
import useI18NStore from "@/store/useI18NStore";
import useModalStore from "@/store/useModalStore";
import useThemeStore from "@/store/useThemeStore";
import useUserStore from "@/store/useUserStore";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import { computed, ref, type CSSProperties, type Ref } from "vue";

withDefaults(
  defineProps<{
    containerStyle?: CSSProperties;
    spinnerStyle?: {
      // 로딩 스피너 두께
      thickness?: string;
      // 크기
      size?: number;
    };
  }>(),
  {
    containerStyle: () => ({
      width: "100%",
      height: "100%",
    }),
    spinnerStyle: () => ({
      thickness: "7",
      size: 50,
    }),
  }
);

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

// 스피너 기본 스타일
const spinnerOpacityStyle: CSSProperties = {
  position: "absolute",
  top: 0,
  width: "100%",
  height: "100%",
  backgroundColor: themeStore.darkmodeBackgroundColor,
};

// 스피너 반투명 스타일
const spinnerTranslucentStyle: CSSProperties = {
  position: "absolute",
  top: 0,
  width: "100%",
  height: "100%",
  backgroundColor: themeStore.darkmodeBackgroundColor,
  opacity: 0.6,
};

const spinnerStyle = ref<CSSProperties>(spinnerOpacityStyle);

/** 스피너 스타일 설정
 * @param {"opacity" | "translucent"} style 스피터 스타일 설정 타입 default: 기본, ht: 반투명
 * @returns {void} void
 */
function _setSpinnerStyle(style: "opacity" | "translucent"): void {
  if (style === "opacity") spinnerStyle.value = spinnerOpacityStyle;
  else if (style === "translucent")
    spinnerStyle.value = spinnerTranslucentStyle;
}

// 테마색 없으면 기본색 넣어줌
const loadingColor = computed(() => {
  const color = Util.getColor(stores, "PRIMARY");
  if (color === "NULLCOLOR") return colors.MAIN;
  return color;
});

const isOpen = ref(false);
const onSpin = () => (isOpen.value = true);
const offSpin = () => (isOpen.value = false);

// 사용할 때 스피너의 ref가 created에선 아직 할당되지 않았으므로 () => spinner.value.setSpinner(anyFunction)() 와 같이 사용해야함
function setSpinner<F extends (...args: any[]) => any>(
  fn: F,
  type: "opacity" | "translucent" = "opacity",
  status?: Ref<boolean>
): F {
  _setSpinnerStyle(type);
  return <F>async function (...args: any[]) {
    onSpin();
    if (status) status.value = true;
    let result: any;
    try {
      result = await fn(...args);
    } catch (e) {
      throw e;
    } finally {
      offSpin();

      // 테스트 용

      // setTimeout(() => {
      //   offSpin();
      // }, 3000);
      if (status) status.value = false;
    }
    return result;
  };
}

defineExpose({
  isOpen,
  onSpin,
  offSpin,
  setSpinner,
});
</script>
<style lang="scss" scoped>
.ipac-spinner {
  position: relative;
  z-index: 99999999999999999999;
}
</style>
