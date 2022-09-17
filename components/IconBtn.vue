<template>
  <v-icon
    class="icon-btn"
    :icon="icon"
    :style="{
      width: width,
      height: height,
      borderRadius: borderRadius,
      ...style,
    }"
  />
</template>

<script lang="ts" setup>
import type { CSSProperties } from "vue";

defineProps<{
  icon?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
  style?: CSSProperties;
}>();
</script>

<style lang="scss" scoped>
.icon-btn {
  cursor: pointer;
  &:hover {
    background-color: #e0e0e0;
  }
  &:active {
    background-color: #c0c0c0;
  }
}
</style>
