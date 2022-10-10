import type { App, Plugin } from "vue";

import RDrawer from "@/components/r-drawer/RDrawer.vue";

export default {
  install(Vue: App) {
    Vue.component(RDrawer.name, RDrawer);
  },
} as Plugin;

export { RDrawer };
