<template>
  <div>
    <div class="_display:flex _margin-bottom:4" v-if="evals.length > 0">
      <div class="_display:flex _align-items:center _margin-left:auto">
        <p class="_margin-right:2">{{ $t('group_by')}}:</p>
        <i-select
            v-model="sortBy"
            :options="sortOptions"
            modelValue="value"
            idField="label"
            placeholder="Choose something.."
            @update:modelValue="onChange($event.value)"
        />
      </div>
    </div>
    <i-table v-if="evals.length > 0" class="_width:100%" condensed border="true">
      <thead>
        <tr>
        <th class="_padding-left:2">{{ sortBy.value === 'documents' ? $t('documents') : $t('workflows') }}</th>
        <th class="_padding-left:2">{{ sortBy.value === 'documents' ? $t('workflows') : $t('documents') }}</th>
        <th v-for="(evalKey, i) in evals" :key="i">
          <span class="def-label _display:flex _align-items:center _justify-content:center _cursor:pointer">
            {{defs[evalKey] ? defs[evalKey].label : evalKey}}
            <i-icon name="ink-info" />
            <div class="def-tooltip">
              <i-card>
                {{ defs[evalKey] ? defs[evalKey].short_descr : $t('no_description') }}.
                <a v-if="defs[evalKey]" :href="defs[evalKey].url">{{ $t('details')}}</a>
              </i-card>
            </div>
          </span>
        </th>
      </tr>
      </thead>
      <tbody>
        <template v-for="(key, i) in Object.keys(groupedData)" :key="i">
          <tr v-for="(subject, j) in groupedData[key].subjects" :key="j">
            <td v-if="j === 0" :rowspan="groupedData[key].subjects.length" class="_vertical-align:top _padding-left:2">
              <span class="_font-weight:bold">{{ groupedData[key].label }}</span>
            </td>
            <td class="_vertical-align:top _padding-left:2">{{ subject.label }}</td>
            <td
                v-for="({ name, value }, k) in subject.evaluations"
                :key="k"
                class="_text-align:center"
                :class="(j === groupedData[key].subjects.length - 1) ? '_padding-bottom:5' : ''"
            >
              <i-badge
                  size="lg"
                  class="metric _cursor:pointer _padding-x:1"
                  :class="getEvalColor(name, value)">
                  <template v-if=" name === 'cer'">{{ shortenCER(value) }}</template>
                  <template v-else-if="name === 'cer_min_max'">{{ shortenCER(value[0]) + '/' + shortenCER(value[1])}}</template>
                  <template v-else>{{ value }}</template>
              </i-badge>
            </td>
          </tr>
        </template>
      </tbody>
    </i-table>
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

const onChange = (value) => {
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
  transform: translateY(-100%);
  width: 300px;
  z-index: 100;
  padding-bottom: 10px;

  .card {
    box-shadow: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;
  }
}

th, th span {
  font-weight:bold;
}
</style>
