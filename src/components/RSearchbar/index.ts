import type { App, Plugin } from "vue";

import RSearchbar from "@/components/RSearchbar/RSearchbar.vue";

export default {
  install(Vue: App) {
    Vue.component(RSearchbar.__name || "RAppbar", RSearchbar);
  },
} as Plugin;

export { RSearchbar };
