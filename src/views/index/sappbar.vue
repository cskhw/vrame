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
      <s-table :headers="headers" :tableSpec="tableColumnSpec"></s-table>
    </div></p>
  </div>
</template>
<script setup lang="ts">
import type { ISTableStyles } from "@/types/components";

const headers = ref(['a', 'b'])
const tableColumnSpec = computed<ISTableStyles>(() => {
})

</script>
<style lang="scss"></style>
