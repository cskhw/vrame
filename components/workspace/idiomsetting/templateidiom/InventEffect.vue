<template>
  <div class="draft" :style="{ width: '400px' }">
    <v-btn
      flat
      border="none"
      :style="{
        color: '#5c6bc0',
      }"
      >초기화</v-btn
    >

    <div class="text-bold-18-black mb-2" :style="{ width: '400px' }">
      발명의 효과
    </div>
    <div class="text-500-16-black mb-6" :style="{ width: '400px' }">
      발명의 효과에 대한 설명이 들어갑니다
    </div>
    <div class="text-500-14-gray">기본</div>
    <Textarea
      v-model="basicTextFieldValue"
      height="max-content"
      minHeight="5rem"
    />
    <div class="text-500-14-gray">
      발명의 효과-기본에 {}는 반드시 포함되어야 합니다.
    </div>
    <div class="text-500-14-gray">추가</div>
    <Textarea
      v-model="addTextFieldValue"
      height="max-content"
      minHeight="5rem"
    />
    <div class="text-500-14-gray">
      해결하고자 하는 과제 아래의 '기본' 영역에 {}가 반드시 포함되어야 합니다.
    </div>
  </div>
</template>

<script setup lang="ts">
import Textarea from "@/components/common/Textarea.vue";
import { ref } from "vue";

const basicTextFieldValue = ref("");
const addTextFieldValue = ref("");
</script>

<style lang="scss" scoped>
.ps-lt {
  position: absolute;
  top: 6rem;
  right: 2rem;
}
</style>
