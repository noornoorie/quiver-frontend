import { reactive, ref } from "vue"

export default reactive<{
  maxValues: {[metric: string]: number },
  setMaxValue: (metric: string, value: number) => void,
  getMaxValue: (metric: string) => number
}>({
  maxValues:{},
  setMaxValue(metric: string, value: number) {
    this.maxValues[metric] = value
  },
  getMaxValue(metric: string) {
    return this.maxValues[metric] ?? 0
  }
})
