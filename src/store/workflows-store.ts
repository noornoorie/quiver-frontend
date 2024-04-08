import { reactive } from "vue"
import type { EvaluationRun, EvaluationResultsDocumentWide, GroundTruth, ReleaseInfo, Workflow } from "@/types"
import { mapGtId } from "@/helpers/utils"
import { getMaxValueByMetric } from "@/helpers/metrics"

function normalizeDate(dateString: string): string {
  return new Date(new Date(dateString).setHours(0, 0, 0, 0)).toDateString()
}

export default reactive<{
  gt: GroundTruth[],
  workflows: Workflow[],
  runs: EvaluationRun[],
  releases: ReleaseInfo[],
  getRuns: (gtId: string, workflowId?: string) => EvaluationRun[]
  getLatestRuns: (gtId?: string) => EvaluationRun[],
  getGtById: (id: string) => GroundTruth | null
  getWorkflowById: (id: string) => Workflow | null
  sortGtbyYearAsc: () => void
  sortGtbyYearDesc: () => void
  sortGtbyLabelAsc: () => void
  sortGtbyLabelDesc: () => void
  sortGtbyMetricAsc: (metric: keyof EvaluationResultsDocumentWide) => void
  sortGtbyMetricDesc: (metric: keyof EvaluationResultsDocumentWide) => void
}>({
  gt: [],
  workflows: [],
  runs: [],
  releases: [],
  getRuns(gtId: string, workflowId?: string) {
    return this.runs
      .filter(
        ({ metadata }) => {
          const matchGt = mapGtId(metadata.gt_workspace.id) === gtId
          const matchWorkflow =  mapGtId(metadata.ocr_workflow.id) === workflowId

          return matchGt && (workflowId ? matchWorkflow : true)
        }
      )
  },
  getLatestRuns(gtId?: string) {
    const dates = Object.keys(this.runs.reduce((acc, cur) => {
      acc[normalizeDate(cur.metadata.timestamp)] = null
      return acc
    }, <{ [key: string]: null}>{}))

    return this.runs.filter(
      ({ metadata }) => {
        const matchGt = gtId ? mapGtId(metadata.gt_workspace.id) === gtId : true
        return matchGt && normalizeDate(metadata.timestamp) === dates[dates.length - 1]
      }
    )
  },
  getGtById(id: string): GroundTruth | null {
    return this.gt.find((item) => item.id === id) ?? null
  },
  getWorkflowById(id: string): Workflow | null {
    return this.workflows.find((item) => item.id === id) ?? null
  },
  sortGtbyYearAsc() {
    this.gt.sort((left, right) => {
      const leftSplit = left.id.split('_')
      const rightSplit = right.id.split('_')
      if (leftSplit.length < 1 || rightSplit.length < 1) {
        console.warn("[SORT GT] GTID couldn't be split properly")
        return 0
      }

      const leftYear = Number(leftSplit[leftSplit.length-1])
      const rightYear = Number(rightSplit[rightSplit.length-1])
      if (isNaN(leftYear) || isNaN(rightYear)) {
        console.warn("[SORT GT] Year couldn't be parsed properly from GTID ")
        return 0
      }
      return leftYear - rightYear
    })
  },
  sortGtbyYearDesc() {
    this.gt.sort((left, right) => {
      const leftSplit = left.id.split('_')
      const rightSplit = right.id.split('_')
      if (leftSplit.length < 1 || rightSplit.length < 1) {
        console.warn("[SORT GT] GTID couldn't be split properly")
        return 0
      }

      const leftYear = Number(leftSplit[leftSplit.length-1])
      const rightYear = Number(rightSplit[rightSplit.length-1])
      if (isNaN(leftYear) || isNaN(rightYear)) {
        console.warn("[SORT GT] Year couldn't be parsed properly from GTID ")
        return 0
      }
      return rightYear - leftYear
    })
  },
  sortGtbyLabelAsc()  {
    this.gt.sort((left, right) => {
      const leftLabel = left.label.toUpperCase()
      const rightLabel = right.label.toUpperCase()
      if (leftLabel < rightLabel) {
        return -1
      } else if (leftLabel > rightLabel) {
        return 1
      } else {
        return 0
      }
    })
  },
  sortGtbyLabelDesc() {
    this.gt.sort((left, right) => {
      const leftLabel = left.label.toUpperCase()
      const rightLabel = right.label.toUpperCase()
      if (rightLabel < leftLabel) {
        return -1
      } else if (rightLabel > leftLabel) {
        return 1
      } else {
        return 0
      }
    })
  },
  sortGtbyMetricAsc(metric: keyof EvaluationResultsDocumentWide) {
    this.gt.sort((left, right) => {
      let leftValue = 0
      let rightValue = 0

      const leftRuns = this.getLatestRuns(left.id)
      const rightRuns = this.getLatestRuns(right.id)
      //
      // TODO: Decide what to do for empty (missed) runs
      // currently placed all the way down unsorted
      if (leftRuns.length < 1) {
        return 1
      }
      if (rightRuns.length < 1) {
        return -1
      }

      leftValue = leftRuns.reduce((acc, cur) => {
        const value = <number | null>cur.evaluation_results.document_wide[<keyof EvaluationResultsDocumentWide>metric]
        return acc += value ?? 0
      }, 0) / leftRuns.length
      rightValue = rightRuns.reduce((acc, cur) => {
        const value = <number | null>cur.evaluation_results.document_wide[<keyof EvaluationResultsDocumentWide>metric]
        return acc += value ?? 0
      }, 0) / rightRuns.length

      return leftValue - rightValue
    })
  },
  sortGtbyMetricDesc(metric: keyof EvaluationResultsDocumentWide) {
    this.gt.sort((left, right) => {
      let leftValue = 0
      let rightValue = 0

      const leftRuns = this.getLatestRuns(left.id)
      const rightRuns = this.getLatestRuns(right.id)

      // TODO: Decide what to do for empty (missed) runs
      // currently placed all the way down unsorted
      if (leftRuns.length < 1) {
        return 1
      }
      if (rightRuns.length < 1) {
        return -1
      }

      leftValue = leftRuns.reduce((acc, cur) => {
        const value = <number | null>cur.evaluation_results.document_wide[<keyof EvaluationResultsDocumentWide>metric]
        return acc += value ?? 0
      }, 0) / leftRuns.length
      rightValue = rightRuns.reduce((acc, cur) => {
        const value = <number | null>cur.evaluation_results.document_wide[<keyof EvaluationResultsDocumentWide>metric]
        return acc += value ?? 0
      }, 0) / rightRuns.length

      return rightValue - leftValue
    })
  },
})
