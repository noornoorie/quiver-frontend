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
  render: h => h(App),
  data() {
    return {
      projects: [],
      modalProjectIndex: 0,
      modalProcessorIndex: 0,
      modalProjectVisible: false,
      modalProcessorVisible: false,
    }
  },
  methods: {
    fetchprojectData() {
      fetch('/repos.json').then(resp => resp.json()).then(projects => {
          projects.map((project, idx) => project.idx = idx)
          this.projects.splice(0, this.projects.length)
          this.projects.push(...projects)
        }
      )
    },
    showModal(projectOrProcessor, idx) {
      if (projectOrProcessor === 'processor') {
        console.log("Not implemented")
        this.$bvModal.show('processor-modal')
      } else {
        this.modalProjectIndex = idx
        this.$bvModal.show('project-modal')
      }
    },
  }
})
