<template>
  <div class="modal-wrapper" v-if="appStore.isLoading">
    <div class="modal-backgrounds" />
    <!-- content-area -->
    <div class="modal-contents d-flex">
      <v-progress-circular
        indeterminate
        :color="loadingColor"
        width="7"
        :size="50"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import useAppStore from "@/store/useAppStore";

const appStore = useAppStore();

// 폴더 이미지 url
const loadingColor = computed(() => {
  let color = localStorage.getItem("loadingColor");
  return color ? color : "#5c6bc0";
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
    background-color: rgba(255, 255, 255, 0.1);
  }
  .modal-contents {
    z-index: 9999999999999 !important;
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    width: 100vw;
    height: 100vh !important;
  }
}
</style>
