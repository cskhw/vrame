<template>
  <div
    class="toolbar-icon-btn d-flex align-center"
    :style="{
      margin: margin,
      borderRadius: borderRadius,
      '--highlight': highlight ? 'rgb(255 255 255 / 0.4)' : '',
    }"
  >
    <v-icon
      :icon="icon"
      :style="[
        {
          margin: margin,
          width: width,
          height: height,
          color: color,
        },
      ]"
    />
    <slot />
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  margin?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
  color?: string;
  icon?: string;
  highlight?: boolean;
}>();
</script>

<style lang="scss" scoped>
.toolbar-icon-btn {
  cursor: pointer;
  background-color: var(--highlight);
  &:hover {
    background-color: rgb(255 255 255 / 0.1);
  }
  &:active {
    background-color: rgba(255, 255, 255, 0.4);
  }
}
</style>
