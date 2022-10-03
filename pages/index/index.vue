<template>
  <div class="introduction">
    <h1 class="introduction-icon">S</h1>
    <h1 class="introduction-title">Most Simple Vue Ui Framework</h1>
    <div class="introduction-desc">Simplipy is simple.</div>

    <div class="introduction-btns-box">
      <s-btn
        to="introduction"
        :btnStyle="{ width: '10rem', backgroundColor: 'black', color: 'white' }"
      >
        <s-icon
          style="margin-right: 0.5rem"
          color="white"
          :icon="mdiSimpleIcons"
        />
        GET STARTED</s-btn
      >
      <s-btn
        href="https://github.com/cskhw/simplify"
        :btnStyle="{ width: '10rem', backgroundColor: 'gray', color: 'white' }"
      >
        <s-icon style="margin-right: 0.5rem" color="white" :icon="mdiGithub" />
        GITHUB</s-btn
      >
    </div>
    <div class="introduction-footer">developer: cskhw</div>
  </div>
</template>
<script setup lang="ts">
import { mdiGithub, mdiSimpleIcons } from "@mdi/js";
</script>
<style lang="scss" scoped>
@import "@/assets/stylesheets/pages/introduction";
</style>
