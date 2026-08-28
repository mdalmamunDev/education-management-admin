import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import Antd from 'ant-design-vue';
// import 'ant-design-vue/dist/antd.css';
import commonMixin from "./mixins/commonMixin";
import Toast, { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";
import httpMixin from "./mixins/httpMixin";
import store from "./store";
import ActionButton from "./components/ActionButton.vue";
import BackButton from "./components/BackButton.vue";

const app = createApp(App);

app.use(router);
app.use(Antd);
app.use(store);
app.mixin(commonMixin);
app.mixin(httpMixin);

// toast notification
const toast = useToast();
app.config.globalProperties.$toast = toast;

app.use(Toast, {
  // Global options (optional)
});

app.component("ActionButton", ActionButton);
app.component("BackButton", BackButton);

app.mount("#app");
