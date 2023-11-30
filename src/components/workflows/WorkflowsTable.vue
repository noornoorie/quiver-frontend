<script setup lang="ts">
import { watch, ref, onMounted, computed } from "vue"
import { useI18n } from "vue-i18n"
import { createReadableMetricValue, getEvalColor, mapGtId } from "@/helpers/utils"
import type { EvaluationRun } from "@/types"
import Dropdown from 'primevue/dropdown'
import workflowsStore from "@/store/workflows-store"
import api from "@/helpers/api"
import filtersStore from "@/store/filters-store"

const { t } = useI18n()

const groupedData = ref({})
const evals = ref([])

const sortOptions = ref([{
  value: 'documents',
  label: t('documents')
}, {
  value: 'workflows',
  label: t('workflows')
}])

const sortBy = ref(sortOptions.value[0])
const latestRuns = ref<EvaluationRun[]>([])
const filteredRuns = ref<EvaluationRun[]>([])
const evalDefinitions = ref([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  latestRuns.value = workflowsStore.getLatestRuns()
  evalDefinitions.value = await api.getEvalDefinitions()
  setFilteredRuns()
  groupRuns(sortBy.value.value)
  loading.value = false
})

watch(() => filtersStore.gt, () => {
  setFilteredRuns()
  groupRuns(sortBy.value.value)
})

watch(sortBy, () => {
  groupRuns(sortBy.value.value)
})

function setFilteredRuns() {
  filteredRuns.value = latestRuns.value.filter(({ metadata }) => filtersStore.gt.findIndex(({ value }) => value === mapGtId(metadata.gt_workspace.id)) > -1)
}

function groupRuns(groupBy: string) {
  if (groupBy === 'workflows') groupByWorkflows()
  else if (groupBy === 'documents') groupByDocuments()
}

const groupByWorkflows = () => {
  groupedData.value = filteredRuns.value.filter(item => !!(item.metadata.ocr_workflow)).reduce((acc, cur) => {
    const ocrWorkflowId = mapGtId(cur.metadata.ocr_workflow['id'])
    const label = workflowsStore.getWorkflowById(ocrWorkflowId)?.label

    evals.value = Object.keys(cur.evaluation_results.document_wide)

    const subject = {
      label: workflowsStore.getGtById(mapGtId(cur.metadata.gt_workspace.id))?.label,
      evaluations: Object.keys(cur.evaluation_results.document_wide).map(key => ({
        name: key,
        value: cur.evaluation_results.document_wide[key]
      }))
    }
    if (!acc[ocrWorkflowId]) {
      acc[ocrWorkflowId] = {
        label,
        subjects: [subject]
      }
    } else {
      acc[ocrWorkflowId].subjects.push(subject)
      acc[ocrWorkflowId].subjects.sort((a, b) => {
        if (a.label > b.label) return 1
        else return -1
      })
    }
    return acc
  }, {})
}

const groupByDocuments = () => {
  groupedData.value = filteredRuns.value.filter(item => !!(item.metadata.gt_workspace)).reduce((acc, cur) => {
    const gtWorkspaceId = mapGtId(cur.metadata.gt_workspace['id'])
    const label = workflowsStore.getGtById(gtWorkspaceId)?.label
    evals.value = Object.keys(cur.evaluation_results.document_wide)
    const subject = {
      label: workflowsStore.getWorkflowById(mapGtId(cur.metadata.ocr_workflow['id']))?.label,
      evaluations: Object.keys(cur.evaluation_results.document_wide).map(key => ({
        name: key,
        value: cur.evaluation_results.document_wide[key]
      }))
    }
    if (!acc[gtWorkspaceId]) {
      acc[gtWorkspaceId] = {
        label,
        subjects: [subject]
      }
    } else {
      acc[gtWorkspaceId].subjects.push(subject)
      acc[gtWorkspaceId].subjects.sort((a, b) => {
        if (a.label > b.label) return 1
        else return -1
      })
    }
    return acc
  }, {})
}
</script>

<template>
  <template v-if="loading">
    Loading...
  </template>
  <template v-else>
    <div class="flex mb-4" v-if="evals.length > 0">
      <div class="flex items-center ml-auto">
        <p class="mr-2">{{ $t('group_by') }}:</p>
        <Dropdown v-model="sortBy" :options="sortOptions" optionLabel="label" placeholder="Choose something.." class="" />
      </div>
    </div>
    <table v-if="evals.length > 0" class="w-full border border-collapse rounded text-sm">
      <thead>
      <tr>
        <th class="p-2 border">{{ sortBy.value === 'documents' ? $t('documents') : $t('workflows') }}</th>
        <th class="p-2 border">{{ sortBy.value === 'documents' ? $t('workflows') : $t('documents') }}</th>
        <th v-for="(evalKey, i) in evals" :key="i" class="p-2 border">
          <span class="def-label flex items-center justify-center cursor-pointer">
            {{ evalDefinitions[evalKey] ? evalDefinitions[evalKey].label : evalKey }}
            <i-icon name="ink-info"/>
            <div class="def-tooltip">
              <div class="flex p-2 bg-white border rounded">
                {{ evalDefinitions[evalKey] ? evalDefinitions[evalKey].short_descr : $t('no_description') }}.
                <a v-if="evalDefinitions[evalKey]" :href="evalDefinitions[evalKey].url">{{ $t('details') }}</a>
              </div>
            </div>
          </span>
        </th>
      </tr>
      </thead>
      <tbody>
      <template v-for="(key, i) in Object.keys(groupedData)" :key="i">
        <tr v-for="(subject, j) in groupedData[key].subjects" :key="j">
          <td v-if="j === 0" :rowspan="groupedData[key].subjects.length" class="align-top pl-2 border w-1/3">
            <span class="font-bold">{{ groupedData[key].label }}</span>
          </td>
          <td class="align-top pl-2 border">{{ subject.label }}</td>
          <td
            v-for="({ name, value }, k) in subject.evaluations"
            :key="k"
            class="text-center pt-1 border"
            :class="(j === groupedData[key].subjects.length - 1) ? 'pb-5' : 'pb-1'"
          >
            <span
              class="metric inline-block cursor-pointer text-sm leading-none p-1 rounded-lg min-w-[48px]"
              :class="getEvalColor(name, value)">
              {{ createReadableMetricValue(name, value) }}
            </span>
          </td>
        </tr>
      </template>
      </tbody>
    </table>
    <div v-else>{{ $t('no_table_data') }}</div>
  </template>
</template>

<style scoped lang="scss">

.def-label {
  position: relative;

  &:hover {
    .def-tooltip {
      visibility: visible;
    }
  }
}

.def-tooltip {
  visibility: hidden;
  position: absolute;
  top: 0;
  transform: translateY(-100%);
  width: 300px;
  z-index: 100;
  padding-bottom: 10px;

  .card {
    box-shadow: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;
  }
}

th, th span {
  font-weight: bold;
}
</style>
