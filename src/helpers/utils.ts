import { ref } from 'vue'
import type { EvaluationResultsDocumentWide, EvaluationRun, Workflow, WorkflowStep } from "@/types"

const utils = ref({})

const getEvalColor = (name: string, value) => {
  const colorMap = utils.value[name]
  if (colorMap) {
    const keys = Object.keys(colorMap)
    return keys.find((key, i) => {
      const isLast = i === keys.length - 1
      return value <= colorMap[key] || isLast && value > colorMap[key]
    })
  }
  return null
}

const setEvalColors = (runs: EvaluationRun[]) => {
  const allValues = []

  runs
    .filter(({ evaluation_results }) => !!(evaluation_results))
    .forEach(({ evaluation_results }) => {
      const { document_wide: evals } = evaluation_results

      if (!evals) return

      Object
        .keys(evals)
        .filter(key => !Array.isArray(key))
        .forEach(key => {
          allValues[key] = [...(allValues[key] ?? []), evals[key]]
        })
    })

  Object
    .keys(allValues)
    .forEach(key => {
      const singleMetricValues = allValues[key]
      const min = Math.min(...singleMetricValues)
      const max = Math.max(...singleMetricValues)

      const diff = max - min
      const step = diff / 3

      if (!utils.value[key]) {
        utils.value[key] = {}
      }

      utils.value[key]["eval-positive"] = min + step
      utils.value[key]["eval-neutral"] = min + 2 * step
      utils.value[key]["eval-negative"] = min + 3 * step
    })
}

const shortenMetricValue = (value: number) => {
  return Math.round(value * 1000) / 1000
}

const createReadableMetricValue = (key: keyof EvaluationResultsDocumentWide, value: number | number[]) => {
  if (['cer_mean', 'cer_median', 'wer', 'pages_per_minute', 'cer_standard_deviation', 'wall_time', 'cpu_time'].includes(key)) {
    return shortenMetricValue(<number>value)
  } else if (key === 'cer_range') {
    return shortenMetricValue(value[0]) + ' / ' + shortenMetricValue(value[1])
  }

  return value
}

const mapGtId = (id: string) => {
  const arr = id.split('/')
  return arr[arr.length - 1].split('.')[0]
}

const deduplicateStepIds = (workflows: Workflow[]) => {
  return Array.from(workflows.reduce((acc, cur) => {
    cur.steps.forEach(({ id }) => {
      acc.add(id)
    })
    return acc
  }, new Set<string>()))
}

export {
  getEvalColor,
  setEvalColors,
  createReadableMetricValue,
  mapGtId,
  deduplicateStepIds,
}
