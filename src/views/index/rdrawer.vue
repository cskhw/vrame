<template>
  <div class="components-body">
    <div class="title">r-drawer</div>
    <p class="text-400-20-lightgray">
      The <code class="text-bold-20-black">r-drawer</code> component is the sidebar on application's left.
    </p>

    <div class="sub-title">props</div>
    <r-table
      style="margin-bottom: 3rem"
      v-model="tableItems"
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
import { ref } from "vue"
import { descriptionTableStyles } from "@/utils/common";

const headers = ref(["name", "type", "description"]);
const tableItems = ref<IpropsTable[]>([
  {
    name: "modelValue",
    type: "boolean",
    desc: "Turn On/Off drawer.",
  },
  {
    name: "drawerStyle",
    type: "CSSProperties | boolean | undefined",
    desc: "Define r-appbar's style",
  },
  {
    name: "shadow",
    type: "string | boolean | undefined",
    desc: `If shadow's type is string, display user shadow.<br/> If shadow's type is boolean, on/off display the default shadow.`,
  },
  {
    name: "border",
    type: "string | boolean | undefined",
    desc: `If border's type is string, display user border.<br/> If border's type is boolean, on/off display the default border.`,
  },
]);
const tableColumnSpec = descriptionTableStyles
</script>
<style lang="scss"></style>
