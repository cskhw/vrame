import pinia from "@/plugins/pinia";
import { createApp, watch } from "vue";
import App from "@/App.vue";
import router from "./router";
import { createVrame } from "vrame";

const app = createApp(App);

app.use(router).use(pinia).use(createVrame()).mount("#app");
