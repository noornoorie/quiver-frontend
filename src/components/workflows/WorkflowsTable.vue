<script setup lang="ts">
import { watch, ref } from "vue"
import { useI18n } from "vue-i18n"
import { createReadableMetricValue, getEvalColor, mapGtId } from "@/helpers/utils"
import type { EvaluationRun } from "@/types"
import Dropdown from 'primevue/dropdown'

const { t } = useI18n()
const props = defineProps<{
  data: EvaluationRun[]
  defs: any,
}>()
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

watch(sortBy, ({ value }) => {
  if (value === 'workflows') groupByWorkflows()
  else if (value === 'documents') groupByDocuments()
})

const groupByWorkflows = () => {
  groupedData.value = props.data.filter(item => !!(item.metadata.ocr_workflow)).reduce((acc, cur) => {
    const ocrWorkflowId = mapGtId(cur.metadata.ocr_workflow['id'])
    const label = cur.metadata.ocr_workflow.label

    evals.value = Object.keys(cur.evaluation_results.document_wide)

    const subject = {
      label: cur.metadata.gt_workspace.label,
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
  groupedData.value = props.data.filter(item => !!(item.metadata.gt_workspace)).reduce((acc, cur) => {
    const gtWorkspaceId = mapGtId(cur.metadata.gt_workspace['id'])
    const label = cur.metadata.gt_workspace.label
    evals.value = Object.keys(cur.evaluation_results.document_wide)
    const subject = {
      label: cur.metadata.ocr_workflow.label,
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

watch(() => props.data, groupByDocuments, { immediate: true })
</script>

<template>
  <div>
    <div class="flex mb-4" v-if="evals.length > 0">
      <div class="flex items-center ml-auto">
        <p class="mr-2">{{ $t('group_by') }}:</p>
        <Dropdown v-model="sortBy" :options="sortOptions" optionLabel="label" placeholder="Choose something.." class="" />
      </div>
    </div>
    <table v-if="evals.length > 0" class="w-full border border-collapse text-sm">
      <thead>
      <tr>
        <th class="p-2 border">{{ sortBy.value === 'documents' ? $t('documents') : $t('workflows') }}</th>
        <th class="p-2 border">{{ sortBy.value === 'documents' ? $t('workflows') : $t('documents') }}</th>
        <th v-for="(evalKey, i) in evals" :key="i" class="p-2 border">
          <span class="def-label flex items-center justify-center cursor-pointer">
            {{ defs[evalKey] ? defs[evalKey].label : evalKey }}
            <i-icon name="ink-info"/>
            <div class="def-tooltip">
              <div class="flex p-2 bg-white border rounded">
                {{ defs[evalKey] ? defs[evalKey].short_descr : $t('no_description') }}.
                <a v-if="defs[evalKey]" :href="defs[evalKey].url">{{ $t('details') }}</a>
              </div>
            </div>
          </span>
        </th>
      </tr>
      </thead>
      <tbody>
      <template v-for="(key, i) in Object.keys(groupedData)" :key="i">
        <tr v-for="(subject, j) in groupedData[key].subjects" :key="j">
          <td v-if="j === 0" :rowspan="groupedData[key].subjects.length" class="align-top pl-2 border">
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
  </div>
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
