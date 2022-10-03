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
  drawerStyle: CSSProperties;
  borderRight: string;
}>();

const _drawerStyle = computed(() => ({
  ...props.drawerStyle,
  width: `calc(${appStore.drawerWidth}px - 2rem)`,
  left: appStore.isShowDrawer ? 0 : `-${appStore.drawerWidth}px`,
  borderRight: "1px solid #e0e0e0",
  boxShadow: "0 0 6px 0 rgba(0, 0, 0, 0.3)",
}));
</script>
<style lang="scss">
.s-drawer {
  position: fixed;
  transition: all 0.3s ease-in-out;
  height: 100%;
  left: 0;
  top: 0;
  background-color: white;
  padding: 1rem;
}
</style>
