<template>
  <div class="container mb-3">
    <SelectButton v-model="selectedOption" :options="options" optionLabel="name"></SelectButton>
  </div>
  <div v-if="selectedOption">
    <WorkflowsList v-if="selectedOption.value === 'list'" :data="data" :defs="defs" />
    <WorkflowsTable v-else :data="data" :defs="defs" />
  </div>
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
const defs = ref({});
const router = useRouter();
const route = useRoute();

const options = ref([
  { name: t('list'), value: 'list' },
  { name: t('table'), value: 'table' }
]);
const selectedOption = ref(null);


watch(selectedOption, ({ value }) => {
  router.push({ query: { view: value } });
});

onMounted(async () => {
  await router.isReady();

  data.value = await api.getWorkflows();
  defs.value = await api.getEvalDefinitions();

  const filtered = options.value.filter((option) => {
    return route.query.view && route.query.view === option.value;
  });

  selectedOption.value = filtered.length > 0 ? filtered[0] : options.value[0];
});
</script>

<style scoped>

</style>
