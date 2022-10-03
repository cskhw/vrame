<template>
  <div class="toolbar-icon-btn d-flex align-center justify-center">
    <v-icon
      :color="color"
      :style="{ width: '1.5rem', height: '1.5rem' }"
      :icon="icon"
    />
    <slot />
  </div>
</template>

<script lang="ts" setup>
interface Props {
  icon?: string;
  color?: string;
}
const props = withDefaults(defineProps<Props>(), {
  color: "white",
});
</script>

<style lang="scss" scoped>
.toolbar-icon-btn {
  border-radius: 0.125rem;
  cursor: pointer;
  color: white;
  width: max-content;
  height: 1.5rem;
  margin: 0 0.125rem;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  &:active {
    background-color: rgba(255, 255, 255, 0.4);
  }
}
</style>
