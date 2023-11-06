const EvaluationMetrics = {
  CER_MEAN: 'cer_mean',
  CER_MEDIAN: 'cer_median',
  WER: 'wer',
  PAGES_PER_MINUTE: 'pages_per_minute',
  CER_STANDARD_DEVIATION: 'cer_standard_deviation',
  WALL_TIME: 'wall_time',
  CPU_TIME: 'cpu_time'
}

function getMaxValueOfMetric(metric: string): number {
  if (metric === EvaluationMetrics.CER_MEAN) return 2
  if (metric === EvaluationMetrics.CER_MEDIAN) return 2
  if (metric === EvaluationMetrics.CER_STANDARD_DEVIATION) return 2
  if (metric === EvaluationMetrics.WER) return 1
  if (metric === EvaluationMetrics.WALL_TIME) return 100
  if (metric === EvaluationMetrics.PAGES_PER_MINUTE) return 100
  if (metric === EvaluationMetrics.CPU_TIME) return 100

  else return 1
}

export {
  EvaluationMetrics,
  getMaxValueOfMetric
}
