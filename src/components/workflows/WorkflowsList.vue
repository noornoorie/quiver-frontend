<template>
  <div>
    <div class="_display:flex _margin-bottom:4">
      <div class="_display:flex _align-items:center _margin-left:auto">
        <p class="_margin-right:2">{{ $t('sort_by') }}:</p>
        <i-select
            v-model="sortBy"
            :options="sortOptions"
            label="label"
            idField="value"
            placeholder="Choose something.."
            @update:modelValue="onChange($event.value)"
        />
      </div>
    </div>
    <i-card v-for="(item, i) in list" :key="i" class="_margin-bottom:5 shadow-3 border-gray-200">
      <template #header>
        <div class="_display:flex _align-items:center">
          <h3 class="_font-size:lg _font-weight:bold">{{ item.label }}</h3>
          <i-badge class="bg-gray-300 text-gray-700 _margin-left:2">Model: {{ item.metadata.workflow_model }}</i-badge>
          <template v-if="item.metadata.document_metadata">
            <i-badge
                v-for="font in item.metadata.document_metadata.data_properties.fonts"
                :key="font"
                class="_margin-left:1 bg-gray-300 text-gray-700">
              {{ font }}
            </i-badge>
          </template>
        </div>
      </template>
      <template #default>
        <i-row>
          <i-column xs="5">
            <i-row>
              <i-column xs="3" class="_font-weight:semibold">{{ $t('document') }}:</i-column>
              <i-column xs="9" v-if="item.metadata.gt_workspace">
                <i-collapsible size="md" class="_font-size:sm _flex-grow:1">
                  <i-collapsible-item :title="item.metadata.gt_workspace.label">
                    <i-row v-if="item.metadata.document_metadata.data_properties">
                      <i-column>
                        <p class="_font-weight:bold">{{ $t('number_of_pages') }}:</p>
                        <p>{{ item.metadata.document_metadata.data_properties.number_of_pages }}</p>
                        <p class="mt-2 _font-weight:bold">{{ $t('publication_year') }}:</p>
                        <p> {{ item.metadata.document_metadata.data_properties.publication_year }}</p>
                      </i-column>
                      <i-column>
                        <p class="_font-weight:bold">{{ $t('layout') }}:</p>
                        <p>{{ item.metadata.document_metadata.data_properties.layout }}</p>
                      </i-column>
                    </i-row>
                    <i-row v-else>
                      <i-column>{{ $t('no_document_metadata') }}</i-column>
                    </i-row>
                  </i-collapsible-item>
                </i-collapsible>
              </i-column>
              <template v-else>
                <p class="_font-weight:bold text-gray-400 mt-3">{{ $t('no_gt_workspace') }}</p>
              </template>
            </i-row>

            <i-row class="_display:flex _margin-top:1">
              <i-column xs="3" class="_font-weight:semibold">{{ $t('workflow') }}:</i-column>
              <i-column xs="9">
                <i-collapsible size="md" class="_font-size:sm _flex-grow:1">
                  <i-collapsible-item :title="item.metadata.ocr_workflow?.label || $t('unknown_workflow')">
                    <div class="_display:flex _flex-direction:column" v-if="item.metadata.workflow_steps">
                      <div class="_margin-bottom:2" v-for="({id, url, params }, i) in item.metadata.workflow_steps" :key="id">
                        <div class="_display:flex _align-items:center">
                          <span class="_margin-right:1">{{ i + 1 }}. </span>
                          <a v-if="url" :href="url" target="_blank" :title="$t('external_repo_url')"
                             class="_display:flex _align-items:center _flex-shrink:0">
                            <span class="_font-weight:semibold _font-size:md">{{ id }}</span>
                            <i class="repo-icon _margin-left:1/3" v-html="getIcon('external-link')"></i>
                          </a></div>
                        <div class="_display:flex _flex-wrap:wrap _align-items:flex-start _margin-top:1">
                          <div
                            v-for="{ name, value } in params"
                            :key="name"
                            class="_margin-bottom:1 _margin-right:1 _display:flex _align-items:flex-start"
                            style="line-height:1.2"
                          >
                            <span class="_border-top-left-radius _border-bottom-left-radius _background:gray-20 _color:gray-70 _font-weight:semibold _padding-x:1 _padding-y:1/2">{{name }}</span>
                            <span class="_border-top-right-radius _border-bottom-right-radius _background:gray-10 _color:gray-70 _padding-x:1 _padding-y:1/2">{{value }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <template v-else>
                      <span class="_font-weight:bold">{{ $t('no_ocr_workflow') }}</span>
                    </template>
                  </i-collapsible-item>
                </i-collapsible>
              </i-column>
            </i-row>
          </i-column>
          <i-column xs="7" class="_margin-left:auto">
            <i-row>
              <i-column v-for="({ name, value }, i) in item.evaluations" :key="i"
                        class="_display:flex _flex-direction:column _align-items:center _padding-x:1/2">
                <span
                    class="_font-weight:bold _font-size:xs _margin-bottom:1">{{
                    defs[name] ? defs[name].label : name
                  }}</span>
                <i-badge
                    size="lg"
                    class="metric _cursor:pointer _padding-x:1"
                    :class="getEvalColor(name, value)" :title="value">
                  {{ createReadableMetricValue(name, value) }}
                </i-badge>
              </i-column>
            </i-row>
          </i-column>
        </i-row>
      </template>
    </i-card>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { getIcon } from "@/helpers/icon";
import { store } from "@/helpers/store";
import { createReadableMetricValue, getEvalColor } from "@/helpers/utils";


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

const onChange = (value) => {
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
  document_metadata = { fonts: [] },
  gt_workspace = null,
  ocr_workflow = null,
  workflow_steps = {}
}) => {
  workflow_steps = workflow_steps
      .map(step => {
        const id = Object.keys(step)[0];
        const params = Object.keys(step[id]).map(paramKey => ({ name: paramKey, value: step[id][paramKey] }));

        return { id, url: getRepoUrl(id), params };
      });
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
  list.value = data.map(({ label, evaluation_results = {}, metadata }) => ({
    label,
    metadata: mapMetadata(metadata),
    evaluations: mapEvaluationResults(evaluation_results)
  }));
};

const getRepoUrl = (needleId) => {
  const repo = store.repos.find(({ ocrd_tool }) => {
    return ocrd_tool && ocrd_tool.tools[needleId];
  });
  if (!repo) return null;
  return repo.url;
};

const setEvals = (data) => {
  evals.value =
      data &&
      data.length > 0 &&
      data[0].evaluation_results
          ? Object.keys(data[0].evaluation_results.document_wide) || []
          : [];
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

.metric {
  --border-radius: 8px;
}

.card {
  ----header--padding-left: 1rem;
  ----header--padding-right: 1rem;
  ----body--padding-top: 1rem;
  ----body--padding-bottom: 1rem;
  ----body--padding-left: 1rem;
  ----body--padding-right: 1rem;
}

.arrow-icon, .repo-icon {
  position: relative;
  width: 16px;
  height: 16px;

  :deep(svg) {
    width: 100%;
    height: 100%;
  }
}
</style>
