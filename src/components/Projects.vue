<template>
  <template v-if="releases.length === 0">
    <p>{{$t('no_content')}}</p>
  </template>
  <template v-else>
    <div
      v-for="{ tag, projects } in releases"
      :key="tag"
      class="border-l border-gray-400 pb-8"
    >
      <div class="timeline-item relative pl-5 flex">
        <div class="bg-gray-300 rounded-md px-2 font-bold">ocrd_all {{tag}}</div>
      </div>
      <div class="projects-container ml-6 mt-3 flex flex-wrap gap-4">
        <div v-for="projectId in projects" :key="projectId" class="flex sm:w-3/12">
          <Project :id="projectId" class="flex-grow"></Project>
        </div>
      </div>
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
    background: theme('colors.gray.300');
    left: -10px;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 50%;
  }

  div {
    position: relative;
    &:before {
      content: '';
      position: absolute;
      display: block;
      width: 8px;
      height: 8px;
      top: 50%;
      left: -4px;
      transform: translateY(-50%) rotate(45deg);
      background: theme('colors.gray.300');
      z-index: -1;
    }
  }
}
</style>
