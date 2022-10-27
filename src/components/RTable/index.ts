import type { App, Plugin } from "vue";

import RTable from "@/components/r-table/RTable.vue";

export default {
  install(Vue: App) {
    Vue.component(RTable.__name || "RTable", RTable);
  },
} as Plugin;

export { RTable };
