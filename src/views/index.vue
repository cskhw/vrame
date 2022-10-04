<template>
  <div class="main">
    <!-- appbar -->
    <s-appbar drawerIcon>
      <s-btn
        to="/"
        :style="{
          width: '60px',
          padding: 0,
        }"
        hover-bg-color="white"
        ><img class="pt-btn" src="@/assets/images/simplipy.png" width="60" />
      </s-btn>
    </s-appbar>
    <s-drawer>
      <s-list
        link
        to="introduction"
        :icon="{ icon: mdiListBox, color: 'rgba(0,0,0,0.8)', to: '/sappbar' }"
        hover-color="blue"
        ><template #title>introduction</template></s-list
      >
      <s-list
        link
        to="installation"
        :icon="{ icon: mdiListBox, color: 'rgba(0,0,0,0.8)', to: '/sappbar' }"
        hover-color="blue"
        ><template #title>installation</template></s-list
      >
      <s-list
        link
        :icon="{ icon: mdiListBox, color: 'rgba(0,0,0,0.8)', to: '/sappbar' }"
        hover-color="blue"
        :children="drawreChildren"
        ><template #title>components</template></s-list
      >
    </s-drawer>
    <div class="body">
      <router-view></router-view>
    </div>
    <!-- drawer -->
  </div>
</template>
<script setup lang="ts">
import type { TSList } from "@/types/components";
import { mdiListBox } from "@mdi/js";

const drawreChildren = ref<TSList[]>([
  {
    icon: { icon: mdiListBox, color: "gray" },
    hoverColor: "blue",
    title: "s-appbar",
    to: "s-appbar",
    link: true,
  },
  {
    icon: { icon: mdiListBox, color: "gray" },
    hoverColor: "blue",
    title: "s-drawer",
    to: "s-drawer",
    link: true,
  },
  {
    icon: { icon: mdiListBox, color: "gray" },
    hoverColor: "blue",
    title: "s-list",
    to: "s-list",
    link: true,
  },
]);
</script>
<style lang="scss" scoped></style>
