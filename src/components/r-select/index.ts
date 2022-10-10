import type { App, Plugin } from "vue";

import RSelect from "@/components/r-select/RSelect.vue";

export default {
  install(Vue: App) {
    Vue.component(RSelect.name, RSelect);
  },
} as Plugin;

export { RSelect };
