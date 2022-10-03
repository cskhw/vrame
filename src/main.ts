import pinia from "@/plugins/pinia";
import { createApp } from "vue";
import App from "@/App.vue";
import router from "./router";
import components from "@/utils/components";

const app = createApp(App);

import { ref, reactive, computed } from "vue";

window.ref = ref;
window.reactive = reactive;
window.computed = computed;

for (const component of components) {
  app.component(component.name, component.component);
}

app.use(router).use(pinia).mount("#app");
