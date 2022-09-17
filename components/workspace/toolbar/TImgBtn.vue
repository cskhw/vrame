<template>
  <div
    class="toolbar-img-btn d-flex align-center justify-center"
    :style="{
      margin: margin,
      color: color,
      borderRadius: borderRadius,
    }"
  >
    <img
      :src="src"
      :style="{
        width: width,
        height: height,
      }"
    />
    <slot />
  </div>
</template>

<script lang="ts" setup>
interface Props {
  margin?: string;
  width?: string;
  borderRadius?: string;
  color?: string;
  src?: string;
}
const props = defineProps<Props>();
</script>

<style lang="scss" scoped>
.toolbar-img-btn {
  cursor: pointer;
  &:hover {
    color: white;
    background-color: rgba(255, 255, 255, 0.1);
  }
  &:active {
    color: white;
    background-color: rgba(255, 255, 255, 0.4);
  }
}
</style>
