import type { App, Plugin } from "vue";

import RMain from "@/components/r-main/RMain.vue";

export default {
  install(Vue: App) {
    Vue.component(RMain.__name || "RMain", RMain);
  },
} as Plugin;

export { RMain };
