<template>
  <div
    class="fresentence pa-4"
    :style="{ border: '1px solid #e0e0e0', height: '30.1rem' }"
  >
    <div class="text-bold-18-black mt-4 mb-2" :style="{ width: '400px' }">
      자주 사용하는 문단
    </div>
    <div class="text-500-16-black mb-4" :style="{ width: '400px' }">
      자주 사용하는 문단에 대한 설명이 들어갑니다.
    </div>
    <div class="text-500-14-gray">자주 사용하는 문단 추가하기</div>
    <div class="mb-6">
      <TextField
        class="mb-2"
        v-model="autoSaveIdiomAddTextFieldValue"
        placeholder="제목"
      />
      <div :style="{ height: '0.5rem' }"></div>
      <Textarea
        minHeight="5.5rem"
        v-model="freqSentenceTextAreaValue"
        placeholder="내용"
      />
      <div :style="{ height: '0.5rem' }"></div>
      <v-btn color="#5c6bc0" text-color="white" style="color: white" flat
        >추가하기</v-btn
      >
    </div>
    <div
      class="mb-6"
      :style="{
        position: 'relative',
        width: '15rem',
        height: '2.5rem',
        borderBottom: '1px solid #e0e0e0',
      }"
    >
      <v-icon
        color="grey"
        :style="{ position: 'absolute', left: '1rem' }"
        :icon="mdiMagnify"
      />
      <input
        class="autosave-idiom-searchbar"
        :style="{ paddingLeft: '2.625rem' }"
        type="text"
        placeholder="검색"
      />
    </div>
    <div class="autosave-idiom-content">
      <div
        class="d-flex align-center mb-2"
        v-for="(item, index) in idiomData"
        :key="item.text"
      >
        <div class="mr-2" :style="{ width: '100%' }">
          <div
            class="autosave-idiom-card mr-2 mb-2"
            :style="{
              width: '100%',
              border: isClickedCards[index] ? '1px solid #5C6BC0' : '',
            }"
            @click="clickIdiomCard(index)"
          >
            {{ item.text }}
          </div>
          <div
            class="autosave-idiom-card mr-2"
            :style="{
              width: '100%',
              border: isClickedCards[index] ? '1px solid #5C6BC0' : '',
            }"
            @click="clickIdiomCard(index)"
          >
            {{ item.desc }}
          </div>
        </div>
        <IconBtn
          :style="{ width: '2.5rem' }"
          color="grey"
          :icon="mdiTrashCan"
        ></IconBtn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import IconBtn from "@/components/common/IconBtn.vue";
import Textarea from "@/components/common/Textarea.vue";
import TextField from "@/components/common/TextField.vue";
import { mdiMagnify, mdiTrashCan } from "@mdi/js";
import { ref } from "vue";

const autoSaveIdiomAddTextFieldValue = ref("");
const freqSentenceTextAreaValue = ref("");
const isClickedCards = ref([]);

const sideIndex = ref(0);
const sideItems = ref([
  {
    name: "기술분야",
  },
  {
    name: "해결하고자 하는 과제",
  },
  {
    name: "발명의 효과",
  },
  {
    name: "청구항",
  },
  {
    name: "상세한 설명",
  },
  {
    name: "의견서",
  },
]);
const idiomData = ref([
  { text: "할 수 있다.", desc: "할 수 있다." },
  { text: "할 수 있다.", desc: "할 수 있다." },
  { text: "할 수 있다.", desc: "할 수 있다." },
  { text: "할 수 있다.", desc: "할 수 있다." },
  { text: "할 수 있다.", desc: "할 수 있다." },
]);

const clickIdiomCard = (index: number) => {
  isClickedCards.value.length = 0;
  isClickedCards.value[index] = true;
};
</script>

<style lang="scss" scoped>
input {
  &:focus {
    outline: none;
  }
}
.fresentence {
  overflow: auto;
}
.autosave-idiom-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 8px 12px;
  cursor: pointer;
}
.autosave-idiom-content {
  overflow: auto;
}
</style>
