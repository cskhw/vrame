<template>
  <div
    class="s-app-bar"
    :style="[
      {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        height: '5rem',
        backgroundColor: 'black',
        color: 'white',
      },
      appBarStyle,
    ]"
  >
    <svg>{{ mdiDragHorizontal }}</svg>
    <slot />
  </div>
</template>
<script setup lang="ts">
import { CSSProperties } from "vue";
import { mdiDragHorizontal } from "@mdi/js";

type Props = {
  appBarStyle?: CSSProperties;
  drawerIcon?: string;
};

const props = defineProps<Props>();
</script>
<style lang="scss" scoped></style>
