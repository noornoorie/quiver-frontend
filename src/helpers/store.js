import { reactive } from 'vue'

export const store = reactive({
  repos: [],
  releases: [],
  evaluations: [],
  metricDefinitions: {},
  setRepos(repos) {
    this.repos = repos
  },
  setReleases(releases) {
    this.releases = releases
  },
  setEvaluations(evaluations) {
    this.evaluations = evaluations
  },
  setMetricDefinitions(defs) {
    this.metricDefinitions = defs
  },
  getRepoById(id) {
    return this.repos.find(repo => {
      return repo.id === id
    })
  }
})
