import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import App from './App.vue'
import router from './router'
import axios from "./api/request.js";
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'ant-design-vue/dist/reset.css';
import Antd from 'ant-design-vue';
import vue3dLoader from "vue-3d-loader";
const app = createApp(App)
app.provide("$axios", axios)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router)
app.use(Antd)
app.use(vue3dLoader)
app.use(ElementPlus)
app.mount('#app')
