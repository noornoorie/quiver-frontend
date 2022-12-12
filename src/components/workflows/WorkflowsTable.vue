<template>
  <div class="container">
    <div class="grid mb-4" v-if="evals.length > 0">
      <div class="flex align-items-center ml-auto">
        <p class="mr-2">{{ $t('group_by')}}:</p>
        <Dropdown
            v-model="sortBy"
            :options="sortOptions"
            option-label="label"
            @change="onChange($event.value)"
        />
      </div>
    </div>
    <table v-if="evals.length > 0" class="w-full" style="border-spacing: 0">
      <tr>
        <th class="border-gray-400"></th>
        <th class="border-gray-400"></th>
        <th class="border-left-1 border-gray-400 pb-2" v-for="(evalKey, i) in evals" :key="i">
<!--          v-tooltip.top="defs[evalKey] ? defs[evalKey].short_descr : $t('no_description')"-->
          <span
              class="def-label font-bold flex align-items-center justify-content-center gap-2 cursor-pointer"
          >
            {{defs[evalKey] ? defs[evalKey].label : evalKey}}
            <i class="pi pi-question-circle"></i>
            <div class="def-tooltip">
              <p>
                {{ defs[evalKey] ? defs[evalKey].short_descr : $t('no_description') }}.
                <a v-if="defs[evalKey]" :href="defs[evalKey].url">{{ $t('details')}}</a>
              </p>
            </div>
          </span>
        </th>
      </tr>
      <template v-for="(key, i) in Object.keys(groupedData)" :key="i">
        <tr v-for="(subject, j) in groupedData[key].subjects" :key="j">
          <td v-if="j === 0" :rowspan="groupedData[key].subjects.length" class="vertical-align-top pt-2">
            <span class="font-bold">{{ groupedData[key].label }}</span>
          </td>
          <td class="vertical-align-top pt-2">{{ subject.label }}</td>
          <td
            v-for="({ name, value }, k) in subject.evaluations"
            :key="k"
            class="text-center border-left-1 border-gray-400 pt-2"
            :class="(j === groupedData[key].subjects.length - 1) ? 'pb-5' : ''"
          >
            <span
              class="border-round-3xl py-1 px-3" :class="getEvalColor(name, value)">
                <template v-if=" name === 'cer'">{{ shortenCER(value) }}</template>
                <template v-else-if="name === 'cer_min_max'">{{ shortenCER(value[0]) + '/' + shortenCER(value[1])}}</template>
                <template v-else>{{ value }}</template>
            </span>
          </td>
        </tr>
      </template>
    </table>
    <div>{{ $t('no_table_data') }}</div>
  </div>
</template>

<script setup>
import { watch, ref } from "vue";
import { useI18n } from "vue-i18n";
import { getEvalColor } from "@/helpers/eval-colors";
import { shortenCER } from "@/helpers/shorten-cer";

const { t } = useI18n();
const props = defineProps(['data', 'defs']);
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
  groupedData.value = props.data.filter(item => !!(item.metadata.ocr_workflow)).reduce((acc, cur) => {
    const ocrWorkflowId = cur.metadata.ocr_workflow['@id'];
    const label = cur.metadata.ocr_workflow.label;

    evals.value = Object.keys(cur.evaluation_results.document_wide);

    const subject = {
      label: cur.metadata.gt_workspace.label,
      evaluations: Object.keys(cur.evaluation_results.document_wide).map(key => ({
        name: key,
        value: cur.evaluation_results.document_wide[key]
      }))
    };
    if (!acc[ocrWorkflowId]) {
      acc[ocrWorkflowId] = {
        label,
        subjects: [subject]
      };
    } else {
      acc[ocrWorkflowId].subjects.push(subject);
      acc[ocrWorkflowId].subjects.sort((a, b) => {
        if (a.label > b.label) return 1;
        else return -1;
      });
    }
    return acc;
  }, {});
};

const groupByDocuments = () => {
  groupedData.value = props.data.filter(item => !!(item.metadata.gt_workspace)).reduce((acc, cur) => {
    const gtWorkspaceId = cur.metadata.gt_workspace['@id'];
    const label = cur.metadata.gt_workspace.label;
    evals.value = Object.keys(cur.evaluation_results.document_wide);
    const subject = {
      label: cur.metadata.ocr_workflow.label,
      evaluations: Object.keys(cur.evaluation_results.document_wide).map(key => ({
        name: key,
        value: cur.evaluation_results.document_wide[key]
      }))
    };
    if (!acc[gtWorkspaceId]) {
      acc[gtWorkspaceId] = {
        label,
        subjects: [subject]
      };
    } else {
      acc[gtWorkspaceId].subjects.push(subject);
      acc[gtWorkspaceId].subjects.sort((a, b) => {
        if (a.label > b.label) return 1;
        else return -1;
      });
    }
    return acc;
  }, {});
};

watch(() => props.data, groupByDocuments, { immediate: true });
</script>

<style scoped lang="scss">
@import 'primeflex/primeflex.scss';

.def-label {
  position: relative;
  &:hover {
    .def-tooltip {
      visibility: visible;
    }
  }
}
.def-tooltip {
  visibility: hidden;
  position: absolute;
  top: 0;
  padding: 10px 14px;
  transform: translateY(-100%);
  width: 300px;
  z-index: 100;
  background: #fff;
  @include styleclass('border-gray-300 border-1 border-round shadow-2');
}
</style>
