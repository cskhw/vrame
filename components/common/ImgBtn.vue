<template>
  <div
    class="toolbar-img-btn d-flex align-center"
    :style="{
      color: color,
      borderRadius: borderRadius,
      cursor: 'pointer',
    }"
  >
    <img
      class="toolbar-img-btn"
      :src="getUrl()"
      :style="{
        margin: margin ? margin : '',
        width: width ? width : '1.5rem',
        height: height ? height : '1.5rem',
        cursor: 'pointer',
      }"
    />
    <slot />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  margin?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
  color?: string;
  imgUrl: string;
}>();
const getUrl = () =>
  new URL(`../../assets/images/${props.imgUrl}`, import.meta.url).href;
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
