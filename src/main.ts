import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'ant-design-vue/dist/reset.css'
import './assets/css/main.css'
import App from './App.vue'
import router from './router'

document.documentElement.lang = 'fa'
document.documentElement.dir = 'rtl'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
