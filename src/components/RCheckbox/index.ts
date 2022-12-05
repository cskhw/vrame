import type { App, Plugin } from "vue";

import RCheckbox from "@/components/RCheckbox/RCheckbox.vue";

export default {
  install(Vue: App) {
    Vue.component(RCheckbox.__name || "RCheckbox", RCheckbox);
  },
} as Plugin;

export { RCheckbox };
