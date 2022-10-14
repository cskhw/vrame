import pinia from "@/plugins/pinia";
import { createApp, watch } from "vue";
import App from "@/App.vue";
import router from "./router";

const app = createApp(App);

import { createVrame } from "vrame";

app.use(router).use(pinia).use(createVrame()).mount("#app");
