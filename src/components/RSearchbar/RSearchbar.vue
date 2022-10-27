<template>
  <div class="r-searchbar" :style="[_searchbarStyle]">
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

const _searchbarStyle = computed(() => ({
  borderBottom: props.border || `1px solid ${colors.commonBorder}`,
  boxShadow: props.shadow && "0 0 6px 1px rgba(0,0,0,0.3)",
  ...props.appBarStyle,
}));
</script>

<style lang="scss">
@import "@/styles/components/r-appbar.scss";
</style>
