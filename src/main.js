import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { createI18n } from "vue-i18n";

import { Inkline, components } from '@inkline/inkline';
import '@inkline/inkline/inkline.scss';
import './assets/app.scss';

import en from './locales/en.json';
import de from './locales/de.json';

const i18n = createI18n({
  locale: 'en',
  messages: { en, de }
});

const app = createApp(App);

app.use(Inkline, {
  components
});

app.use(router);
app.use(i18n);


app.mount('#app');
