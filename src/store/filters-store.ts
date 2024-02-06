import { reactive } from "vue"
import type { FilterOption } from "@/types"

export default reactive<{
  gt: FilterOption[],
  metric: FilterOption[],
  workflow: FilterOption[],
  dateRange: FilterOption[],
}>({
  gt: [],
  metric: [],
  workflow: [],
  dateRange: [],
})
