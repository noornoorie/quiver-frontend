<template>
  <b-container fluid>
    <b-row>
      <button @click="fetchRepoData">Fetch!</button>
    </b-row>
    <b-tabs>
      <b-tab title="Processors">
        <ocrd-processor-list
          :processors="processors"
          :steps="steps"
          :step_filter="step_filter"
          :categories="categories"
          :category_filter="category_filter"
          ></ocrd-processor-list>
      </b-tab>
      <b-tab active title="Projects">
        <ocrd-project-list
          :repos="repos"
          ></ocrd-project-list>
      </b-tab>
    </b-tabs>
    <!-- <b-modal id="processor-modal">
    </b-modal> -->
    <b-modal id="project-modal">
      <ocrd-project-list-item
        :repo="repos[modalProjectIndex]"
        >
      </ocrd-project-list-item>
    </b-modal>
  </b-container>
</template>

<script>
import OcrdProcessorList from './OcrdProcessorList.vue'
import OcrdProjectList from './OcrdProjectList.vue'
import OcrdProcessorListItem from './OcrdProcessorListItem.vue'
import OcrdProjectListItem from './OcrdProjectListItem.vue'
export default {
  components: {
    OcrdProcessorList,
    OcrdProjectList,
    OcrdProcessorListItem,
    OcrdProjectListItem
  },
  data() {
    return {
      modalProjectIndex: 0,
      modalProcessorIndex: 0,
      modalProjectVisible: false,
      modalProcessorVisible: false,
      repos_raw: [],
      category_filter: [],
      step_filter: [],
    }
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
        tool_idx = 0
        if (repo.ocrd_tool)
          all.push(...Object.values(repo.ocrd_tool.tools).map(tool => {
            tool.idx = tool_idx++
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
      fetch('repos.json').then(resp => resp.json()).then(repos => {
          repos.map((repo, idx) => repo.idx = idx)
          this.repos_raw.splice(0, this.repos_raw.length)
          this.repos_raw.push(...repos)
        }
      )
    },
    toggleStepFilter(v) {
      if (v in this.step_filter) {
        this.step_filter = this.step_filter.splice(this.step_filter.indexOf(v), 1)
      } else {
        this.step_filter.push(v)
      }
    }
  }
}
</script>

<style>
</style>
