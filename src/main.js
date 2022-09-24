import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import PrimeVue from 'primevue/config';
import TabMenu from 'primevue/tabmenu';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Dropdown from 'primevue/dropdown';
import SelectButton from 'primevue/selectbutton';

import { createI18n } from "vue-i18n";


import 'primevue/resources/themes/lara-light-indigo/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import './assets/main.scss';


import en from './locales/en.json';
import de from './locales/de.json';

const i18n = createI18n({
  locale: 'de',
  messages: { en, de }
});

const app = createApp(App);

app.use(PrimeVue);
app.use(router);
app.use(i18n);

app.component('TabMenu', TabMenu);
app.component('Button', Button);
app.component('Card', Card);
app.component('Dropdown', Dropdown);
app.component('SelectButton', SelectButton);

app.mount('#app');
