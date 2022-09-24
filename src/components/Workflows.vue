<template>
  <div class="container mb-3">
    <SelectButton v-model="selectedOption" :options="options" optionLabel="name"></SelectButton>
  </div>
  <WorkflowsList v-if="selectedOption.value === 'list'" :data="data" />
  <WorkflowsTable v-else :data="data" />
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import api from '@/helpers/api';
import { useRouter, useRoute } from "vue-router";
import WorkflowsList from "@/components/workflows/WorkflowsList.vue";
import WorkflowsTable from "@/components/workflows/WorkflowsTable.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const data = ref([]);
const router = useRouter();
const route = useRoute();

const options = ref([
  { name: t('list'), value: 'list' },
  { name: t('table'), value: 'table' }
]);
const selectedOption = ref(options.value[0]);


watch(selectedOption, ({ value }) => {
  router.push({ query: { view: value } });
});

onMounted(async () => {
  data.value = await api.getWorkflows();

  selectedOption.value = options.value.map((option) => {
    return (!route.query.view || route.query.view === option.value) ? option : options.value[0];
  })[0];
  
});
</script>

<style scoped>

</style>
