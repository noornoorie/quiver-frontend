import type { EvaluationResultsDocumentWide, TimelineChartDataPoint } from "@/types"
import { createReadableMetricValue } from "@/helpers/utils"
import { useI18n } from "vue-i18n"
import i18n from '@/i18n'

const { t } = i18n.global
function metricChartTooltipContent(d: TimelineChartDataPoint, metric: string) {
  return `
    <div class="">
      <span class="font-semibold">${t('date')}:</span> <span>${d.date.getDate()}.${d.date.getMonth()}.${d.date.getFullYear()}</span>
    </div>
    <div class="">
      <span class="font-semibold">${t(metric)}:</span> <span>${createReadableMetricValue(<keyof EvaluationResultsDocumentWide>metric, d.value)}</span>
    </div>
  `
}

export {
  metricChartTooltipContent
}
