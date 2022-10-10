<template>
  <button class="button btn" :class="{ disable: disabled }">{{ text }}</button>
</template>

<style lang="scss" scoped>
// @import "@/styles/login.scss";
@import "@/styles/signUp_outsourcing.scss";
</style>

<script lang="ts" setup>
defineProps<{ text: string; disabled?: boolean }>();
</script>
