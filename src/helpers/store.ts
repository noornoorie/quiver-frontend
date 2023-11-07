import { reactive } from 'vue'
import type { GroundTruth, Workflow } from "@/types"

interface State {
  gtList: GroundTruth[],
  workflows: Workflow[],
  setGTList: (gt: GroundTruth[]) => void,
  setWorkflows: (workflows: Workflow[]) => void,
}

export const store = reactive<State>({
  repos: [],
  releases: [],
  evaluations: [],
  metricDefinitions: {},
  gtList: [],
  workflows: [],
  setGTList(gtList) {
    this.gtList = gtList
  },
  setWorkflows(workflows) {
    this.workflows = workflows
  },
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
