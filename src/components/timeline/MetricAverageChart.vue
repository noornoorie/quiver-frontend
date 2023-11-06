<script setup lang="ts">
import { onMounted, ref, watch } from "vue"
import api from "@/helpers/api"
import TimelineChart from "@/components/timeline/TimelineChart.vue"
import type {EvaluationResultsDocumentWide, EvaluationRun, TimelineChartDataPoint, Workflow} from "@/types"
import Metrics from '@/helpers/metrics'

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

onMounted(async () => {
  const { gtId, metric } = props
  workflows.value = await api.getWorkflows()

  runs.value = await api.getRuns(gtId)

  data.value = getTimelineData(runs.value, metric)
  maxY.value = getMaxYByMetric(metric)
})

watch(() => props.metric, async (value) => {
  data.value = getTimelineData(runs.value, value)
  maxY.value = getMaxYByMetric(value)
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

function getMaxYByMetric(metric: string) {
  if (metric === Metrics.CER_MEAN) return 2
  if (metric === Metrics.CER_MEDIAN) return 2
  if (metric === Metrics.CER_STANDARD_DEVIATION) return 2
  if (metric === Metrics.WER) return 1
  if (metric === Metrics.WALL_TIME) return 2
  if (metric === Metrics.PAGES_PER_MINUTE) return 100
  if (metric === Metrics.CPU_TIME) return 100

  else return 1
}

</script>

<template>
  <TimelineChart :data="data" :max-y="maxY" :start-date="startDate" :end-date="endDate"/>
</template>

<style scoped lang="scss">
</style>
