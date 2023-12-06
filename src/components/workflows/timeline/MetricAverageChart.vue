<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue"
import BaseTimelineChart from "@/components/workflows/timeline/BaseTimelineChart.vue"
import type {EvaluationResultsDocumentWide, EvaluationRun, TimelineChartDataPoint} from "@/types"
import { metricChartTooltipContent } from "@/helpers/metric-chart-tooltip-content";
import OverlayPanel from "primevue/overlaypanel";
import BaseTimelineDetailedChart from "@/components/workflows/timeline/BaseTimelineDetailedChart.vue";
import timelineStore from "@/store/timeline-store";
import {isHigherPositive} from "@/helpers/metrics";

const props = defineProps<{
  runs: EvaluationRun[],
  metric: keyof EvaluationResultsDocumentWide,
  startDate: Date,
  endDate: Date,
  workflowName: string
}>()

const data = ref<TimelineChartDataPoint[]>([])
const maxY = computed(() => timelineStore.maxValues[props.metric] ?? 0)
const op = ref<OverlayPanel | null>(null)

onMounted(async () => {
  init()
})

watch(() => props.metric, init)

function init() {
  if (!props.runs) return
  data.value = getTimelineData(props.runs, props.metric)
}

function getTimelineData(runs: EvaluationRun[], metric: string): TimelineChartDataPoint[] {
  const datesValues = runs.reduce((acc, cur) => {
    const date = new Date(new Date(cur.metadata.timestamp).setHours(0, 0, 0, 0)).toDateString()
    const value = cur.evaluation_results.document_wide[<keyof EvaluationResultsDocumentWide>metric]
    if (!value || Array.isArray(value)) return acc

    if (!acc[date]) acc[date] = [value]
    else acc[date] = [...acc[date], value]
    return acc
  },
  <{ [key: string]: number[] }>{})

  return Object
    .keys(datesValues)
    .sort((a, b) => new Date(a) - new Date(b))
    .map(date => {
      const value = datesValues[date].reduce((a, b) => a + b, 0) / datesValues[date].length
      return {
        date: new Date(date),
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
    <h3 class="font-semibold">{{ workflowName }}</h3>
    <BaseTimelineDetailedChart
      :data="data"
      :max-y="maxY"
      :y-axis-title="$t(metric)"
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
