import { reactive } from "vue"
import type { EvaluationRun, GroundTruth, Workflow } from "@/types"
import { mapGtId } from "@/helpers/utils"

function normalizeDate(dateString: string): string {
  return new Date(new Date(dateString).setHours(0, 0, 0, 0)).toDateString()
}

export default reactive<{
  gt: GroundTruth[],
  workflows: Workflow[],
  runs: EvaluationRun[],
  getRuns: (gtId: string, workflowId?: string) => EvaluationRun[]
  getLatestRuns: () => EvaluationRun[],
  getGtById: (id: string) => GroundTruth | null
  getWorkflowById: (id: string) => Workflow | null
}>({
  gt: [],
  workflows: [],
  runs: [],
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
  getLatestRuns() {
    const dates = Object.keys(this.runs.reduce((acc, cur) => {
      acc[normalizeDate(cur.metadata.timestamp)] = null
      return acc
    }, <{ [key: string]: null}>{}))

    return this.runs.filter(({ metadata }) => normalizeDate(metadata.timestamp) === dates[dates.length - 1])
  },
  getGtById(id: string): GroundTruth | null {
    return this.gt.find((item) => item.id === id) ?? null
  },
  getWorkflowById(id: string): Workflow | null {
    return this.workflows.find((item) => item.id === id) ?? null
  }
})
