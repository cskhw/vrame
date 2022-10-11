import pinia from "@/plugins/pinia";
import { createApp, watch } from "vue";
import App from "@/App.vue";
import router from "./router";

const app = createApp(App);

import { ref, reactive, computed } from "vue";
import { createVrame } from "./index";

window.ref = ref;
window.reactive = reactive;
window.computed = computed;
window.watch = watch;

app.use(router).use(pinia).use(createVrame()).mount("#app");
