<template>
  <div class="_display:flex _align-items:center">
    <div class="_font-weight:bold">{{ amount }}</div>
    <i-dropdown class="_margin-left:1" placement="bottom-end">
      <i-button>{{ $t('change') }}</i-button>
      <template #body>
        <div class="options-container _padding-x:2">
          <i-checkbox v-model="allSelected" @update:modelValue="onSelectAll">{{ $t('select_all') }}</i-checkbox>
          <i-checkbox v-model="option.selected" @update:modelValue="onChange" v-for="option in filteredOptions" :key="option.id">{{ option.label }}</i-checkbox>
        </div>
      </template>
    </i-dropdown>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
const props = defineProps(['amount-label', 'modelValue'])
const emit = defineEmits(['update:modelValue'])

const totalAmount = ref(0)
const filteredOptions = ref([])
const allSelected = ref(true)

const amount = computed(() => {
  return filteredOptions.value.filter(({ selected }) => !!(selected)).length + ` ${t('of')} ` + totalAmount.value + ' ' + props.amountLabel
})

watch(() => props.modelValue, (value) => {
  totalAmount.value = value.length
  filteredOptions.value = value.map(({ id, label, selected = false }) => ({
    id, label, selected
  }))
}, { immediate: true })

const onChange = () => {
  allSelected.value = filteredOptions.value.filter(({ selected }) => !(selected)).length === 0
  emit('update:modelValue', filteredOptions.value)
}

const onSelectAll = (isChecked) => {
  filteredOptions.value.forEach((option, i) => filteredOptions.value[i].selected = isChecked)
  emit('update:modelValue', filteredOptions.value)
}

</script>

<style scoped>
.options-container {
  max-height: 30vh;
  overflow: auto;
}
</style>
