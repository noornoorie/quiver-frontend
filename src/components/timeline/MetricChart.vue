<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"
import api from "@/helpers/api"
import BaseTimelineChart from "@/components/timeline/BaseTimelineChart.vue"
import { extendMaxValue, getMaxValueByMetric } from '@/helpers/metrics'
import type { EvaluationResultsDocumentWide, EvaluationRun, TimelineChartDataPoint } from "@/types"
import { metricChartTooltipContent } from "@/helpers/metric-chart-tooltip-content"
import OverlayPanel from 'primevue/overlaypanel'
import BaseTimelineDetailedChart from "@/components/timeline/BaseTimelineDetailedChart.vue"
import timelineStore from "@/store/timeline-store"

const props = defineProps(['gtId', 'workflowId', 'metric', 'startDate', 'endDate'])
const runs = ref<EvaluationRun[]>([])
const data = ref([])
const maxY = computed(() => timelineStore.maxValues[props.metric] ?? 0 )
const op = ref<OverlayPanel | null>(null)

onMounted(async () => {
  const { gtId, workflowId } = props
  runs.value = await api.getRuns(gtId, workflowId)
  init()
})

watch(() => props.metric, init)

function init() {
  if (!runs.value) return
  data.value = getTimelineData(runs.value, props.metric)

  const maxValueByMetric = getMaxValueByMetric(props.metric, runs.value)
  if (maxValueByMetric > maxY.value) {
    timelineStore.setMaxValue(props.metric, extendMaxValue(maxValueByMetric))
  }
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
    />
  </div>
  <OverlayPanel
    ref="op"
    :pt="{
      root: {
        class: 'z-[9999] bg-white border rounded-md shadow-md'
      }
    }"
  >
    <BaseTimelineDetailedChart
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
