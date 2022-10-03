<template>
  <div class="modal" v-if="isOpen">
    <!-- content-area -->
    <div class="modal-background" />

    <div
      class="modal-contents"
      :style="{
        width: width,
        left: right ? '' : left ? left : '',
        right: right ? '0' : '',
        top: top,
      }"
    >
      <div>
        <div class="ma-0 pa-6">
          <div class="d-flex align-center justify-space-between mb-5">
            <div class="text-bold-20-black">{{ title }}</div>
            <v-icon :icon="mdiClose" @click="isOpen = false" />
          </div>
          <div class="text-500-14-black">{{ description }}</div>
          <slot />

          <!-- button-area -->
          <div class="pt-3">
            <div class="mt-1"></div>

            <!-- yes버튼일 때 -->
            <div class="d-flex">
              <v-btn
                color="#5c6bc0"
                text-color="white"
                style="color: white"
                flat
                @click="yesFunc()"
                >{{ yesTxt }}</v-btn
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { mdiClose } from "@mdi/js";

defineProps<{
  title: string;
  description: string;
  yesTxt: string;
  yesFunc: (e?: any) => void;
  left: string;
  top: string;
  width: string;
  right: boolean;
}>();

const isOpen = ref(false);
const show = () => (isOpen.value = true);
const hide = () => (isOpen.value = false);

// 모달이 열리면 스크롤이 안되게 클래스 부착
watch(isOpen, () => {
  if (isOpen.value) {
    document.querySelector("html")?.classList.add("disable-scroll");
  } else {
    window.onscroll = function () {};
    document.querySelector("html")?.classList.remove("disable-scroll");
  }
});

defineExpose({ isOpen, show, hide });
</script>

<style lang="scss" scoped>
.modal {
  z-index: 9999;
  display: inline-block;
  position: fixed;
  left: 0;
  top: 0;
  .modal-background {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 9999;
  }

  .modal-contents {
    z-index: 9999;
    position: absolute;
    opacity: 1;
    background-color: white;
    border: 0.0625rem solid #eeeeee;
    box-shadow: 0rem 0.25rem 1.25rem rgba(0, 0, 0, 0.25);
    border-radius: 0.5rem;
    animation: show-modal 0.2s;
    transition: height 0s;
    @keyframes show-modal {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    .checkBox {
      width: 1rem;
      height: 1rem;
      border: 0.125rem solid #bcbcbc;
      border-radius: 0.25rem;
    }
  }
}
</style>
