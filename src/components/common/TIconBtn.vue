<template>
  <div
    class="toolbar-icon-btn d-flex align-center"
    :style="{
      margin: margin,
      color: color,
      borderRadius: borderRadius,
    }"
  >
    <v-icon
      :icon="icon"
      :style="{
        margin: margin,
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
  icon?: string;
}
const props = defineProps<Props>();
</script>

<style lang="scss" scoped>
.toolbar-icon-btn {
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
