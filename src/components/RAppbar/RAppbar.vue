<template>
  <div ref="rAppbar" class="r-appbar" :style="[_appbarStyle]">
    <!-- default drawer icon -->
    <slot />
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, type CSSProperties } from "vue";
import colors from "@/utils/colors";

const props = defineProps<{
  appBarStyle?: CSSProperties;
  shadow?: string;
  border?: string;
}>();

const _appbarStyle = computed(() => ({
  borderBottom: props.border || `1px solid ${colors.commonBorder}`,
  boxShadow: props.shadow && "0 0 6px 1px rgba(0,0,0,0.3)",
  ...props.appBarStyle,
}));

const rAppbar = ref<HTMLElement>();

/**Set r-main's padding-top because appbar's position is fixed.*/
onMounted(() => {
  if (!rAppbar.value) return;
  const appbarStyle = window.getComputedStyle(rAppbar.value);
  const height = appbarStyle.height;
  const paddingTop = appbarStyle.paddingTop;
  const paddingBottom = appbarStyle.paddingBottom;
  const appbarHeight =
    parseInt(paddingTop.substring(0, 2)) +
    parseInt(height.substring(0, 2)) +
    parseInt(paddingBottom.substring(0, 2));
  const sMain = document.getElementById("r-main");
  if (height && sMain) sMain.style.paddingTop = appbarHeight + "px";
});
</script>

<style lang="scss">
@import "@/styles/components/r-appbar.scss";
</style>
