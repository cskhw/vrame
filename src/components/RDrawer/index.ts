import type { App, Plugin } from "vue";

import RDrawer from "@/components/RDrawer/RDrawer.vue";

export default {
  install(Vue: App) {
    Vue.component(RDrawer.__name || "RDrawer", RDrawer);
  },
} as Plugin;

export { RDrawer };
