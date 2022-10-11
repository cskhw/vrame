import type { App, Plugin } from "vue";

import RAppbar from "@/components/r-appbar/RAppbar.vue";

export default {
  install(Vue: App) {
    Vue.component(RAppbar.name, RAppbar);
  },
} as Plugin;

export { RAppbar };
