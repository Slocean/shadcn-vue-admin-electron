import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { i18n, setupI18n } from './i18n'

const app = createApp(App)
const pinia = createPinia()

await setupI18n()

app.use(pinia)
app.use(i18n)
app.use(router)

app.mount('#app')
