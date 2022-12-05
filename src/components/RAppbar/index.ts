import type { App, Plugin } from "vue";

import RAppbar from "@/components/RAppbar/RAppbar.vue";

export default {
  install(Vue: App) {
    Vue.component(RAppbar.__name || "RAppbar", RAppbar);
  },
} as Plugin;

export { RAppbar };
