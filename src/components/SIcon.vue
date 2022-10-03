<template>
  <div class="s-icon" :class="[link && 'pt-btn']" :style="[_iconStyle]">
    <svg
      :width="_iconStyle.width || _iconStyle.width.toString().substring(0, 2)"
      :height="
        _iconStyle?.height || _iconStyle.height.toString().substring(0, 2)
      "
      :fill="color"
      :viewBox="viewBox"
    >
      <path :d="icon"></path>
    </svg>
  </div>
</template>
<script setup lang="ts">
import { CSSProperties } from "vue";

const props = withDefaults(
  defineProps<{
    icon: string;
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
  overflow: "hidden",
  ...props.iconStyle,
}));
</script>
