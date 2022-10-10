import type { App, Plugin } from "vue";

import RAppbar from "@/components/rappbar/RAppbar.vue";

export default {
  install(Vue: App) {
    Vue.component(RAppbar.name, RAppbar);
  },
} as Plugin;

export { RAppbar };
