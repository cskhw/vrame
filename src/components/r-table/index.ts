import type { App, Plugin } from "vue";

import RTable from "@/components/r-table/RTable.vue";

export default {
  install(Vue: App) {
    Vue.component(RTable.name, RTable);
  },
} as Plugin;

export { RTable };
