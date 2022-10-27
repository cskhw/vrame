<template>
  <div class="r-icon" :class="[link && 'pt-btn']" :style="[_iconStyle]">
    <svg
      :width="width || 24"
      :height="height || 24"
      :fill="color"
      :viewBox="viewBox"
    >
      <path :d="icon"></path>
    </svg>
  </div>
</template>
<script setup lang="ts">
import { computed, type CSSProperties } from "vue";

const props = withDefaults(
  defineProps<{
    icon: string;
    width?: number | string;
    height?: number | string;
    color?: string;
    iconStyle?: CSSProperties;
    link?: boolean;
    viewBox?: string;
  }>(),
  {
    color: "grey",
  }
);

const _iconStyle = computed(() => ({
  width: "24px",
  height: "24px",
  ...props.iconStyle,
}));
</script>
