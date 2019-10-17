/* global Vue */
window.app = new Vue({
  el: '#app',
  data: {
    repos_raw: []
  },
  computed: {
    repos() {
      return this.repos_raw
    }
  },
  mounted() {
    this.fetchRepoData()
  },
  methods: {
    fetchRepoData() {
      fetch('repos.json').then(resp => resp.json()).then(repos => this.repos.push(...repos))
    },
  }
})

