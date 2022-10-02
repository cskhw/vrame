<template>
  <div
    class="s-app-bar"
    :style="[
      {
        left: appStore.isShowDrawer ? appStore.drawerWidth + 'px' : '0',
        width: appStore.isShowDrawer
          ? `calc(100% - ${appStore.drawerWidth}px - 32px)`
          : 'calc(100% - 32px)',
      },
      appBarStyle,
    ]"
  >
    <!-- default drawer icon -->
    <s-icon
      v-if="!drawerIcon"
      class="pt-btn"
      :icon="mdiReorderHorizontal"
      @click="appStore.isShowDrawer = !appStore.isShowDrawer"
    />
    <!-- user drawer icon -->
    <s-icon
      v-else
      class="pt-btn"
      :icon="drawerIcon"
      @click="appStore.isShowDrawer = !appStore.isShowDrawer"
    />

    <slot />
  </div>
</template>
<script setup lang="ts">
import { CSSProperties } from "vue";
import { mdiReorderHorizontal } from "@mdi/js";
import useAppStore from "@/stores/useAppStore";

const props = defineProps<{
  appBarStyle?: CSSProperties;
  drawerIcon?: string;
}>();

const appStore = useAppStore();
</script>

<style lang="scss">
.s-app-bar {
  transition: all 0.3s ease-in-out;

  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 1rem;
  position: relative;
  width: 100%;
  height: 2rem;
  background-color: black;
  color: white;
}
</style>
