import { reactive } from 'vue';

export const store = reactive({
  repos: [],
  evaluations: [],
  metricDefinitions: {},
  setRepos(repos) {
    this.repos = repos;
  },
  setEvaluations(evaluations) {
    this.evaluations = evaluations;
  },
  setMetricDefinitions(defs) {
    this.metricDefinitions = defs;
  }
});
