<template>
  <div class="r-drawer" @click="onClickSDrawer">
    <div class="r-drawer-body" :style="[_drawerStyle]">
      <slot />
    </div>
    <Transition name="fade">
      <div class="r-drawer-bg" v-if="modelValue"></div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import useAppStore from "@/stores/useAppStore";
import { computed, type CSSProperties } from "vue";

const appStore = useAppStore();

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    drawerStyle?: CSSProperties;
    shadow?: string;
    border?: string;
  }>(),
  {
    drawerStyle: () => ({
      top: "64px",
      width: "250px",
    }),
  }
);

const emit = defineEmits(["update:modelValue"]);

const _drawerStyle = computed(() => ({
  ...props.drawerStyle,
  left: props.modelValue ? 0 : `-${props.drawerStyle.width}`,
  borderRight: props.border || "1px solid #e0e0e0",
  boxShadow: props.shadow ? "0 0 6px 0 rgba(0, 0, 0, 0.3)" : "",
  width: `calc(${props.drawerStyle.width} - 2rem)`,
  top: `${props.drawerStyle.top}`,
}));

function onClickSDrawer() {
  emit("update:modelValue", false);
}
</script>
<style lang="scss" scoped>
@import "@/styles/components/r-drawer.scss";
</style>
