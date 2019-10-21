import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

new Vue({
  el: '#ocrd-kwalitee',
  render: h => h(App)
})
