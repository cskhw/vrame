<template>
  <div class="home">
    <h1 class="home-icon">S</h1>
    <h1 class="home-title">Most Simple Vue Ui Framework</h1>
    <div class="home-desc">Simplipy is simple.</div>

    <div class="home-btns-box">
      <s-btn
        to="introduction"
        :btnStyle="{ width: '10rem', backgroundColor: 'black', color: 'white' }"
        style="margin-right: 2rem"
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
    <div class="home-footer">
      <p>developer: cskhw</p>
      <p>email: gusdn0828@gmail.com</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { mdiGithub, mdiSimpleIcons } from "@mdi/js";
</script>
<style lang="scss" scoped>
@import "@/assets/stylesheets/views/index";
</style>
