<template>
  <div class="s-app-bar" :style="[_appbarStyle]">
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
import colors from "~~/utils/colors";

const props = defineProps<{
  appBarStyle?: CSSProperties;
  drawerIcon?: string;
  height?: string;
  shadow?: string;
  border?: string;
}>();

const appStore = useAppStore();

const _appbarStyle = computed(() => ({
  borderBottom: props.border || `1px solid ${colors.commonBorder}`,
  boxShadow: props.shadow && "0 0 6px 1px rgba(0,0,0,0.3)",
  height: props.height,
  ...props.appBarStyle,
}));
</script>

<style lang="scss" scoped>
@import "@/assets/stylesheets/components/s-appbar.scss";
</style>
