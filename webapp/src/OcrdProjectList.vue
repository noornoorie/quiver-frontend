<template>
  <div>
    <b-row>
      <ocrd-project-list-item
        v-for="repo in repos"
        :key="repo.org_plus_name"
        :repo="repo"
      >
      </ocrd-project-list-item>
    </b-row>

  </div>
</template>

<script>
import OcrdProjectListItem from './OcrdProjectListItem.vue'
export default {
  components: {
    OcrdProjectListItem
  },
  props: {
    repos: {required: true}
  }
}
</script>

<style>

</style>
