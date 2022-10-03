<template>
  <div class="main">
    <!-- appbar -->
    <s-appbar> </s-appbar>
    <s-drawer
      ><s-list
        link
        to="slist"
        :icon="{ icon: mdiListBox, color: 'rgba(0,0,0,0.8)' }"
        hover-color="blue"
        ><template #title>slist</template></s-list
      ></s-drawer
    >
    <div class="body">
      <NuxtPage />
    </div>
    <!-- drawer -->
  </div>
</template>
<script setup lang="ts">
import { mdiListBox } from "@mdi/js";
</script>
<style lang="scss" scoped>
.body {
  padding: 2rem;
}
</style>
