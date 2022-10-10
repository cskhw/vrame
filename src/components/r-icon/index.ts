import type { App, Plugin } from "vue";

import RIcon from "@/components/r-icon/RIcon.vue";

export default {
  install(Vue: App) {
    Vue.component(RIcon.name, RIcon);
  },
} as Plugin;

export { RIcon };
