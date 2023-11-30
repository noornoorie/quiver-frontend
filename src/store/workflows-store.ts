import { reactive } from "vue"
import type { GroundTruth, Workflow } from "@/types"

export default reactive<{
  gt: GroundTruth[],
  workflows: Workflow[]
}>({
  gt: [],
  workflows: []
})
