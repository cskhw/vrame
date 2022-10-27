<template>
  <div class="components-body">
    <div class="title">r-table</div>
    <p class="text-400-20-lightgray">
      The <code class="text-bold-20-black">r-table</code> component is ui frame like html's table, th, tr... tags. You can put in styles freely via to props.
    </p>

    <div class="sub-title">props</div>
    <r-table
      v-model="propsTableItems"
      style="margin-bottom: 3rem"
      :headers="headers"
      :tableStyles="tableColumnSpec"
    >
    </r-table>
    <div class="sub-title">emits</div>
    <r-table
      v-model="emitsTableItems"
      style="margin-bottom: 3rem"
      :headers="headers"
      :tableStyles="tableColumnSpec"
    >
    </r-table>

    <div class="sub-title">Usage</div>
    <p class="text-400-20-lightgray">
      <div>
        Usage
      </div>
    </p>
  </div>
</template>
<script setup lang="ts">
import type { IpropsTable } from "@/types";
import { descriptionTableStyles } from "@/utils/common";
import { ref } from "vue"

const headers = ref(["name", "type", "description"]);
const propsTableItems = ref<IpropsTable[]>([
  {
    name: "headers",
    type: "string[]",
    desc: "Header strings.",
  },
  {
    name: "modelValue",
    type: "{ [key: string]: any }[] (object)",
    desc: `Array of object table items consisting of keys and values.`,
  },
  {
    name: "tableStyles",
    type: `ISTableStyles?:{
      <div>&nbsp;&nbsp;tableStyle?: CSSProperties;</div>
      <div>&nbsp;&nbsp;tHeaderStyle?: CSSProperties;</div>
      <div>&nbsp;&nbsp;tBodyStyle?: CSSProperties;</div>
      <div>&nbsp;&nbsp;thStyle?: (idx: number) => CSSProperties;</div>
      <div>&nbsp;&nbsp;trStyle?: (idx: number) => CSSProperties;</div>
      <div>&nbsp;&nbsp;columnStyle?: (idx: number) => CSSProperties;</div>
      <div>&nbsp;&nbsp;tdStyle?: (ridx: number, cidx: number) => CSSProperties;</div>
      }`,
    desc: `Can set table's styles:<br/> table, tHeader, tBody, thStyle, trStyle, columnStyle, tdStyle. If tableStyles's type is undefined, r-table will has default style.`,
  },
]);

const emitsTableItems = ref<IpropsTable[]>([
  {
    name: "clickTable",
    type: "(modelValue: { [key: string]: any }[]) => any",
    desc: "If you click table, emit function will run.",
  },
  {
    name: "clickTheader",
    type: "(modelValue: { [key: string]: any }[]) => any",
    desc: "If you click table's header, emit function will run.",
  },  {
    name: "clickTh",
    type: "(modelValue: { [key: string]: any }[]) => any",
    desc: "If you click table's th, emit function will run.",
  },  {
    name: "clickTbody",
    type: "(modelValue: { [key: string]: any }[]) => any",
    desc: "If you click table's body, emit function will run.",
  },  {
    name: "clickTr",
    type: "(modelValue: { [key: string]: any }[]) => any",
    desc: "If you click table's row, emit function will run.",
  },  {
    name: "clickTd",
    type: "(modelValue: { [key: string]: any }[]) => any",
    desc: "If you click table's cell(td), emit function will run.",
  },
]);
const tableColumnSpec = descriptionTableStyles
</script>
<style lang="scss"></style>
