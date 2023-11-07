<script setup>
  import { computed, onMounted, ref, watch } from "vue"
  import api from '@/helpers/api'
  import { useRouter, useRoute } from "vue-router"
  import WorkflowsList from "@/components/workflows/WorkflowsList.vue"
  import WorkflowsTable from "@/components/workflows/WorkflowsTable.vue"
  import { useI18n } from "vue-i18n"
  import { mapGtId, setEvalColors } from "@/helpers/utils"
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
  const selectedOption = ref(options.value[1])
  const datasetsFilterOptions = ref([])

  const onChangeDatasetFilter = (value) => {
    value = value.filter(({ selected }) => !!(selected))
    filteredData.value = data.value
      .filter(item => value.find(({ id }) => mapGtId(item.metadata.gt_workspace['id']) === id))
  }

  watch(selectedOption, ({ value }) => {
    router.push({ query: { view: value } })
  })

  const isList = computed(() => selectedOption.value?.value === options.value[0].value)
  const isTable = computed(() => selectedOption.value?.value === options.value[1].value)

  onMounted(async () => {
    await router.isReady()

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

    const datasetsMap = data.value
      .filter(item => !!(item?.metadata.gt_workspace))
      .reduce((acc, cur) => {
        let gtWorkspaceId = mapGtId(cur.metadata.gt_workspace['id'])

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

    // selectedOption.value = filtered.length > 0 ? filtered[0] : options.value[0]
  })
</script>
<template>
  <div class="flex mb-3">
    <!--    <SelectButton v-model="selectedOption" :options="options" optionLabel="name"></SelectButton>-->
<!--    <i-button-group>-->
<!--      <i-button color="primary" size="lg" :outline="!isList" @click="selectedOption = options[0]">{{options[0].name}}</i-button>-->
<!--      <i-button color="primary" size="lg" :outline="!isTable" @click="selectedOption = options[1]">{{options[1].name}}</i-button>-->
<!--    </i-button-group>-->
    <MultiFilter
      class="ml-auto"
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

<style scoped>

</style>
