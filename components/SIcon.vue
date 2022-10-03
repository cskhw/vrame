<template>
  <div class="s-icon" :class="[link && 'pt-btn']" :style="[_iconStyle]">
    <svg :fill="color">
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
