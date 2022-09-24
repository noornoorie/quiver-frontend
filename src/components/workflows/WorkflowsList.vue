<template>
  <div>
    <Card v-for="(item, i) in list" :key="i" class="mb-3 shadow-3 border-gray-200">
      <template #header>
        <h3 class="text-xl font-bold p-3">{{ item.label }}</h3>
      </template>
      <template #content>
        <div class="grid">
          <div class="col-5 py-0 ml-auto">
            <div class="grid">
              <div class="col py-0" v-for="(evalName, i) in evals" :key="i">
                <span class="font-bold">{{evalName}}</span>
              </div>
            </div>
            <div class="grid">
              <div v-for="(evaluation, i) in item.evaluations" :key="i" class="col">
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

const props = defineProps(['data']);
const list = ref([]);
const evals = ref([]);


const setListData = (data) => {
  list.value = data.map(({ label, evaluation }) => ({
    label,
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
    @include styleclass('p-3');
  }
}
</style>
