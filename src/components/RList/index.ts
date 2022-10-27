import type { App, Plugin } from "vue";

import RList from "@/components/RList/RList.vue";

export default {
  install(Vue: App) {
    Vue.component(RList.__name || "RList", RList);
  },
} as Plugin;

export { RList };
