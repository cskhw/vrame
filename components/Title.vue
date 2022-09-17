<template>
  <div class="title__comp" id="Stats">
    <div class="title__container">
      <h3>{{ title }}</h3>
      <h2 :style="{ color: color }">{{ descrip }}</h2>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/stylesheets/competitor_outsourcing.scss";
</style>

<script lang="ts" setup>
defineProps<{ title?: string; descrip?: string; color?: string }>();
</script>
