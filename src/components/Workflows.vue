<template>
  <div class="_display:flex _margin-bottom:3">
<!--    <SelectButton v-model="selectedOption" :options="options" optionLabel="name"></SelectButton>-->
    <i-button-group>
      <i-button color="primary" size="lg" :outline="!isList" @click="selectedOption = options[0]">{{options[0].name}}</i-button>
      <i-button color="primary" size="lg" :outline="!isTable" @click="selectedOption = options[1]">{{options[1].name}}</i-button>
    </i-button-group>
    <MultiFilter
      class="_margin-left:auto"
      :amount-label="$t('datasets_selected')"
      v-model="datasetsFilterOptions"
      @update:model-value="onChangeDatasetFilter"
    />
  </div>
  <div v-if="selectedOption">
    <WorkflowsList v-if="selectedOption.value === 'list'" :data="filteredData" :defs="defs" />
    <WorkflowsTable v-else :data="filteredData" :defs="defs" />
  </div>
</template>

<script setup>
  import { computed, onMounted, ref, watch } from "vue"
  import api from '@/helpers/api'
  import { useRouter, useRoute } from "vue-router"
  import WorkflowsList from "@/components/workflows/WorkflowsList.vue"
  import WorkflowsTable from "@/components/workflows/WorkflowsTable.vue"
  import { useI18n } from "vue-i18n"
  import { setEvalColors } from "@/helpers/utils"
  import { store } from "@/helpers/store"
  import MultiFilter from "@/components/workflows/MultiFilter.vue"

  const { t } = useI18n()

  const data = ref([])
  const filteredData = ref([])
  const defs = ref({})
  const router = useRouter()
  const route = useRoute()

  const options = ref([
    { name: t('list'), value: 'list' },
    { name: t('table'), value: 'table' }
  ])
  const selectedOption = ref(null)
  const datasetsFilterOptions = ref([])

  const onChangeDatasetFilter = (value) => {
    value = value.filter(({ selected }) => !!(selected))
    filteredData.value = data.value
      .filter(item => value.find(({ id }) => item.metadata.gt_workspace['@id'] === id))
  }

  watch(selectedOption, ({ value }) => {
    router.push({ query: { view: value } })
  })

  const isList = computed(() => {
    return selectedOption.value && selectedOption.value.value === options.value[0].value
  })

  const isTable = computed(() => {
    return selectedOption.value && selectedOption.value.value === options.value[1].value
  })

  onMounted(async () => {
    await router.isReady()

    store.setRepos(await api.getProjects())

    data.value = await api.getLatestWorkflows()
    store.setEvaluations(data.value)

    defs.value = await api.getEvalDefinitions()
    store.setMetricDefinitions(defs.value)

    filteredData.value = data.value

    const datasetsMap = data.value
      .filter(item => !!(item.metadata.gt_workspace))
      .reduce((acc, cur) => {
        const gtWorkspaceId = cur.metadata.gt_workspace['@id']
        acc[gtWorkspaceId] = cur.metadata.gt_workspace.label
        return acc
      }, {})

    datasetsFilterOptions.value = Object.keys(datasetsMap).map(id => ({
      id,
      label: datasetsMap[id],
      selected: true
    }))

    setEvalColors(data.value)

    const filtered = options.value.filter((option) => {
      return route.query.view && route.query.view === option.value
    })

    selectedOption.value = filtered.length > 0 ? filtered[0] : options.value[0]
  })
</script>

<style scoped>

</style>
