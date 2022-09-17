<template>
  <CommonSidebar class="mr-2" v-model="sideIndex" :sideItems="sideItems"
    ><Techfield v-if="sideIndex === 0" />
    <TasksToDo v-if="sideIndex === 1" />
    <InventEffect v-if="sideIndex === 2" />
    <Claims v-if="sideIndex === 3" />
    <DetailDesc v-if="sideIndex === 4" />
    <Opinion v-if="sideIndex === 5" />
  </CommonSidebar>
</template>

<script lang="ts" setup>
import CommonSidebar from "@/components/common/Sidebar.vue";
import Claims from "@/components/workspace/idiomsetting/templateidiom/Claims.vue";
import DetailDesc from "@/components/workspace/idiomsetting/templateidiom/DetailDesc.vue";
import InventEffect from "@/components/workspace/idiomsetting/templateidiom/InventEffect.vue";
import Opinion from "@/components/workspace/idiomsetting/templateidiom/Opinion.vue";
import TasksToDo from "@/components/workspace/idiomsetting/templateidiom/TasksToDo.vue";
import Techfield from "@/components/workspace/idiomsetting/templateidiom/Techfield.vue";
import { ref } from "vue";

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
</script>

<style lang="scss"></style>
