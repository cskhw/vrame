import type { App, Plugin } from "vue";

import RList from "@/components/r-list/RList.vue";

export default {
  install(Vue: App) {
    Vue.component(RList.name, RList);
  },
} as Plugin;

export { RList };
