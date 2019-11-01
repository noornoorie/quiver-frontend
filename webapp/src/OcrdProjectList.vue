<template>
  <div>
    <b-row>
      <b-button v-b-toggle.project-controls class="m-1">Toggle Controls</b-button>
      <b-collapse id="project-controls">
        <b-container>
          <b-row>
            <b-form-checkbox v-model="show_unofficial" name="check-button" switch>
            Unofficial projects <b>({{ checked ? "Show" : "hide" }})</b>
            </b-form-checkbox>
          </b-row>
          <b-row>
            Filter by name: <input type="text" v-model="name_filter"/> (Showing {{ filtered_projects.length }} of {{ projects.length}} projects)
          </b-row>
          <b-row>
            Tabs: <b-button @click="tabIndex -= 1">&lt;</b-button> <b-button @click="tabIndex += 1">&gt;</b-button>
          </b-row>
        </b-container>
      </b-collapse>
    </b-row>
    <b-row class="list">
      <ocrd-project-list-item
        v-for="project,idx in filtered_projects"
        :key="project.org_plus_name"
        :project="project"
        :tabIndex="tabIndex"
        :projectIndex="idx"
      >
      </ocrd-project-list-item>
    </b-row>

    <b-modal id="project-modal"
             size="xl"
             :hide-header="true"
             :hide-footer="true"
      >
      <ocrd-project-list-item
        :project="projects[$root.modalProjectIndex]"
        :projectIndex="$root.modalProjectIndex"
        :modal="true"
        >
      </ocrd-project-list-item>
    </b-modal>
  </div>
</template>

<script>
import OcrdProjectListItem from './OcrdProjectListItem.vue'
export default {
  data() {
    return {
      name_filter: '',
      show_unofficial: true,
      tabIndex: 0,
    }
  },
  computed: {
    filtered_projects() {
      return this.projects.filter(project => {
        if (!(this.show_unofficial || project.official)) {
          return false
        }
        return project.name.toLowerCase().includes(this.name_filter.toLowerCase())
      })
    }
  },
  components: {
    OcrdProjectListItem
  },
  props: {
    projects: {required: true}
  },
  methods: {
    switchTab(delta) {
      this.tabIndex += delta
    }
  }
}
</script>

<style>

.list .ocrd-project-list-item {
  max-width: 30rem;
  max-height: 30rem;
  overflow: auto;
}

</style>
