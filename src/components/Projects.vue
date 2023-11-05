<template>
  <template v-if="releases.length === 0">
    <p>{{$t('no_content')}}</p>
  </template>
  <template v-else>
    <div
      v-for="{ tag, projects } in releases"
      :key="tag"
      class="_border-left _border-left-color:gray-40 _padding-bottom:5"
    >
      <div class="timeline-item _font-weight:bold _padding-left:3">
        <i-badge size="lg" class="_padding:1 _font-weight:bold">ocrd_all {{tag}}</i-badge>
      </div>
      <i-row class="projects-container _margin-left:2 _margin-top:3 _display:flex">
        <i-column v-for="projectId in projects" :key="projectId" sm="3" class="_margin-bottom:2 _display:flex">
          <Project :id="projectId" class="_flex-grow:1"></Project>
        </i-column>
      </i-row>
    </div>
  </template>
</template>

<script setup>

import { onMounted, ref } from "vue"
import { store } from "@/helpers/store"
import api from "@/helpers/api"
import Project from "@/components/projects/Project.vue"

const releases = ref([])

onMounted(async () => {
  store.setRepos(await api.getProjects())

  releases.value = await api.getOcrdAllReleases()
  store.setReleases(releases.value)
})
</script>

<style lang="scss" scoped>
.timeline-item {
  &:before {
    content: "";
    position: absolute;
    display: block;
    width: 18px;
    height: 18px;
    background: var(--color--gray-40);
    left: -10px;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 50%;
  }
}

.badge {
  &:before {
    content: "";
    position: absolute;
    display: block;
    width: 8px;
    height: 8px;
    background: var(----background);
    left: -4px;
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
  }
}
</style>
