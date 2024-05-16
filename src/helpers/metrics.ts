import type { EvaluationResultsDocumentWide, EvaluationRun } from "@/types"

const EvaluationMetrics = {
  CER_MEAN: 'cer_mean',
  CER_MEDIAN: 'cer_median',
  WER: 'wer',
  PAGES_PER_MINUTE: 'pages_per_minute',
  CER_STANDARD_DEVIATION: 'cer_standard_deviation',
  WALL_TIME: 'wall_time',
  CPU_TIME: 'cpu_time'
}

function getDefaultMaxValueOfMetric(metric: string): number {
  if (metric === EvaluationMetrics.CER_MEAN) return 2
  if (metric === EvaluationMetrics.CER_MEDIAN) return 2
  if (metric === EvaluationMetrics.CER_STANDARD_DEVIATION) return 2
  if (metric === EvaluationMetrics.WER) return 1
  if (metric === EvaluationMetrics.WALL_TIME) return 100
  if (metric === EvaluationMetrics.PAGES_PER_MINUTE) return 100
  if (metric === EvaluationMetrics.CPU_TIME) return 100

  else return 1
}

function getUnitOfMetric(metric: string): string {
  if (metric === EvaluationMetrics.CER_MEAN) return 'percentage'
  if (metric === EvaluationMetrics.CER_MEDIAN) return 'percentage'
  if (metric === EvaluationMetrics.CER_STANDARD_DEVIATION) return 'percentage'
  if (metric === EvaluationMetrics.WER) return 'percentage'
  if (metric === EvaluationMetrics.WALL_TIME) return 'seconds'
  if (metric === EvaluationMetrics.PAGES_PER_MINUTE) return 'pages'
  if (metric === EvaluationMetrics.CPU_TIME) return 'seconds'

  else return ''
}

function getMaxValueByMetric(metric: keyof EvaluationResultsDocumentWide, runs: EvaluationRun[] = []): number {
  const values = runs.map((run) => {
    const value = run.evaluation_results.document_wide[metric]
    return Array.isArray(value) ? Math.max(...value) : value ?? 0
  }) ?? []

  return Math.max(...values)
}

function isHigherPositive(metric: keyof EvaluationResultsDocumentWide): boolean {
  if (metric === EvaluationMetrics.CER_MEAN) return false
  if (metric === EvaluationMetrics.CER_MEDIAN) return false
  if (metric === EvaluationMetrics.CER_STANDARD_DEVIATION) return false
  if (metric === EvaluationMetrics.WER) return false
  if (metric === EvaluationMetrics.WALL_TIME) return false
  if (metric === EvaluationMetrics.PAGES_PER_MINUTE) return true
  if (metric === EvaluationMetrics.CPU_TIME) return false

  return false
}

export {
  EvaluationMetrics,
  getUnitOfMetric,
  getMaxValueByMetric,
  getDefaultMaxValueOfMetric,
  isHigherPositive
}
