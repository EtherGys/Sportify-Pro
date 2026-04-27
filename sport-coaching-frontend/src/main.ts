import { createApp } from 'vue'
import ToastPlugin from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth.store'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(ToastPlugin)

const authStore = useAuthStore()
authStore.hydrateFromStorage()

app.mount('#app')
