<template>
  <div class="components-body">
    <div class="title">r-footer</div>
    <p class="text-400-20-lightgray">
      The <code class="text-bold-20-black">r-appbar</code> component is fixed to
      the top of the app.
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
import { descriptionTableStyles } from "@/utils/common";
import { ref } from "vue";

const headers = ref(["name", "type", "description"]);
const tableItems = ref<IpropsTable[]>([
  {
    name: "appBarStyle?",
    type: "CSSProperties | boolean",
    desc: "Define r-appbar's style",
  },
  {
    name: "drawerIcon?",
    type: "string | boolean",
    desc: `If drawerIcons'type is string, display the user icon that in/off drawer.<br/>If drawerIcon's type is boolean, on/off display the default icon that on/off drawer.`,
  },
  {
    name: "shadow?",
    type: "string | boolean",
    desc: `If shadow's type is string, display user shadow.`,
  },
  {
    name: "border?",
    type: "string | boolean",
    desc: `If border's type is string, display user border.`,
  },
]);
const tableColumnSpec = descriptionTableStyles
</script>
<style lang="scss"></style>
