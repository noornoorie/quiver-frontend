<template>
  <div class="container">
    <div class="grid mb-3">
      <div class="flex align-items-center ml-auto">
        <p class="mr-2">{{ $t('sort_by')}}:</p>
        <Dropdown
            v-model="sortBy"
            :options="sortOptions"
            option-label="label"
            @change="onChange($event.value)"
        />
      </div>
    </div>
    <table class="w-full" style="border-spacing: 0">
      <tr>
        <th class="border-gray-400"></th>
        <th class="border-gray-400"></th>
        <th class="border-left-1 border-gray-400 pb-2" v-for="(evalName, i) in evals" :key="i">
          <span class="font-bold">{{evalName}}</span>
        </th>
      </tr>
      <template v-for="(key, i) in Object.keys(groupedData)" :key="i">
        <tr v-for="(subject, j) in groupedData[key].subjects" :key="j">
          <td v-if="j === 0" :rowspan="groupedData[key].subjects.length" class="vertical-align-top pt-2">
            <span class="font-bold">{{ groupedData[key].label }}</span>
          </td>
          <td class="vertical-align-top pt-2">{{ subject.label }}</td>
          <td
            v-for="(evaluation, k) in subject.evaluations"
            :key="k"
            class="text-center border-left-1 border-gray-400 pt-2"
            :class="(j === groupedData[key].subjects.length - 1) ? 'pb-5' : ''"
          >
            <span
                class="border-round-3xl py-1 px-3"
                :class="getEvalColor(evaluation.name, evaluation.value)">
              {{ evaluation.value }}
            </span>
          </td>
        </tr>
      </template>
    </table>
  </div>
</template>

<script setup>
import { watch, ref } from "vue";
import { useI18n } from "vue-i18n";
import { getEvalColor } from "@/helpers/eval-colors";

const { t } = useI18n();
const props = defineProps(['data']);
const groupedData = ref({});
const evals = ref([]);
const sortOptions = ref([{
  value: 'documents',
  label: t('documents')
}, {
  value: 'workflows',
  label: t('workflows')
}]);
const sortBy = ref(sortOptions.value[0]);

const onChange = ({ value }) => {
  if (value === 'workflows') groupByWorkflows();
  else if (value === 'documents') groupByDocuments();
};

const groupByWorkflows = () => {
  groupedData.value = props.data.reduce((acc, cur) => {
    const ocrWorkflowId = cur.metadata.ocr_workflow['@id'];
    const label = cur.metadata.ocr_workflow.label;

    evals.value = Object.keys(cur.evaluation.document_wide);

    const subject = {
      label: cur.metadata.gt_workspace.label,
      evaluations: Object.keys(cur.evaluation.document_wide).map(key => ({
        name: key,
        value: cur.evaluation.document_wide[key]
      }))
    };
    if (!acc[ocrWorkflowId]) {
      acc[ocrWorkflowId] = {
        label,
        subjects: [subject]
      };
    } else {
      acc[ocrWorkflowId].subjects.push(subject);
    }
    return acc;
  }, {});
};

const groupByDocuments = () => {
  groupedData.value = props.data.reduce((acc, cur) => {
    const gtWorkspaceId = cur.metadata.gt_workspace['@id'];
    const label = cur.metadata.gt_workspace.label;
    evals.value = Object.keys(cur.evaluation.document_wide);
    const subject = {
      label: cur.metadata.ocr_workflow.label,
      evaluations: Object.keys(cur.evaluation.document_wide).map(key => ({
        name: key,
        value: cur.evaluation.document_wide[key]
      }))
    };
    if (!acc[gtWorkspaceId]) {
      acc[gtWorkspaceId] = {
        label,
        subjects: [subject]
      };
    } else {
      acc[gtWorkspaceId].subjects.push(subject);
    }
    return acc;
  }, {});
};

watch(() => props.data, groupByDocuments, { immediate: true });
</script>

<style scoped>

</style>
