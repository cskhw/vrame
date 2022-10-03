<template>
  <div class="s-drawer" :style="[_drawerStyle]">
    <slot />
  </div>
</template>
<script setup lang="ts">
import useAppStore from "@/stores/useAppStore";
import { CSSProperties } from "vue";

const appStore = useAppStore();

const props = defineProps<{
  drawerStyle?: CSSProperties;
  border?: string;
  shadow?: string;
}>();

const _drawerStyle = computed(() => ({
  width: `calc(${appStore.drawerWidth}px - 2rem)`,
  left: appStore.isShowDrawer ? 0 : `-${appStore.drawerWidth}px`,
  top: `${appStore.appbarHeight}px`,
  borderRight: props.border || "1px solid #e0e0e0",
  boxShadow: props.shadow || "0 0 6px 0 rgba(0, 0, 0, 0.3)",
  ...props.drawerStyle,
}));
</script>
<style lang="scss" scoped>
@import "@/assets/stylesheets/components/s-drawer.scss";
</style>
