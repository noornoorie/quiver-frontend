<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"
import { useI18n } from 'vue-i18n'
import OverlayPanel from 'primevue/overlaypanel'
import type { EvaluationResultsDocumentWide, EvaluationRun, TimelineChartDataPoint } from "@/types"
import { metricChartTooltipContent } from "@/helpers/metric-chart-tooltip-content"
import BaseTimelineChart from "@/components/workflows/timeline/BaseTimelineChart.vue"
import BaseTimelineDetailedChart from "@/components/workflows/timeline/BaseTimelineDetailedChart.vue"
import timelineStore from "@/store/timeline-store"
import { getUnitOfMetric, isHigherPositive } from "@/helpers/metrics"

const props = defineProps<{
  runs: EvaluationRun[],
  metric: keyof EvaluationResultsDocumentWide,
  startDate: Date,
  endDate: Date,
  workflowName: string,
  gtName: string
}>()

const { t } = useI18n()

const data = ref([])
const maxY = computed(() => timelineStore.maxValues[props.metric] ?? 0 )
const op = ref<OverlayPanel | null>(null)

onMounted(async () => {
  init()
})

watch(() => props.metric, init)

function init() {
  if (!props.runs) return
  data.value = getTimelineData(props.runs, props.metric)
}

function getTimelineData(runs: EvaluationRun[], metric: keyof EvaluationResultsDocumentWide) {
  return runs.map(({ metadata, evaluation_results }) => {
    const value = evaluation_results.document_wide[metric]
    return {
      date: new Date(metadata.timestamp),
      value
    }
  })
}

function tooltipContent(d: TimelineChartDataPoint) {
  return metricChartTooltipContent(d, props.metric)
}

</script>

<template>
  <div @click="op?.toggle($event)" class="cursor-pointer flex justify-end">
    <BaseTimelineChart
      :data="data"
      :max-y="maxY"
      :start-date="startDate"
      :end-date="endDate"
      :tooltip-content="tooltipContent"
      :width="400"
      :higher-is-positive="isHigherPositive(metric)"
    />
  </div>
  <OverlayPanel
    ref="op"
    :pt="{
      root: {
        class: 'z-[1111] bg-white border rounded-md shadow-md p-5'
      }
    }"
  >
    <BaseTimelineDetailedChart
      :data="data"
      :max-y="maxY"
      :y-axis-title="`${t(metric)} (${t(getUnitOfMetric(metric))})`"
      :workflow="workflowName"
      :label="gtName"
      :start-date="startDate"
      :end-date="endDate"
      :tooltip-content="tooltipContent"
      :height="400"
      :width="660"
      :higher-is-positive="isHigherPositive(metric)"
    />
  </OverlayPanel>
</template>

<style scoped lang="scss">

</style>
