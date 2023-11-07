import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { createI18n } from "vue-i18n"

import { Inkline, components } from '@inkline/inkline'
import PrimeVue from 'primevue/config'

import '@inkline/inkline/inkline.scss'
import './assets/main.css'
import './assets/app.scss'
import i18n from "@/i18n"



const app = createApp(App)

app.use(Inkline, { components })
app.use(PrimeVue, { /* options */ })

app.use(router)
app.use(i18n)

app.mount('#app')
