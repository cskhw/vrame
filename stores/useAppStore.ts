import { defineStore } from "pinia";

export default defineStore("app", {
  state: () => ({
    isShowDrawer: true,
    drawerWidth: "250",
  }),
  getters: {},
  actions: {},
});
