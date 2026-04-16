import { createApp } from 'vue'
import { createHead } from '@unhead/vue'
import App from './App.vue'
import { vuetify } from './plugins/vuetify'
import { router } from './router'
import { i18n } from './i18n'
import './styles/main.scss'

const app = createApp(App)
const head = createHead()

app.use(head)
app.use(i18n)
app.use(vuetify)
app.use(router)
app.mount('#app')
