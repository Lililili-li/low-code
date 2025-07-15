import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import "./mock/index.ts"
import './assets/main.css'
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import '@arco-design/web-vue/dist/arco.css';
import 'animate.css';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ArcoVueIcon);

app.mount('#app')
