<script setup>
import { onMounted, ref, watch } from "vue"
import api from "@/helpers/api"
import TimelineChart from "@/components/timeline/TimelineChart.vue"
import Metrics from '@/helpers/metrics'

const props = defineProps(['gtId', 'workflowId', 'metric'])
const runs = ref([])
const data = ref([])
const maxY = ref(2)

function getMaxYByMetric(metric) {
  if (metric === Metrics.CER_MEAN) return 2
  if (metric === Metrics.CER_MEDIAN) return 2
  if (metric === Metrics.CER_STANDARD_DEVIATION) return 2
  if (metric === Metrics.WER) return 1
  if (metric === Metrics.WALL_TIME) return 2
  if (metric === Metrics.PAGES_PER_MINUTE) return 100
  if (metric === Metrics.CPU_TIME) return 100

  else return 1
}

onMounted(async () => {
  const { gtId, workflowId, metric } = props
  runs.value = await api.getRuns(gtId, workflowId)
  data.value = getTimelineData(runs.value, metric)
  maxY.value = getMaxYByMetric(metric)
})

watch(() => props.metric,
    (value) => {
      if (!runs.value) return
      data.value = getTimelineData(runs.value, value)
      maxY.value = getMaxYByMetric(value)
    }, { immediate: true }
)

function getTimelineData(runs, metric) {
  return runs.map(({ metadata, evaluation_results }) => {
    const value = evaluation_results.document_wide[metric]
    return {
      date: new Date(metadata.timestamp),
      value
    }
  })
}

</script>

<template>
  <TimelineChart :data="data" :max-y="maxY" />
</template>

<style scoped lang="scss">

</style>
