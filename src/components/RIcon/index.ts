import type { App, Plugin } from "vue";

import RIcon from "@/components/RIcon/RIcon.vue";

export default {
  install(Vue: App) {
    Vue.component(RIcon.__name || "RIcon", RIcon);
  },
} as Plugin;

export { RIcon };
