import type { App, Plugin } from "vue";

import RBtn from "@/components/RBtn/RBtn.vue";

export default {
  install(Vue: App) {
    Vue.component(RBtn.__name || "RBtn", RBtn);
  },
} as Plugin;

export { RBtn };
