<template>
  <div class="s-app-bar" :style="[_appbarStyle]">
    <!-- default drawer icon -->
    <template v-if="drawerIcon">
      <s-icon
        v-if="typeof drawerIcon == 'boolean'"
        class="pt-btn"
        view-box="0 0 24 24"
        :icon-style="{
          width: '40px',
          height: '40px',
        }"
        :icon="mdiReorderHorizontal"
        @click="appStore.isShowDrawer = !appStore.isShowDrawer"
      />
      <!-- user drawer icon -->
      <s-icon
        v-if="typeof drawerIcon == 'string'"
        class="pt-btn"
        :icon="(drawerIcon as string)"
        @click="appStore.isShowDrawer = !appStore.isShowDrawer"
      />
    </template>

    <slot />
  </div>
</template>
<script setup lang="ts">
import { computed, type CSSProperties } from "vue";
import { mdiReorderHorizontal } from "@mdi/js";
import useAppStore from "@/stores/useAppStore";
import colors from "@/utils/colors";

const props = defineProps<{
  appBarStyle?: CSSProperties;
  drawerIcon?: boolean | string;
  shadow?: string;
  border?: string;
}>();

const appStore = useAppStore();

const _appbarStyle = computed(() => ({
  borderBottom: props.border || `1px solid ${colors.commonBorder}`,
  boxShadow: props.shadow && "0 0 6px 1px rgba(0,0,0,0.3)",
  ...props.appBarStyle,
}));
</script>

<style lang="scss" scoped>
@import "@/assets/stylesheets/components/s-appbar.scss";
</style>
