<template>
  <div class="components-body">
    <div class="title">s-list</div>
    <p class="text-400-20-lightgray">
      The <code class="text-bold-20-black">s-list</code> component is used to show several menus, etc.
    </p>

    <div class="sub-title">props</div>
    <s-table
    style="margin-bottom: 3rem"
      v-model="tableItems"
      :headers="headers"
      :tableStyles="tableColumnSpec"
    >
    </s-table>

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
import type { ISTableStyles } from "@/types/main";
import { descriptionTableStyles } from "@/utils/common";

const headers = ref(["name", "type", "description"]);
const tableItems = ref<IpropsTable[]>([
  {
    name: "listStyle",
    type: "CSSProperties?",
    desc: "Define s-list's style",
  },
  {
    name: "icon",
    type: "{ icon: string; color: string}?",
    desc: `If icon's type is object, display user icon on v-list's default position(left).`,
  },
  {
    name: "title",
    type: "string?",
    desc: `If title's type is string, display user title on v-list's default position(right).`,
  },
  {
    name: "hoverColor",
    type: "string?",
    desc: `If you hover the cursor on s-list, it's color will change to hoverColor.`,
  },
  {
    name: "hoverBgColor",
    type: "string?",
    desc: `If you hover the cursor on s-list, it's color will change to hoverBgColor.`,
  },
  {
    name: "link",
    type: "boolean?",
    desc: `If you hover the cursor on s-list, cursor's css will change to pointer.`,
  },
  {
    name: "to",
    type: "string?",
    desc: `If you click the v-list, homepage will move to "to"'s url.`,
  },
  {
    name: "children",
    type: `TSList(Array of v-list type)[]?`,
    desc: `Children can have one or more child that has v-list's props type. If v-list has one or more child, downIcon will display v-list's right side.`,
  },
]);
const tableColumnSpec = descriptionTableStyles
</script>
<style lang="scss"></style>
