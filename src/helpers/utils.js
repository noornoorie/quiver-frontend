import { ref } from 'vue';

const utils = ref({});

const getEvalColor = (name, value) => {
  const colorMap = utils.value[name];
  if (colorMap) {
    const keys = Object.keys(colorMap);
    return keys.find((key, i) => {
      const isLast = i === keys.length - 1;
      return value <= colorMap[key] || isLast && value > colorMap[key];
    });
  }
  return null;
};

const setEvalColors = (data) => {
  const allValues = [];

  data
    .filter(({ evaluation_results }) => !!(evaluation_results))
    .forEach(({ evaluation_results }) => {
      const { document_wide: evals } = evaluation_results;

      if (!evals) return;

      Object
        .keys(evals)
        .filter(key => !Array.isArray(key))
        .forEach(key => {
          allValues[key] = [...(allValues[key] ?? []), evals[key]];
        });
    });

  Object
    .keys(allValues)
    .forEach(key => {
      const singleMetricValues = allValues[key];
      const min = Math.min(...singleMetricValues);
      const max = Math.max(...singleMetricValues);

      const diff = max - min;
      const step = diff / 3;

      if (!utils.value[key]) {
        utils.value[key] = {};
      }

      utils.value[key]["eval-positive"] = min + step;
      utils.value[key]["eval-medium"] = min + 2 * step;
      utils.value[key]["eval-negative"] = min + 3 * step;
    });
};

const shortenMetricValue = (value) => {
  return Math.round(value * 1000) / 1000;
};

const createReadableMetricValue = (key, value) => {
  if (['cer_mean', 'cer_median', 'wer', 'pages_per_minute', 'cer_standard_deviation', 'wall_time', 'cpu_time'].includes(key)) {
    return shortenMetricValue(value);
  } else if (key === 'cer_range') {
    return shortenMetricValue(value[0]) + ' / ' + shortenMetricValue(value[1]);
  }

  return value;
};

export {
  getEvalColor,
  setEvalColors,
  createReadableMetricValue
};
