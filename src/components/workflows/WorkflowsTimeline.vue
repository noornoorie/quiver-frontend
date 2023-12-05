<script setup lang="ts">
import TimelineItem from "@/components/workflows/timeline/TimelineItem.vue"
import Dropdown from 'primevue/dropdown'
import {computed, onMounted, ref, watch} from "vue"
import {EvaluationMetrics, getMaxValueByMetric} from '@/helpers/metrics'
import { useI18n } from "vue-i18n"
import type {DropdownOption, EvaluationResultsDocumentWide, Workflow} from "@/types"
import { DropdownPassThroughStyles } from '@/helpers/pt'
import workflowsStore from '@/store/workflows-store'
import filtersStore from '@/store/filters-store'
import timelineStore from "@/store/timeline-store"

const { t } = useI18n()
const gtList = computed(() => workflowsStore.gt.filter(({ id }) => filtersStore.gt.findIndex(({ value }) => value === id) > -1))
const workflows = ref<Workflow[]>([])
const selectedMetric = ref<DropdownOption | null>(null)
const metrics = computed<DropdownOption[]>(() => Object.keys(EvaluationMetrics).map(key => ({ value: EvaluationMetrics[key], label: t(EvaluationMetrics[key]) })))
const selectedMetricValue = computed<keyof EvaluationResultsDocumentWide>(() => <keyof EvaluationResultsDocumentWide>selectedMetric.value?.value || EvaluationMetrics.CER_MEAN)

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
