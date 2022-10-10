import type { App, Plugin } from "vue";

import RBtn from "@/components/r-btn/RBtn.vue";

export default {
  install(Vue: App) {
    Vue.component(RBtn.name, RBtn);
  },
} as Plugin;

export { RBtn };
