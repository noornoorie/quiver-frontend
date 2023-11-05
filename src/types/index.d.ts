export interface GroundTruth {
  id: string,
  label: string
}

export interface Workflow {
  id: string,
  label: string,
  model: string,
  steps: WorkflowStep[]
}

export interface Workspace {
  id: string,
  label: string
}

export interface ReleaseInfo {
  id: string,
  tage_name: string
}

export interface WorkflowStep {
  id: string,
  params: WorkflowStepParams
}

export interface WorkflowStepParams {
  [key: string]: number | string
}

export interface EvaluationRun {
  eval_workflow_id: string,
  evaluation_results: EvaluationResults,
  label: string,
  metadata: EvaluationRunMetadata
}

export interface EvaluationRunMetadata {
  document_metadata: DocumentMetadata,
  eval_tool: string,
  eval_workflow: Workflow,
  eval_workspace: Workspace,
  gt_workspace: Workspace,
  ocr_workflow: Workflow,
  ocr_workspace: Workspace,
  release_info: ReleaseInfo,
  timestamp: string,
  workflow_model: string,
  workflow_steps: WorkflowStep[]
}

export interface EvaluationResults {
  by_page: EvaluationResultsByPage,
  document_wide: EvaluationResultsDocumentWide
}

export interface EvaluationResultsByPage {
  page_id: string,
  cer: number,
  wer: number
}

export interface EvaluationResultsDocumentWide {
  cer_mean: number | null,
  cer_median: number | null,
  cer_range: number[] | null,
  cer: number | null,
  cer_standard_deviation: number | null,
  cpu_time: number | null,
  pages_per_minute: number | null,
  wall_time: number | null,
  wer: number | null,
}

export interface DropdownOption {
  value: string,
  label: string
}

export interface TimelineChartDataPoint {
  date: Date,
  value: number
}

