import type { App, Plugin } from "vue";

import RTextfield from "@/components/r-textfield/RTextfield.vue";

export default {
  install(Vue: App) {
    Vue.component(RTextfield.__name || "RTextfield", RTextfield);
  },
} as Plugin;

export { RTextfield };
