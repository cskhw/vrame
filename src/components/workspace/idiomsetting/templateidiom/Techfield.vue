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
      기술분야
    </div>
    <div class="text-500-16-black mb-4" :style="{ width: '400px' }">
      기술분야에 대한 설명이 들어갑니다
    </div>
    <TextField v-model="TechfieldTextFieldValue" />
    <div class="text-500-14-gray">
      기술분야에는 {}가 반드시 포함되어야 합니다.
    </div>
  </div>
</template>

<script setup lang="ts">
import TextField from "@/components/common/TextField.vue";
import { ref } from "vue";

const langValue = ref({ text: "KR", value: "KR" });
const TechfieldTextFieldValue = ref("");
</script>

<style lang="scss" scoped>
@import "@/styles/draft/text";
.ps-lt {
  position: absolute;
  top: 6rem;
  right: 2rem;
}
</style>
