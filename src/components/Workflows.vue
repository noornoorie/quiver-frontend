<script setup lang="ts">
  import { onMounted, ref, watch } from "vue"
  import api from '@/helpers/api'
  import { useRouter, useRoute } from "vue-router"
  import WorkflowsTable from "@/components/workflows/WorkflowsTable.vue"
  import { useI18n } from "vue-i18n"
  import { mapGtId, setEvalColors } from "@/helpers/utils"
  import Filters from "@/components/workflows/filters/Filters.vue"
  import SelectButton from "primevue/selectbutton"
  import WorkflowsTimeline from "@/components/workflows/WorkflowsTimeline.vue"
  import filtersStore from "@/store/filters-store"
  import workflowsStore from "@/store/workflows-store"
  import type { ReleaseInfo } from "@/types";

  const { t } = useI18n()

  const data = ref([])

  const filteredData = ref([])
  const router = useRouter()
  const route = useRoute()
  const loading = ref(false)

  const options = ref([
    { name: t('timeline'), value: 'timeline' },
    { name: t('table'), value: 'table' }
  ])
  const selectedOption = ref(options.value[0])

  watch(() => filtersStore.gt, () => {
    filteredData.value = data.value.filter(({ metadata }) => filtersStore.gt.findIndex(({ value }) => value === mapGtId(metadata.gt_workspace['id']) ) > -1)
  })

  watch(selectedOption, ({ value }) => {
    router.push({ query: { view: value } })
  })

  onMounted(async () => {
    await router.isReady()

    loading.value = true

    const option = options.value.find((option) => {
      return route.query.view && route.query.view === option.value
    })

    if (option) {
      selectedOption.value = option
    }

    workflowsStore.runs = await api.getRuns()
    workflowsStore.gt = await api.getGroundTruth()
    workflowsStore.workflows = await api.getWorkflows()

    const releasesObj = workflowsStore.runs.reduce((acc, cur) => {
      acc[cur.metadata.release_info.tag_name] = cur.metadata.release_info
      return acc
    }, {})

    workflowsStore.releases = Object.keys(releasesObj).map(key => <ReleaseInfo>releasesObj[key])

    setEvalColors(workflowsStore.runs)

    loading.value = false
  })
</script>
<template>
  <template v-if="loading">
    Loading...
  </template>
  <template v-else>
    <div class="flex mb-6">
      <p class="text-amber-600 flex-grow-0 px-4 py-2 bg-amber-100 rounded-md text-sm"><span class="font-semibold">Disclaimer:</span> This is an experimental view.</p>
    </div>
    <div class="flex mb-6">
      <SelectButton v-model="selectedOption" :options="options" optionLabel="name"></SelectButton>
      <Filters class="ml-auto"/>
    </div>
    <div v-if="selectedOption">
      <WorkflowsTimeline v-if="selectedOption.value === 'timeline'" />
      <WorkflowsTable v-else />
    </div>
  </template>
</template>

<style scoped>

</style>
