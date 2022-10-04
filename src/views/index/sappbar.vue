<template>
  <div class="components-body">
    <div class="title">s-appbar</div>
    <p class="text-400-20-lightgray">
      The <code class="text-bold-20-black">s-appbar</code> component is fixed to
      the top of the app.
    </p>

    <div class="sub-title">props</div>
    <li class="text-400-20-black">appBarStyle</li>
    <p class="text-400-20-lightgray"><div>
      <s-table v-model="tableItems" :headers="headers" :tableStyles="tableColumnSpec"></s-table>
    </div></p>
  </div>
</template>
<script setup lang="ts">
import type { IpropsTable } from "@/types";
import type { ISTableStyles } from "@/types/components";

const headers = ref(['name', 'type', 'description'])
const tableItems = ref< IpropsTable[]>([{
  name: 'a',
  type: 'b',
  desc: 'test',
  },
  {
  name: 'a',
  type: 'b',
  desc: 'test'
},])
const tableColumnSpec = computed<ISTableStyles>(() => ({
  tableStyle: {
    width: '100%',
  },
  tBodyStyle: {
    width: '100%',
  },
  tHeaderStyle: {
    width: '100%',
    backgroundColor: '#eeeeee'
  },
  thStyle(i: number) {
    if (i == 0) return {
      width: '10%',
    }
    else if (i == 1) return {
      width: '10%',
    }
    else if (i == 2) return {
      width: '80%',
    }
  },
  columnStyle(i: number) {
    if (i == 0) return {
      width: '10%',
    }
    else if (i == 1) return {
      width: '10%',
    }
    else if (i == 2) return {
      width: '80%',
    }
      
  },
}) as ISTableStyles)

</script>
<style lang="scss"></style>
