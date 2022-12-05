<template>
  <div class="components-body">
    <div class="title">r-select</div>
    <p class="text-400-20-lightgray">
      The <code class="text-bold-20-black">r-select</code> component is ui frame like html's select, option.
    </p>
    fdsa
    
    <r-select v-model="value" :options="selectOptions">
      <template #value="{}">

      </template>
    </r-select>

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
import { ref } from "vue"

const value = ref({
  text: 'hello', 
  value: 'test'
})

const selectOptions = ref([
  {
    text: 'fdsafdsfdsafdsafsdfsa', 
    value:'t1'
  },
  {
    text: 'fdsa', 
    value:'t2'
  },
  {
    text: 'fdsafdsa', 
    value:'t3'
  },
])


const headers = ref(["name", "type", "description"]);
const tableItems = ref<IpropsTable[]>([
  {
    name: "appBarStyle",
    type: "CSSProperties | boolean | undefined",
  desc: "Define r-appbar's style",
  },
  {
    name: "drawerIcon",
    type: "string | boolean | undefined",
    desc: `If drawerIcon's type is boolean, on/off display the default icon that on/off drawer.<br/>
    If drawerIcons'type is string, display the user icon that in/off drawer.
    `,
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
