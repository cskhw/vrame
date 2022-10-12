<template>
  <div
    class="r-table"
    :style="[tableStyles?.tableStyle || {}]"
    @click="onClickTable"
  >
    <!-- header -->
    <div
      class="r-table-header"
      :style="[tableStyles?.tHeaderStyle || {}]"
      @click="onClickTheader"
    >
      <div
        class="r-table-th"
        v-for="(header, i) of headers"
        :key="i"
        :style="[tableStyles?.thStyle ? tableStyles?.thStyle(i) : {}]"
        @click="() => onClickTh(header)"
      >
        <slot name="header" :idx="i" :header="header"
          ><div v-html="header"></div
        ></slot>
      </div>
    </div>
    <!-- body -->
    <div
      class="r-table-body"
      :style="[tableStyles?.tBodyStyle || {}]"
      @click="onClickTBody"
    >
      <!-- tr -->
      <div
        v-for="(row, i) of modelValue"
        class="r-table-tr"
        :style="[tableStyles?.trStyle ? tableStyles.trStyle(i) : {}]"
        @click="() => onClickTr(row)"
      >
        <!-- td -->
        <div
          class="r-table-td"
          v-for="(td, _, j) in row"
          :style="[
            tableStyles?.tdStyle ? tableStyles.tdStyle(i, j) : {},
            tableStyles?.columnStyle ? tableStyles.columnStyle(j) : {},
          ]"
          @click="() => onClickTd(td)"
        >
          <slot name="td" :rIdx="i" :cIdx="j" :td="td"
            ><div v-html="td"></div
          ></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ISTableStyles } from "vrame";

// props 데이터 없을 때 초기값 설정
const props = defineProps<{
  headers: string[];
  modelValue: { [key: string]: any }[];
  tableStyles?: ISTableStyles;
}>();

// emits
const emit = defineEmits<{
  (e: "clickTable", items: { [key: string]: any }[]): void;
  (e: "clickTheader", headers: any[]): void;
  (e: "clickTh", item: any): void;
  (e: "clickTbody", item: any): void;
  (e: "clickTr", item: any): void;
  (e: "clickTd", item: any): void;
  (e: "update:modelValue", modelValue: any): void;
}>();

const onClickTable = () => {
  emit("clickTable", props.modelValue);
};

const onClickTheader = () => {
  emit("clickTheader", props.headers);
};

const onClickTh = (header: any) => {
  emit("clickTh", header);
};

const onClickTBody = () => {
  emit("clickTbody", props.modelValue);
};

const onClickTr = (row: any) => {
  emit("clickTr", row);
};
const onClickTd = (td: any) => {
  emit("clickTd", td);
};
</script>
<style lang="scss">
@import "@/styles/components/r-table.scss";
</style>
