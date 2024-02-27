<script setup lang="ts">
import TimelineItem from "@/components/workflows/timeline/TimelineItem.vue"
import Dropdown from 'primevue/dropdown'
import MultiSelect from 'primevue/multiselect'
import {computed, onMounted, ref, watch} from "vue"
import {EvaluationMetrics, getMaxValueByMetric} from '@/helpers/metrics'
import { useI18n } from "vue-i18n"
import type { DropdownOption, EvaluationResultsDocumentWide, Workflow, GroundTruth } from "@/types"
import { DropdownPassThroughStyles } from '@/helpers/pt'
import { deduplicateStepIds } from '@/helpers/utils'
import workflowsStore from '@/store/workflows-store'
import filtersStore from '@/store/filters-store'
import timelineStore from "@/store/timeline-store"
import TrendLegend from "@/components/workflows/TrendLegend.vue";

const { t } = useI18n()
const workflows = ref<Workflow[]>([])

const selectedMetric = ref<DropdownOption | null>(null)
const metrics = computed<DropdownOption[]>(() => Object.keys(EvaluationMetrics).map(key => ({ value: EvaluationMetrics[key], label: t(EvaluationMetrics[key]) })))
const selectedMetricValue = computed<keyof EvaluationResultsDocumentWide>(() => <keyof EvaluationResultsDocumentWide>selectedMetric.value?.value || EvaluationMetrics.CER_MEAN)

const dateRangeOptions = computed<DropdownOption[]>(() => filtersStore.dateRange)
const selectedDateRange = ref<DropdownOption | null>()

const workflowOptions = computed<DropdownOption[]>(() => filtersStore.workflow)
const selectedWorkflow = ref<DropdownOption | null>(null)

const workflowStepOptions = ref<DropdownOption[]>([])
const selectedWorkflowSteps = ref<DropdownOption[]>([])

const gtList = computed<GroundTruth[]>(() => {
  return workflowsStore.gt.filter(({ id, metadata }) => {
    let flag = filtersStore.gt.findIndex(({ value }) => value === id) > -1
    if (flag && selectedDateRange.value) {
      const splitDateRange = selectedDateRange.value.value.split('-')
      const from = splitDateRange[0]
      const to = splitDateRange[1]

      flag = flag && (metadata.time.notBefore === from && metadata.time.notAfter === to)
    }
    if (flag && selectedWorkflow.value) {
      flag = flag && workflowsStore.getRuns(id, selectedWorkflow.value.value).length > 0
    }
    if (flag && selectedWorkflowSteps.value.length > 0) {
      selectedWorkflowSteps.value.forEach(({ value }) => {
        if (!flag) {
          return
        }
        flag = flag && workflowsStore.getRuns(id).findIndex(({ metadata }) => {
          return metadata.workflow_steps.findIndex(({ id }) => id === value) > -1
        }) > -1
      })
    }
    return flag
  })
})

onMounted(async () => {
  selectedMetric.value = metrics.value[0]
  workflows.value = workflowsStore.workflows
})

watch(selectedMetric,
  () => timelineStore.setMaxValue(
    selectedMetricValue.value,
    getMaxValueByMetric(selectedMetricValue.value, workflowsStore.runs)
  ),
    { immediate: true }
)

watch(
  selectedWorkflow,
  (selected) => {
    selectedWorkflowSteps.value = []
    if (!selected) {
      workflowStepOptions.value = deduplicateStepIds(workflowsStore.workflows).map(id => ({ value: id, label: t(id) }))
      return
    }
    const workflow = workflowsStore.workflows.find((item) => item.id === selected.value)
    if (!workflow) {
      console.error("Invalid state")
      return
    }
    workflowStepOptions.value = workflow.steps.map(({ id }) => ({ value: id, label: t(id) }))
  },
  { immediate: true }
)
</script>

<template>
  <div class="flex flex-col">
    <div class="flex w-full mb-4">
      <Dropdown
        v-model="selectedMetric"
        :options="metrics"
        :pt="DropdownPassThroughStyles"
        optionLabel="label"
        placeholder="Select a metric"
        class="ml-auto md:w-14rem"
        unstyled
      />
    </div>
    <div class="flex w-full mb-4">
      <Dropdown
        v-model="selectedDateRange"
        :options="dateRangeOptions"
        :pt="DropdownPassThroughStyles"
        optionLabel="label"
        :placeholder="t('Filter by date range')"
        showClear
        class="ml-auto md:w-14rem"
        unstyled
      />
      <Dropdown
        v-model="selectedWorkflow"
        :options="workflowOptions"
        :pt="DropdownPassThroughStyles"
        optionLabel="label"
        :placeholder="t('Filter by workflow')"
        showClear
        class="ml-4 md:w-14rem"
        unstyled
      />
      <MultiSelect
        v-model="selectedWorkflowSteps"
        filter
        :max-selected-labels="1"
        :options="workflowStepOptions"
        optionLabel="label"
        :placeholder="t('Filter by processor')"
        class="ml-4 md:w-14rem"
      />
    </div>
    <TrendLegend class="ml-auto mb-4"/>
    <div class="flex flex-col space-y-6">
      <template v-if="gtList.length > 0">
        <TimelineItem
          v-for="gt in gtList"
          :key="gt.id"
          :gt="gt"
          :metric="selectedMetricValue"
          :selected-workflow-id="selectedWorkflow?.value"
          :selected-workflow-step-ids="selectedWorkflowSteps.map((item) => item.value)"
        />
      </template>
      <template v-else>
        <div class="my-6">An error has occurred. Please try again later!</div>
      </template>
    </div>
  </div>

</template>

<style scoped lang="scss">

</style>
