<template>
  <div class="container">
    <div class="grid mb-4">
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
    <Card v-for="(item, i) in list" :key="i" class="mb-3 shadow-3 border-gray-200 p-4">
      <template #header>
        <div class="grid align-items-center gap-2">
          <h3 class="text-xl font-bold">{{ item.label }}</h3>
          <Tag :value="item.metadata.workflow_model" class="bg-gray-300 text-gray-700 ml-3"></Tag>
          <template v-if="item.metadata.document_metadata">
            <Tag
              v-for="font in item.metadata.document_metadata.fonts"
              :key="font"
              :value="font"
              class="bg-gray-300 text-gray-700">
            </Tag>
          </template>
        </div>
      </template>
      <template #content>
        <div class="grid">
          <div class="col-7 grid">
            <div class="mr-3">
              <template v-if="item.metadata.gt_workspace">
                <Accordion class="text-sm">
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
              </template>
              <template v-else>
                <p class="font-bold text-gray-400 mt-3">{{$t('no_gt_workspace')}}</p>
              </template>
            </div>
            <div class="flex-1">
              <Accordion class="text-sm">
                <AccordionTab :header="item.metadata.ocr_workflow?.label || $t('unknown_workflow')">
                  <div class="flex gap-2" v-if="item.metadata.workflow_steps">
                    <div v-for="step in item.metadata.workflow_steps" :key="step">
                      <Chip :label="step" class="text-sm" />
                    </div>
                  </div>
                  <template v-else>
                    <span class="font-bold text-gray-400">{{$t('no_ocr_workflow')}}</span>
                  </template>
                </AccordionTab>
              </Accordion>
            </div>
          </div>
          <div class="col-5 py-0 ml-auto">
            <div class="grid mb-1">
              <div class="col py-0 text-center" v-for="(evalKey, i) in evals" :key="i">
                <span class="font-bold">{{defs[evalKey] ? defs[evalKey].label : evalKey}}</span>
              </div>
            </div>
            <div class="grid">
              <div v-for="({ name, value }, i) in item.evaluations" :key="i" class="col text-center">
              <span
                  class="border-round-3xl py-1 px-3 cursor-pointer"
                  :class="getEvalColor(name, value)" :title="value">
                <template v-if=" name === 'cer'">{{ shortenCER(value) }}</template>
                <template v-else-if="name === 'cer_min_max'">{{ shortenCER(value[0]) + '/' + shortenCER(value[1])}}</template>
                <template v-else>{{ value }}</template>
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
import { useI18n } from "vue-i18n";

const props = defineProps(['data', 'defs']);
const list = ref([]);
const evals = ref([]);
const { t } = useI18n();

const sortOptions = ref([
  {
    value: 'none',
    label: t('-')
  },
  {
    value: 'wall_time_asc',
    label: t('wall_time_asc')
  },
  {
    value: 'wall_time_desc',
    label: t('wall_time_desc')
  },
  {
    value: 'cer_asc',
    label: t('cer_asc')
  },
  {
    value: 'cer_desc',
    label: t('cer_desc')
  },
  {
    value: 'cer_min_asc',
    label: t('cer_min_asc')
  },
  {
    value: 'cer_min_desc',
    label: t('cer_min_desc')
  },
  {
    value: 'cer_max_asc',
    label: t('cer_max_asc')
  },
  {
    value: 'cer_max_desc',
    label: t('cer_max_desc')
  }
]);

const sortBy = ref(sortOptions.value[0]);

const onChange = ({ value }) => {
  if (value === 'wall_time_asc') sortByWallTime('asc');
  else if (value === 'wall_time_desc') sortByWallTime('desc');
  else if (value === 'cer_asc') sortByCER('asc');
  else if (value === 'cer_desc') sortByCER('desc');
  else if (value === 'cer_min_asc') sortByCERMin('asc');
  else if (value === 'cer_min_desc') sortByCERMin('desc');
  else if (value === 'cer_max_asc') sortByCERMax('asc');
  else if (value === 'cer_max_desc') sortByCERMax('desc');
};

const sortByWallTime = (order = 'asc') => {
  list.value.sort((a, b) => {
    const wallTimeA = a.evaluations.find(e => e.name === 'wall_time')?.value || 0;
    const wallTimeB = b.evaluations.find(e => e.name === 'wall_time')?.value || 0;

    if (order === 'asc') return wallTimeA > wallTimeB ? 1 : -1;
    if (order === 'desc') return wallTimeA < wallTimeB ? 1 : -1;
    return 0;
  });
};

const sortByCER = (order = 'asc') => {
  list.value.sort((a, b) => {
    const cerA = a.evaluations.find(e => e.name === 'cer')?.value || 0;
    const cerB = b.evaluations.find(e => e.name === 'cer')?.value || 0;

    if (order === 'asc') return cerA > cerB ? 1 : -1;
    if (order === 'desc') return cerA < cerB ? 1 : -1;
    return 0;
  });
};

const sortByCERMin = (order = 'asc') => {
  list.value.sort((a, b) => {
    const cerMinA = a.evaluations.find(e => e.name === 'cer_min_max')?.value[0] || 0;
    const cerMinB = b.evaluations.find(e => e.name === 'cer_min_max')?.value[0] || 0;

    if (order === 'asc') return cerMinA > cerMinB ? 1 : -1;
    if (order === 'desc') return cerMinA < cerMinB ? 1 : -1;
    return 0;
  });
};

const sortByCERMax = (order = 'asc') => {
  list.value.sort((a, b) => {
    const cerMaxA = a.evaluations.find(e => e.name === 'cer_min_max')?.value[1] || 0;
    const cerMaxB = b.evaluations.find(e => e.name === 'cer_min_max')?.value[1] || 0;

    if (order === 'asc') return cerMaxA > cerMaxB ? 1 : -1;
    if (order === 'desc') return cerMaxA < cerMaxB ? 1 : -1;
    return 0;
  });
};

const mapMetadata = ({
  workflow_model = t('no_workflow_model'),
  document_metadata = {
    fonts: []
  },
  gt_workspace = null,
  ocr_workflow = null,
  workflow_steps = null
}) => {

  return {
    workflow_model,
    document_metadata,
    gt_workspace,
    ocr_workflow,
    workflow_steps
  };
};

const mapEvaluationResults = ({ document_wide = [] }) => {
  return Object.keys(document_wide).map(key => ({
    name: key,
    value: document_wide[key]
  }));
};

const setListData = (data) => {
  list.value = data.map(({ label, evaluation_results = [], metadata }) => ({
    label,
    metadata: mapMetadata(metadata),
    evaluations: mapEvaluationResults(evaluation_results)
  }));
};

const setEvals = (data) => {
  evals.value =
      data &&
      data.length > 0 &&
      data[0].evaluation_results
          ? Object.keys(data[0].evaluation_results.document_wide) || []
          : [];
};

const shortenCER = (value) => {
  return Math.round(value * 1000) / 1000;
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
