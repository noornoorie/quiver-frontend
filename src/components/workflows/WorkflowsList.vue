<template>
  <div>
    <Card v-for="(item, i) in list" :key="i" class="mb-3 shadow-3 border-gray-200 p-4">
      <template #header>
        <div class="grid align-items-center gap-2">
          <h3 class="text-xl font-bold">{{ item.label }}</h3>
          <Tag :value="item.metadata.workflow_model" class="bg-gray-300 text-gray-700 ml-3"></Tag>
          <Tag v-for="font in item.metadata.document_metadata.fonts" :key="font" :value="font" class="bg-gray-300 text-gray-700"></Tag>
        </div>
      </template>
      <template #content>
        <div class="grid">
          <div class="col-7 grid">
            <Accordion class="text-sm mr-3 flex-1">
              <AccordionTab :header="item.metadata.gt_workspace.label">
                <div class="grid">
                  <div class="col">
                    <p class="font-bold">{{ $t('number_of_pages') }}:</p>
                    <p>{{ item.metadata.document_metadata.number_of_pages }}</p>
                    <p class="mt-2 font-bold">{{ $t('publication_year') }}:</p>
                    <p> {{ item.metadata.document_metadata.publication_year }}</p>
                  </div>
                  <div class="col">
                    <p class="font-bold">{{ $t('layout') }}:</p>
                    <p>{{ item.metadata.document_metadata.layout }}</p>
                    <p class="mt-2 font-bold">{{ $t('publication_century') }}:</p>
                    <p> {{ item.metadata.document_metadata.publication_century }}</p>
                  </div>
                </div>

              </AccordionTab>
            </Accordion>
            <Accordion class="text-sm flex-1">
              <AccordionTab :header="item.metadata.ocr_workflow.label">
                <div class="flex gap-2">
                  <div v-for="step in item.metadata.workflow_steps" :key="step"><Chip :label="step" class="text-sm" /></div>
                </div>
              </AccordionTab>
            </Accordion>
          </div>
          <div class="col-5 py-0 ml-auto">
            <div class="grid mb-1">
              <div class="col py-0 text-center" v-for="(evalKey, i) in evals" :key="i">
                <span class="font-bold">{{defs[evalKey] ? defs[evalKey].label : evalKey}}</span>
              </div>
            </div>
            <div class="grid">
              <div v-for="(evaluation, i) in item.evaluations" :key="i" class="col text-center">
              <span
                  class="border-round-3xl py-1 px-3"
                  :class="getEvalColor(evaluation.name, evaluation.value)">
                {{ evaluation.value }}
              </span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { getEvalColor } from "@/helpers/eval-colors";

const props = defineProps(['data', 'defs']);
const list = ref([]);
const evals = ref([]);


const setListData = (data) => {
  list.value = data.map(({ label, evaluation, metadata }) => ({
    label,
    metadata,
    evaluations: Object.keys(evaluation.document_wide).map(key => ({
      name: key,
      value: evaluation.document_wide[key]
    }))
  }));
};

const setEvals = (data) => {
  evals.value = data && data.length > 0 ? Object.keys(data[0].evaluation.document_wide) : [];
};

 onMounted(() => {
   setEvals(props.data);
   setListData(props.data);
 });


watch(() => props.data, () => {
  setEvals(props.data);
  setListData(props.data);
});

</script>

<style scoped lang="scss">
@import 'primeflex/primeflex.scss';

.p-card {
  :deep(.p-card-content) {
    padding: 0;
  }
  :deep(.p-card-body) {
    @include styleclass('p-0 pt-5')
  }
}
</style>
