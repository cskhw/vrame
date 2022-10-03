<template>
  <svg
    class="svg-btn"
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="viewBox"
    :width="width"
    :height="height"
    :area-labelledby="areaLabelledby"
  >
    <g :fill="color">
      <slot />
    </g>
  </svg>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    width: string;
    height: string;
    viewBox?: string;
    areaLabelledby?: string;
    color?: string;
  }>(),
  {
    viewBox: "0 0 30 30",
    width: "100",
    height: "100",
  }
);
</script>

<style lang="scss" scoped>
.svg-btn {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-content: center;
  justify-items: center;
  align-items: center;
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
