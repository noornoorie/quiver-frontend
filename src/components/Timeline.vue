<script setup lang="ts">
import api from '@/helpers/api'
import TimelineItem from "@/components/timeline/TimelineItem.vue"
import Dropdown from 'primevue/dropdown'
import { computed, onMounted, ref } from "vue"
import { EvaluationMetrics } from '@/helpers/metrics'
import { useI18n } from "vue-i18n"
import type { DropdownOption } from "@/types"
import { DropdownPassThroughStyles } from '@/helpers/pt'

const { t } = useI18n()
const gtList = ref([])
const workflows = ref([])
const selectedMetric = ref<DropdownOption | null>(null)
const metrics = computed<DropdownOption[]>(() => Object.keys(EvaluationMetrics).map(key => ({ value: EvaluationMetrics[key], label: t(EvaluationMetrics[key]) })))
const selectedMetricValue = computed<string>(() => selectedMetric.value?.value || EvaluationMetrics.CER_MEAN)
onMounted(async () => {
  try {
    gtList.value = await api.getGroundTruth()
    workflows.value = await api.getWorkflows()
    selectedMetric.value = metrics.value[0]
  } catch {

  }

})

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
    <div class="flex flex-col space-y-4">
      <template v-if="gtList.length > 0">
        <TimelineItem v-for="gt in gtList" :key="gt.id" :gt="gt" :workflows="workflows" :metric="selectedMetricValue" />
      </template>
      <template v-else>
        <div class="my-6">An error has occurred. Please try again later!</div>
      </template>
    </div>
  </div>

</template>

<style scoped lang="scss">

</style>
