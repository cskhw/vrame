<template>
  <div class="main">
    <!-- appbar -->
    <r-appbar :appBarStyle="{}" style="max-height: 32px">
      <div style="width: 40px; height: 40px">
        <r-icon
          link
          :iconStyle="{ width: '2rem', height: '2rem' }"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          :icon="mdiReorderHorizontal"
          @click="isDrawer = !isDrawer"
        >
        </r-icon>
      </div>
      <r-btn
        to="/"
        :style="{
          width: '60px',
          padding: 0,
        }"
        hover-bg-color="white"
        ><img class="pt-btn" src="@/assets/images/vrame.png" width="50" />
      </r-btn>
    </r-appbar>
    <r-drawer v-model="isDrawer">
      <r-list
        link
        to="introduction"
        :icon="{ icon: mdiListBox, color: 'rgba(0,0,0,0.8)', to: '/sappbar' }"
        hover-color="blue"
        ><template #title>introduction</template></r-list
      >
      <r-list
        link
        to="installation"
        :icon="{ icon: mdiListBox, color: 'rgba(0,0,0,0.8)', to: '/sappbar' }"
        hover-color="blue"
        ><template #title>installation</template></r-list
      >
      <r-list
        link
        :icon="{ icon: mdiListBox, color: 'rgba(0,0,0,0.8)', to: '/sappbar' }"
        hover-color="blue"
        :children="drawerChildren"
        title="components"
      ></r-list>
    </r-drawer>
    <r-main>
      <router-view></router-view>
    </r-main>
    <!-- drawer -->
  </div>
</template>
<script setup lang="ts">
import type { TSList } from "vrame";
import { mdiListBox, mdiReorderHorizontal } from "@mdi/js";
import { computed, ref } from "vue";

const isDrawer = ref(false);

const drawerChildren = computed<TSList[]>(() => [
  {
    icon: { icon: mdiListBox, color: "gray" },
    hoverColor: "blue",
    title: "r-appbar",
    to: "r-appbar",
    link: true,
    click: () => {
      console.log("fdsafdsa");
    },
  },
  {
    icon: { icon: mdiListBox, color: "gray" },
    hoverColor: "blue",
    title: "r-drawer",
    to: "r-drawer",
    link: true,
  },
  {
    icon: { icon: mdiListBox, color: "gray" },
    hoverColor: "blue",
    title: "r-main",
    to: "r-main",
    link: true,
  },
  {
    icon: { icon: mdiListBox, color: "gray" },
    hoverColor: "blue",
    title: "r-list",
    to: "r-list",
    link: true,
  },
  {
    icon: { icon: mdiListBox, color: "gray" },
    hoverColor: "blue",
    title: "r-icon",
    to: "r-icon",
    link: true,
  },
  {
    icon: { icon: mdiListBox, color: "gray" },
    hoverColor: "blue",
    title: "r-table",
    to: "r-table",
    link: true,
  },
  {
    icon: { icon: mdiListBox, color: "gray" },
    hoverColor: "blue",
    title: "r-btn",
    to: "r-btn",
    link: true,
  },
  {
    icon: { icon: mdiListBox, color: "gray" },
    hoverColor: "blue",
    title: "r-select",
    to: "r-select",
    link: true,
  },
  {
    icon: { icon: mdiListBox, color: "gray" },
    hoverColor: "blue",
    title: "r-searchbar",
    to: "r-searchbar",
    link: true,
  },
  {
    icon: { icon: mdiListBox, color: "gray" },
    hoverColor: "blue",
    title: "r-checkbox",
    to: "r-checkbox",
    link: true,
  },
  {
    icon: { icon: mdiListBox, color: "gray" },
    hoverColor: "blue",
    title: "r-textfield",
    to: "r-textfield",
    link: true,
  },
]);
</script>
<style lang="scss" scoped></style>
