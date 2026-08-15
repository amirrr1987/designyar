import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'ant-design-vue/dist/reset.css'
import './assets/css/main.css'
import App from './App.vue'
import router from './router'
import { usePersistenceStore } from '@/stores/persistence'

document.documentElement.lang = 'fa'
document.documentElement.dir = 'rtl'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

/** Eager migrate legacy keys → `ux-flow:v1` before first view render. */
const persistence = usePersistenceStore(pinia)
persistence.ensureNormalized()

app.mount('#app')
