import { reactive } from "vue"
import type { FilterOption } from "@/types"

export default reactive<{
  gt: FilterOption[],
  metric: FilterOption[]
}>({
  gt: [],
  metric: []
})
