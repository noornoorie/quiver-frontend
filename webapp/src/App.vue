<template>
  <b-container fluid>
    <b-row>
      <button @click="$root.fetchprojectData">Fetch!</button>
    </b-row>
    <b-tabs>
      <b-tab title="Processors">
        <ocrd-processor-list
          :processors="processors"
          ></ocrd-processor-list>
      </b-tab>
      <b-tab active title="Projects">
        <ocrd-project-list
          :projects="projects"
          ></ocrd-project-list>
      </b-tab>
    </b-tabs>
    <!-- <b-modal id="processor-modal">
    </b-modal> -->
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
    }
  },
  computed: {
    projects() {
      return this.$root.projects
    },
    processors() {
      return this.projects.reduce((all, project) => {
        let tool_idx = 0
        if (project.ocrd_tool)
          all.push(...Object.values(project.ocrd_tool.tools).map(tool => {
            tool.idx = tool_idx++
            tool.part_of = project.org_plus_name
            tool.official = project.official
            return tool
          }))
        return all
      }, [])
    },
  },
  mounted() {
      this.$root.fetchprojectData()
  },
  methods: {}
}
</script>

<style>
</style>
