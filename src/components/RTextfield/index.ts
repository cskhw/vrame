import type { App, Plugin } from "vue";

import RTextfield from "@/components/RTextfield/RTextfield.vue";

export default {
  install(Vue: App) {
    Vue.component(RTextfield.__name || "RTextfield", RTextfield);
  },
} as Plugin;

export { RTextfield };
