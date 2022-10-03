import { defineStore } from "pinia";

export default defineStore("app", {
  state: () => ({
    isShowDrawer: false,
    drawerWidth: "250",
    appbarHeight: "64",
  }),
  getters: {},
  actions: {},
});
