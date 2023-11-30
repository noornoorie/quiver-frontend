<script setup>
  import { onMounted, ref, watch } from "vue"
  import api from '@/helpers/api'
  import { useRouter, useRoute } from "vue-router"
  import WorkflowsTable from "@/components/workflows/WorkflowsTable.vue"
  import { useI18n } from "vue-i18n"
  import { mapGtId, setEvalColors } from "@/helpers/utils"
  import { store } from "@/helpers/store"
  import Filters from "@/components/workflows/filters/Filters.vue"
  import SelectButton from "primevue/selectbutton"
  import WorkflowsTimeline from "@/components/workflows/WorkflowsTimeline.vue"
  import filtersStore from "@/store/filters-store"

  const { t } = useI18n()

  const data = ref([])

  const filteredData = ref([])
  const defs = ref({})
  const router = useRouter()
  const route = useRoute()

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

    const filtered = options.value.filter((option) => {
      return route.query.view && route.query.view === option.value
    })
    selectedOption.value = filtered.length > 0 ? filtered[0] : options.value[0]

    let gtList = store.gtList

    if (!gtList.length) {
      gtList = await api.getGroundTruth()
      store.setGTList(gtList)
    }

    let workflows = store.workflows

    if (!workflows.length) {
      workflows = await api.getWorkflows()
      store.setWorkflows(workflows)
    }

    const runs = []

    for await (let gt of gtList) {
      try {
        const latestRuns = await api.getLatestRuns(gt.id,)
        if (latestRuns.length > 0) {
          runs.push(...latestRuns)
        }
      } catch (e) {
      }
    }
    data.value = runs

    defs.value = await api.getEvalDefinitions()

    filteredData.value = data.value

    setEvalColors(data.value)
  })
</script>
<template>
  <div class="flex mb-3">
    <SelectButton v-model="selectedOption" :options="options" optionLabel="name"></SelectButton>
  </div>
  <div><Filters /></div>
  <div v-if="selectedOption">
    <WorkflowsTimeline v-if="selectedOption.value === 'timeline'" />
    <WorkflowsTable v-else :data="filteredData" :defs="defs" />
  </div>
</template>

<style scoped>

</style>
