import { reactive } from 'vue';

export const store = reactive({
    repos: [],
    setRepos(repos) {
        this.repos = repos;
    }
});
