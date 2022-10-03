<template>
  <div class="modal-wrapper" v-if="appStore.isTipLoading">
    <div class="modal-backgrounds" />
    <!-- content-area -->
    <div class="modal-contents d-flex flex-column">
      <v-progress-circular
        indeterminate
        :color="loadingColor"
        width="7"
        :size="50"
        style="margin-bottom: 4rem"
      />
      <div
        class="d-flex flex-column align-center justify-center"
        style="
          border-top: 0.0625rem solid #e0e0e0;
          border-bottom: 0.0625rem solid #e0e0e0;
        "
      >
        <div
          style="margin: 1rem 0; font-weight: bold"
          :style="{ color: loadingColor }"
        >
          TIP
        </div>
        <div
          class="text-400-16-black mb-4"
          style="width: 25rem; height: max-content; text-align: center"
          v-html="tipsData[0].tip_contents"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import useAppStore from "@/store/useAppStore";
import { useI18n } from "vue-i18n";
import type { TipItem } from "@/types/draft";

const appStore = useAppStore();

// 폴더 이미지 url
const loadingColor = computed(() => {
  let color = localStorage.getItem("loadingColor");
  return color ? color : "#5c6bc0";
});

/**tip 팁 */
const { tm } = useI18n();

// 랜덤 난수 생성
function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const tipsData = computed(() => {
  const orgTips = [...tm("common_tips")];
  const tips: TipItem[] = [];
  let i = 0;
  // 랜덤으로 tips 넣음
  while (tips.length < 1 && orgTips?.length > 0) {
    if (i > 100) break;
    const tipsLen = orgTips.length;
    const idx = rand(0, tipsLen - 1);
    tips.push(orgTips[idx]);
    orgTips.splice(idx, 1);
    i++;
  }
  return tips;
});
</script>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.modal-wrapper {
  z-index: 9999999999999;
  display: grid;
  place-content: center;
  width: 100vw;
  height: 100vh;
  .modal-backgrounds {
    z-index: 9999999999999;
    position: fixed;
    width: 100vw;
    height: 100vh;
    // background-color: rgba(0, 0, 0, 0.7);
    background-color: white;
  }
  .modal-contents {
    z-index: 9999999999999 !important;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh !important;
    opacity: 1;
  }
}
</style>
