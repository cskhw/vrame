<template>
  <div class="s-drawer" @click="onClickSDrawer">
    <div class="s-drawer-body" :style="[_drawerStyle]">
      <slot />
    </div>
    <Transition name="fade">
      <div class="s-drawer-bg" v-if="modelValue || appStore.isShowDrawer"></div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import useAppStore from "@/stores/useAppStore";
import { computed, type CSSProperties } from "vue";

const appStore = useAppStore();

const props = defineProps<{
  modelValue?: boolean;
  drawerStyle?: CSSProperties;
  border?: string;
  shadow?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const _drawerStyle = computed(() => ({
  width: `calc(${appStore.drawerWidth}px - 2rem)`,
  left:
    appStore.isShowDrawer || props.modelValue
      ? 0
      : `-${appStore.drawerWidth}px`,
  top: `${appStore.appbarHeight}px`,
  borderRight: props.border || "1px solid #e0e0e0",
  boxShadow:
    props.shadow || appStore.isShowDrawer ? "0 0 6px 0 rgba(0, 0, 0, 0.3)" : "",
  ...props.drawerStyle,
}));

function onClickSDrawer() {
  appStore.isShowDrawer = false;
  emit("update:modelValue", false);
}
</script>
<style lang="scss" scoped>
@import "@/assets/stylesheets/components/s-drawer.scss";
</style>
