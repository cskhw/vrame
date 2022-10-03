<template>
  <div
    class="divider"
    :class="{ vertical: vertical }"
    :style="{
      width: width,
      height: height,
      '--color-bg': bgColor ? bgColor : 'white',
      '--color-bd': bdColor ? bdColor : '#dfdfdf',
      opacity: opacity ? opacity : '1',
    }"
  ></div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  width?: string;
  height?: string;
  vertical?: boolean;
  bgColor?: string;
  bdColor?: string;
  opacity?: string;
}>();
</script>

<style lang="scss" scoped>
.divider {
  width: 100%;
  height: 0.0625rem;
  border-top: 0.0625rem solid var(--color-bd);
  background-color: var(--color-bg);
  &.vertical {
    width: 0.0625rem;
    height: 100%;
  }
}
</style>
