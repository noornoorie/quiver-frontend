<script setup lang="ts">
import Panel from "primevue/panel"
import OverlayPanel from 'primevue/overlaypanel'
import StepsAcronyms from '@/helpers/workflow-steps-acronyms'
import MetricChart from "@/components/timeline/MetricChart.vue"
import type { GroundTruth, Workflow, WorkflowStep } from "@/types"
import MetricAverageChart from "@/components/timeline/MetricAverageChart.vue"
import { Icon } from '@iconify/vue'
import { ref } from "vue"
import { OverlayPanelDropdownStyles } from "@/helpers/pt"

const props = defineProps<{
  gt: GroundTruth,
  workflows: Workflow[],
  metric: string
}>()

const op = ref<OverlayPanel>()
const selectedStep = ref<WorkflowStep | null>(null)
const startDate = ref<Date>(new Date('2023-10-01'))
const endDate = ref<Date>(new Date())

function getStepAcronym(stepId) {
  return StepsAcronyms[stepId]
}

function showParametersOverlay(step: WorkflowStep, event: Event) {
  selectedStep.value = step
  op.value?.show(event)
}

function hideParametersOverlay() {
  op.value?.hide()
}

</script>

<template>
  <Panel
    header="Header"
    toggleable
    :collapsed="true"
    unstyled
    :pt="{
      root: 'border border-gray-300 rounded-lg overflow-hidden',
      header: 'pt-4',
      content: '',
      icons: 'w-full flex',
      toggler: 'w-full flex justify-center bg-gray-50 text-gray-500 p-2 hover:bg-gray-100 rounded hover:text-gray-700 focus:outline-none'
    }"
  >
    <template v-slot:header>
      <div class="flex w-full px-4">
        <h2 class="w-1/2 text-xl font-bold flex-shrink-0">{{ gt.label }}</h2>
        <div class="w-1/2 flex justify-end">
          <div class="flex overflow-x-auto">
            <MetricAverageChart
              :gt-id="gt.id"
              :metric="metric"
              class=""
              :width="400"
              :start-date="startDate"
              :end-date="endDate"
            />
          </div>
        </div>
      </div>
    </template>
    <template v-slot:default>
      <div class="flex border-t border-gray-300 pt-4 px-4">
        <table class="table-fixed w-full">
          <tr v-for="workflow in workflows" :key="workflow.id">
            <td class="font-semibold pe-2">{{ workflow.label }}</td>
            <td class="p-1 overflow-x-auto">
              <span
                v-for="step in workflow.steps"
                :key="step.id"
                class="p-1 cursor-pointer"
                @mouseenter="showParametersOverlay(step, $event)"
                @mouseleave="hideParametersOverlay()"
              >
              {{ getStepAcronym(step.id) }}
            </span>
            </td>
            <td class="overflow-x-auto">
              <MetricChart
                :gt-id="gt.id"
                :workflow-id="workflow.id"
                :metric="metric"
                :width="400"
                :start-date="startDate"
                :end-date="endDate"
                class="flex justify-end"
              />
            </td>
          </tr>
        </table>
      </div>
    </template>
    <template v-slot:togglericon="{ collapsed }">
      <Icon :icon="collapsed ? 'bi:chevron-down' : 'bi:chevron-up'"/>
    </template>
  </Panel>
  <OverlayPanel
    ref="op"
    :pt="OverlayPanelDropdownStyles"
  >
    <div class="flex flex-col pt-2">
      <h2 class="font-bold px-2 pb-2 mb-2 border-b border-gray-300">{{ selectedStep?.id }}</h2>
      <table v-if="selectedStep" class="text-sm border-collapse">
        <tr class="">
          <th class="p-1 pl-2 font-semibold">Parameter</th>
          <th class="p-1 pr-2 font-semibold">Value</th>
        </tr>
        <tr v-for="step in Object.keys(selectedStep.params)" :key="step">
          <td class="p-1 pl-2 border-collapse border border-l-0 border-b-0 border-gray-300">{{ step }}</td>
          <td class="p-1 pr-2 border-collapse border border-r-0 border-b-0 border-gray-300">{{ selectedStep.params[step] }}</td>
        </tr>
      </table>
    </div>
  </OverlayPanel>
</template>

<style scoped lang="scss">

</style>
