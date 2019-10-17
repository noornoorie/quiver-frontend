/* global Vue */
window.app = new Vue({
  el: '#app',
  data: {
    repos_raw: [],
    category_filter: [],
    step_filter: [],
  },
  computed: {
    repos() {
      return this.repos_raw
    },
    steps() {
      return this.all_processors.reduce((all, processor) => {
        all.push(...processor.steps.filter(step => all.indexOf(step) == -1))
        return all
      }, [])
    },
    categories() {
      return this.all_processors.reduce((all, processor) => {
        all.push(...processor.categories.filter(category => all.indexOf(category) == -1))
        return all
      }, [])
    },
    all_processors() {
      return this.repos_raw.reduce((all, repo) => {
        if (repo.ocrd_tool)
          all.push(...Object.values(repo.ocrd_tool.tools).map(tool => {
            tool.part_of = repo.org_plus_name
            return tool
          }))
        return all
      }, [])
    },
    processors() {
      return this.all_processors.filter(tool => {
        for (let step_filter of this.step_filter) {
          if (tool.steps.indexOf(step_filter) == -1)
            return false
        }
        for (let category_filter of this.category_filter) {
          if (tool.categories.indexOf(category_filter) == -1)
            return false
        }
        return true
      })
    }
  },
  mounted() {
    this.fetchRepoData()
  },
  methods: {
    fetchRepoData() {
      fetch('repos.json').then(resp => resp.json()).then(repos => this.repos.push(...repos))
    },
    toggleStepFilter(v) {
      if (v in this.step_filter) {
        this.step_filter = this.step_filter.splice(this.step_filter.indexOf(v), 1)
      } else {
        this.step_filter.push(v)
      }
    }
  }
})

