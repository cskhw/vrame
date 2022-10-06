<template>
  <div class="components-body">
    <div class="title">s-appbar</div>
    <p class="text-400-20-lightgray">
      The <code class="text-bold-20-black">s-appbar</code> component is fixed to
      the top of the app.
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

const headers = ref(["name", "type", "description"]);
const tableItems = ref<IpropsTable[]>([
  {
    name: "appBarStyle?",
    type: "CSSProperties | boolean",
    desc: "Define s-appbar's style",
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
const tableColumnSpec = computed<ISTableStyles>(
  () =>
    ({
      tableStyle: {
        width: "100%",
      },
      tBodyStyle: {
        width: "100%",
      },
      tHeaderStyle: {
        width: "100%",
        backgroundColor: "#eeeeee",
      },
      thStyle(i: number) {
        if (i == 0)
          return {
            width: "20%",
          };
        else if (i == 1)
          return {
            width: "20%",
          };
        else if (i == 2)
          return {
            width: "60%",
          };
      },
      columnStyle(i: number) {
        if (i == 0)
          return {
            width: "20%",
          };
        else if (i == 1)
          return {
            width: "20%",
          };
        else if (i == 2)
          return {
            width: "60%",
          };
      },
    } as ISTableStyles)
);
</script>
<style lang="scss"></style>
