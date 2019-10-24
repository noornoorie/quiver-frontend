<template>
  <div>
    <b-row>
      <b-button v-b-toggle.project-controls class="m-1">Toggle Controls</b-button>
      <b-collapse id="project-controls">
        <b-container>
          <b-row>
            Filter by name: <input type="text" v-model="name_filter"/> (Showing {{ filtered_repos.length }} of {{ repos.length}} repos)
          </b-row>
          <b-row>
            Tabs: <b-button @click="tabIndex -= 1">&lt;</b-button> <b-button @click="tabIndex += 1">&gt;</b-button>
          </b-row>
        </b-container>
      </b-collapse>
    </b-row>
    <b-row>
      <ocrd-project-list-item
        v-for="repo, idx in filtered_repos"
        :key="repo.org_plus_name"
        :repo="repo"
        :tabIndex="tabIndex"
      >
      </ocrd-project-list-item>
    </b-row>

  </div>
</template>

<script>
import OcrdProjectListItem from './OcrdProjectListItem.vue'
export default {
  data() {
    return {
      name_filter: '',
      tabIndex: 0,
    }
  },
  computed: {
    filtered_repos() {
      return this.repos.filter(repo => repo.name.toLowerCase().includes(this.name_filter.toLowerCase()))
    }
  },
  components: {
    OcrdProjectListItem
  },
  props: {
    repos: {required: true}
  },
  methods: {
    switchTab(delta) {
      this.tabIndex += delta
    }
  }
}
</script>

<style>

</style>
