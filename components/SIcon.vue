<template>
  <div
    class="s-icon"
    :class="[link && 'pt-btn']"
    :style="[{ width: '20px', height: '20px' }, iconStyle]"
  >
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
    color: string;
    iconStyle?: CSSProperties;
    link?: boolean;
  }>(),
  {
    color: "grey",
  }
);
</script>
