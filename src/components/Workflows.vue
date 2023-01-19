<template>
  <div class="_margin-bottom:3">
<!--    <SelectButton v-model="selectedOption" :options="options" optionLabel="name"></SelectButton>-->
    <i-button-group>
      <i-button color="primary" size="lg" :outline="!isList" @click="selectedOption = options[0]">{{options[0].name}}</i-button>
      <i-button color="primary" size="lg" :outline="!isTable" @click="selectedOption = options[1]">{{options[1].name}}</i-button>
    </i-button-group>
  </div>
  <div v-if="selectedOption">
    <WorkflowsList v-if="selectedOption.value === 'list'" :data="data" :defs="defs" />
    <WorkflowsTable v-else :data="data" :defs="defs" />
  </div>
</template>

<script setup>
  import { computed, onMounted, ref, watch } from "vue";
  import api from '@/helpers/api';
  import { useRouter, useRoute } from "vue-router";
  import WorkflowsList from "@/components/workflows/WorkflowsList.vue";
  import WorkflowsTable from "@/components/workflows/WorkflowsTable.vue";
  import { useI18n } from "vue-i18n";
  import { setEvalColors } from "../helpers/eval-colors";

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

  const isList = computed(() => {
    return selectedOption.value && selectedOption.value.value === options.value[0].value;
  });

  const isTable = computed(() => {
    return selectedOption.value && selectedOption.value.value === options.value[1].value;
  });

  onMounted(async () => {
    await router.isReady();

    data.value = await api.getWorkflows();
    defs.value = await api.getEvalDefinitions();

    setEvalColors(data.value);

    const filtered = options.value.filter((option) => {
      return route.query.view && route.query.view === option.value;
    });

    selectedOption.value = filtered.length > 0 ? filtered[0] : options.value[0];
  });
</script>

<style scoped>

</style>
