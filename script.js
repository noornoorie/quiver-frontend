/* global Vue */
window.app = new Vue({
  el: '#app',
  data: {
    repos_raw: []
  },
  computed: {
    repos() {
      return this.repos_raw
      // return this.repos_raw.map(repo_raw => {
      //   console.log('xxx', {repo_raw})
      //   const ret = {}
      //   Object.entries(repo_raw).forEach(([k, v]) => {
      //     console.log({k, v})
      //     if (typeof v == Object) {
      //       ret = {...ret, ...v}
      //     } else {
      //       ret[k] = v
      //     }
      //   })
      //   return ret
      // })
    }
  },
  mounted() {
    this.fetchRepoData()
  },
  methods: {
    fetchRepoData() {
      fetch('/repos.json').then(resp => resp.json()).then(repos => this.repos.push(...repos))
    },
  }
})

