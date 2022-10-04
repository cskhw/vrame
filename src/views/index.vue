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
    <s-drawer
      ><s-list
        link
        to="/sappbar"
        :icon="{ icon: mdiListBox, color: 'rgba(0,0,0,0.8)' }"
        hover-color="blue"
        :children="appbarListChildren"
        ><template #title>s-appbar</template></s-list
      >
      <s-list
        link
        to="/sdrawer"
        :icon="{ icon: mdiListBox, color: 'rgba(0,0,0,0.8)' }"
        hover-color="blue"
        ><template #title>s-drawer</template></s-list
      >
      <s-list
        link
        to="/slist"
        :icon="{ icon: mdiListBox, color: 'rgba(0,0,0,0.8)' }"
        hover-color="blue"
        ><template #title>s-list</template></s-list
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

const appbarListChildren = ref<TSList[]>([
  {
    icon: { icon: mdiListBox, color: "gray" },
    hoverColor: "blue",
  },
]);
</script>
<style lang="scss" scoped>
.body {
  padding: 2rem;
}
</style>
