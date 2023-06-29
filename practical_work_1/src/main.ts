import { createApp } from "vue";

import App from "@/App.vue";
import router from "@/router";
import { pinia } from "@/stores/pinia";
import Backendless from "backendless";
import { APP_ID, API_KEY } from "@/env";

import "@/stylesheets/reset.css";
import "@/stylesheets/base.css";

const app = createApp(App);

app.use(pinia);
app.use(router);

console.log(Backendless.initApp(APP_ID, API_KEY));

app.mount("#app");
