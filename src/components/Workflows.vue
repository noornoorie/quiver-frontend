<script setup>
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

    loading.value = false

    setEvalColors(workflowsStore.runs)
  })
</script>
<template>
  <template v-if="loading">
    Loading...
  </template>
  <template v-else>
    <div class="flex mb-3">
      <SelectButton v-model="selectedOption" :options="options" optionLabel="name"></SelectButton>
      <Filters class="ml-auto w-1/3"/>
    </div>
    <div v-if="selectedOption">
      <WorkflowsTimeline v-if="selectedOption.value === 'timeline'" />
      <WorkflowsTable v-else />
    </div>
  </template>
</template>

<style scoped>

</style>
