<script setup lang="ts">
import TimelineItem from "@/components/workflows/timeline/TimelineItem.vue"
import Dropdown from 'primevue/dropdown'
import {computed, onMounted, ref, watch} from "vue"
import {EvaluationMetrics, getMaxValueByMetric} from '@/helpers/metrics'
import { SortOptions } from '@/helpers/sort'
import { useI18n } from "vue-i18n"
import type { DropdownOption, EvaluationResultsDocumentWide, Workflow, GroundTruth } from "@/types"
import { DropdownPassThroughStyles } from '@/helpers/pt'
import workflowsStore from '@/store/workflows-store'
import filtersStore from '@/store/filters-store'
import timelineStore from "@/store/timeline-store"
import TrendLegend from "@/components/workflows/TrendLegend.vue";

const { t } = useI18n()
const workflows = ref<Workflow[]>([])
const selectedMetric = ref<DropdownOption | null>(null)
const selectedMetricValue = computed<keyof EvaluationResultsDocumentWide>(() => <keyof EvaluationResultsDocumentWide>selectedMetric.value?.value || EvaluationMetrics.CER_MEAN)
const gtList = computed<GroundTruth[]>(() => (
    workflowsStore.gt.filter(({ id }) => filtersStore.gt.findIndex(({ value }) => value === id) > -1)
  )
)
const metrics = computed<DropdownOption[]>(() => (
    Object.keys(EvaluationMetrics).map(key => ({ value: EvaluationMetrics[key], label: t(EvaluationMetrics[key]) }))
  )
)
const sortOpts = computed<DropdownOption[]>(() => (
  Object.keys(SortOptions).map(key => (
    {
      value: SortOptions[key],
      label: t(SortOptions[key]),
    }
  ))
))
const selectedSortType = ref<DropdownOption | null>(null)

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
  selectedSortType,
  (type) => {
    switch (type?.value) {
      case 'year_asc':
        workflowsStore.sortGtbyYearAsc()
        break
      case 'year_desc':
        workflowsStore.sortGtbyYearDesc()
        break
      case 'label_asc':
        workflowsStore.sortGtbyLabelAsc()
        break
      case 'label_desc':
        workflowsStore.sortGtbyLabelDesc()
        break
      case 'metric_asc':
        workflowsStore.sortGtbyMetricAsc(selectedMetricValue.value)
        break
      case 'metric_desc':
        workflowsStore.sortGtbyMetricDesc(selectedMetricValue.value)
        break
    }
  }
)

watch(
  selectedMetricValue,
  (metric) => {
    if (selectedSortType.value) {
      switch (selectedSortType.value.value) {
        case 'metric_asc':
          workflowsStore.sortGtbyMetricAsc(metric)
          break
        case 'metric_desc':
          workflowsStore.sortGtbyMetricDesc(metric)
          break
      }
    }
  },
)
</script>

<template>
  <div class="flex flex-col">
    <div class="flex w-full mb-2">
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
        v-model="selectedSortType"
        :options="sortOpts"
        :pt="DropdownPassThroughStyles"
        optionLabel="label"
        placeholder="Sort by"
        class="ml-auto md:w-14rem"
        unstyled
      />
    </div>
    <TrendLegend class="ml-auto mb-4"/>
    <div class="flex flex-col space-y-6">
      <template v-if="gtList.length > 0">
        <TimelineItem v-for="gt in gtList" :key="gt.id" :gt="gt" :metric="selectedMetricValue" />
      </template>
      <template v-else>
        <div class="my-6">An error has occurred. Please try again later!</div>
      </template>
    </div>
  </div>

</template>

<style scoped lang="scss">

</style>
