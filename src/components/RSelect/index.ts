import type { App, Plugin } from "vue";

import RSelect from "@/components/RSelect/RSelect.vue";

export default {
  install(Vue: App) {
    Vue.component(RSelect.__name || "RSelect", RSelect);
  },
} as Plugin;

export { RSelect };
