import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// import 'vue-code-highlight/themes/duotone-sea.css'
import 'vue-code-highlight/themes/prism.css'
import 'vue-code-highlight/themes/prism-coy.css'
// import 'vue-code-highlight/themes/prism-dark.css'
// import 'vue-code-highlight/themes/prism-funky.css'
// import 'vue-code-highlight/themes/prism-okaidia.css'
// import 'vue-code-highlight/themes/prism-solarizedlight.css'
// import 'vue-code-highlight/themes/prism-tomorrow.css'
// import 'vue-code-highlight/themes/prism-twilight.css'
// import 'vue-code-highlight/themes/window.css'

window.kwalitee_app = new Vue({
  el: '#ocrd-kwalitee',
  render: h => h(App)
})
