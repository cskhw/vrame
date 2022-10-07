<template>
  <div class="components-body">
    <div class="title">s-icon</div>
    <p class="text-400-20-lightgray">
      The <code class="text-bold-20-black">s-icon</code> component display svg(etc. @mdi/js...) icon.
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
import type { ISTableStyles } from "@/types/components";
import { descriptionTableStyles } from "@/utils/common";

const headers = ref(["name", "type", "description"]);
const tableItems = ref<IpropsTable[]>([
  {
    name: "icon",
    type: "string",
    desc: "Icon's path string.",
  },
  {
    name: "color",
    type: "string?",
    desc: `Icon's color.`,
  },
  {
    name: "iconStyle",
    type: "CSSProperties?",
    desc: `s-icon's user style.`,
  },
  {
    name: "link",
    type: "boolean?",
    desc: `If link is true, s-icon's cursor will change to pointer.`,
  },
  {
    name: "viewBox",
    type: "string?",
    desc: `Control svg tag's viewBox. if you don't know what is viewBox, please refer to the follwing site. <a href="https://developer.mozilla.org/ko/docs/Web/SVG/Attribute/viewBox"><br/>mdn (viewBox)</a>`,
  },
]);
const tableColumnSpec = descriptionTableStyles
</script>
<style lang="scss"></style>
