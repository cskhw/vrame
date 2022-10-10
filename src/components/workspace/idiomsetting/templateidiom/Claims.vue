<template>
  <div class="template-idiom-claims" :style="{ width: '400px' }">
    <v-btn
      flat
      border="none"
      :style="{
        color: '#5c6bc0',
      }"
      >초기화</v-btn
    >
    <div class="text-bold-18-black mb-2" :style="{ width: '400px' }">
      청구항
    </div>
    <div class="text-bold-16-black mb-4" :style="{ width: '400px' }">
      청구항에 대한 설명이 들어갑니다
    </div>
    <div class="text-500-14-gray">청구항 1개 인용</div>
    <Textarea
      v-model="basicTextFieldValue"
      height="max-content"
      minHeight="5rem"
    />
    <div class="text-500-14-gray">
      '청구항 1개인용'에 {}는 반드시 포함되어야 합니다.
    </div>
    <div class="text-500-14-gray">청구항 2개 인용</div>
    <Textarea
      v-model="addTextFieldValue"
      height="max-content"
      minHeight="5rem"
    />
    <div class="text-500-14-gray">
      '청구항 2개인용'에 {}는 반드시 포함되어야 합니다.
    </div>
    <div class="text-500-14-gray">청구항 3개 인용</div>
    <Textarea
      v-model="addTextFieldValue"
      height="max-content"
      minHeight="5rem"
    />
    <div class="text-500-14-gray">
      '청구항 3개인용'에 {}는 반드시 포함되어야 합니다.
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
@import "@/styles/draft/text";
.template-idiom-claims {
  overflow-x: auto;
}

.ps-lt {
  position: absolute;
  top: 6rem;
  right: 2rem;
}
</style>
