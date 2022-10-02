<template>
  <div
    class="s-app-bar"
    :style="[
      {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '1rem',
        width: '100%',
        height: '2rem',
        backgroundColor: 'black',
        color: 'white',
      },
      appBarStyle,
    ]"
  >
    <s-icon
      class="s-app-bar-drawer-icon"
      v-if="!drawerIcon"
      :icon="mdiReorderHorizontal"
    />
    <s-icon v-else :icon="drawerIcon" />

    <slot />
  </div>
</template>
<script setup lang="ts">
import { CSSProperties } from "vue";
import { mdiReorderHorizontal } from "@mdi/js";

type Props = {
  appBarStyle?: CSSProperties;
  drawerIcon?: string;
};

const props = defineProps<Props>();
</script>
<style lang="scss" scoped>
.s-app-bar-drawer-icon {
}
</style>
