<script setup lang="ts">
import { onMounted, ref, watch } from "vue"
import api from "@/helpers/api"
import BaseTimelineChart from "@/components/timeline/BaseTimelineChart.vue"
import type {EvaluationResultsDocumentWide, EvaluationRun, TimelineChartDataPoint, Workflow} from "@/types"
import { getMaxValueOfMetric } from '@/helpers/metrics'
import {useI18n} from "vue-i18n";
import { metricChartTooltipContent } from "@/helpers/metric-chart-tooltip-content";
import OverlayPanel from "primevue/overlaypanel";

const { t } = useI18n()

const props = defineProps<{
  gtId: string,
  metric: string,
  startDate: Date,
  endDate: Date
}>()

const data = ref<TimelineChartDataPoint[]>([])
const maxY = ref(2)
const workflows = ref<Workflow[] | null>(null)
const runs = ref<EvaluationRun[]>([])
const op = ref<OverlayPanel | null>(null)

onMounted(async () => {
  const { gtId, metric } = props
  workflows.value = await api.getWorkflows()

  runs.value = await api.getRuns(gtId)

  data.value = getTimelineData(runs.value, metric)
  maxY.value = getMaxValueOfMetric(metric)
})

watch(() => props.metric, async (value) => {
  data.value = getTimelineData(runs.value, value)
  maxY.value = getMaxValueOfMetric(value)
})

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
    />
  </div>  <OverlayPanel
      ref="op"
      :pt="{
      root: {
        class: 'z-[9999] bg-white border rounded-md shadow-md'
      }
    }"
  >
    <BaseTimelineChart
        :data="data"
        :max-y="maxY"
        :start-date="startDate"
        :end-date="endDate"
        :tooltip-content="tooltipContent"
        :height="400"
        :width="660"
    />
  </OverlayPanel>
</template>

<style scoped lang="scss">
</style>
