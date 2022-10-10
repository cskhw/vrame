<template>
  <div class="draft" :style="{ width: '400px' }">
    <v-btn
      class="ps-lt"
      flat
      border="none"
      :style="{
        color: '#5c6bc0',
      }"
      >초기화</v-btn
    >

    <div class="text-bold-18-black mb-2" :style="{ width: '400px' }">
      의견서
    </div>
    <div class="text-500-16-black mb-6" :style="{ width: '400px' }">
      의견서에 대한 설명이 들어갑니다
    </div>
    <div class="text-500-14-gray">도입</div>
    <Textarea
      v-model="basicTextFieldValue"
      height="max-content"
      minHeight="5rem"
    />
    <div class="text-500-14-gray">동해물과 백두산이</div>
    <div class="text-500-14-gray">결론</div>
    <Textarea
      v-model="addTextFieldValue"
      height="max-content"
      minHeight="5rem"
    />
    <div class="text-500-14-gray">동해물과 백두산이</div>
  </div>
</template>

<script setup lang="ts">
import Textarea from "@/components/common/Textarea.vue";
import { ref } from "vue";

const basicTextFieldValue = ref("");
const addTextFieldValue = ref("");
</script>

<style lang="scss" scoped>
@import "@/styles/draft/text";
.ps-lt {
  position: absolute;
  top: 6rem;
  right: 2rem;
}
</style>
