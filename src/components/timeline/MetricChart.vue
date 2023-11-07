<script setup lang="ts">
import { onMounted, ref, watch } from "vue"
import api from "@/helpers/api"
import TimelineChart from "@/components/timeline/TimelineChart.vue"
import { getMaxValueOfMetric } from '@/helpers/metrics'
import type { EvaluationResultsDocumentWide, EvaluationRun } from "@/types"
import { TimelineChartDataPoint } from "@/types"
import { metricChartTooltipContent } from "@/helpers/metric-chart-tooltip-content"

const props = defineProps(['gtId', 'workflowId', 'metric', 'startDate', 'endDate'])
const runs = ref<EvaluationRun[]>([])
const data = ref([])
const maxY = ref(2)


onMounted(async () => {
  const { gtId, workflowId, metric } = props
  runs.value = await api.getRuns(gtId, workflowId)
  data.value = getTimelineData(runs.value, metric)
  maxY.value = getMaxValueOfMetric(metric)
})

watch(() => props.metric,
    (value) => {
      if (!runs.value) return
      data.value = getTimelineData(runs.value, value)
      maxY.value = getMaxValueOfMetric(value)
    }, { immediate: true }
)

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
  <TimelineChart :data="data" :max-y="maxY" :start-date="startDate" :end-date="endDate" :tooltip-content="tooltipContent" />
</template>

<style scoped lang="scss">

</style>
