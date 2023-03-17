import 'core-js/stable';
import "regenerator-runtime/runtime.js";
import { createApp } from 'vue'
import App from './App.vue'
import '@/assets/scss/app.scss'
import store from "./store";
import router from "@/router/index";
import message from './message';
import receiveMessage from "@/utils/receiveMessage"
import dayjs from 'dayjs'
// Vuetify
import vuetify from '@/plugins/vuetify'
import VuetifyDialogPromise from "vuetify-dialog-promise";

window.sendMessage = message;
window.receiveMessage = receiveMessage;
const app = createApp(App);
app.use(vuetify)
app.use(VuetifyDialogPromise);
app.use(store)
app.use(router)
app.use(receiveMessage);
app.config.globalProperties.$dayjs = dayjs
app.mount("#app");
