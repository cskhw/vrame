<template>
  <div class="main">
    <!-- appbar -->
    <s-appbar drawerIcon>
      <div style="width: 40px; height: 40px">
        <s-icon
          link
          :iconStyle="{ width: '2rem', height: '2rem' }"
          viewBox="0 0 16 16"
          :icon="mdiReorderHorizontal"
          @click="isDrawer = !isDrawer"
        >
        </s-icon>
      </div>
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
    <s-drawer v-model="isDrawer">
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
    <s-main>
      <router-view></router-view>
    </s-main>
    <!-- drawer -->
  </div>
</template>
<script setup lang="ts">
import type { TSList } from "@/types/components";
import { mdiListBox, mdiReorderHorizontal } from "@mdi/js";

const isDrawer = ref(false);

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
  {
    icon: { icon: mdiListBox, color: "gray" },
    hoverColor: "blue",
    title: "s-icon",
    to: "s-icon",
    link: true,
  },
  {
    icon: { icon: mdiListBox, color: "gray" },
    hoverColor: "blue",
    title: "s-table",
    to: "s-table",
    link: true,
  },
  {
    icon: { icon: mdiListBox, color: "gray" },
    hoverColor: "blue",
    title: "s-select",
    to: "s-select",
    link: true,
  },
  {
    icon: { icon: mdiListBox, color: "gray" },
    hoverColor: "blue",
    title: "s-select",
    to: "s-select",
    link: true,
  },
  {
    icon: { icon: mdiListBox, color: "gray" },
    hoverColor: "blue",
    title: "s-select",
    to: "s-select",
    link: true,
  },
]);
</script>
<style lang="scss" scoped></style>
