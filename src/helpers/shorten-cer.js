const createReadableMetricValue = (key, value) => {
  if (['cer_mean', 'cer_median', 'wer', 'pages_per_minute', 'cer_standard_deviation', 'wall_time'].includes(key)) {
    return shortenMetricValue(value);
  } else if (key === 'cer_range') {
    return shortenMetricValue(value[0]) + ' / ' + shortenMetricValue(value[1]);
  }

  return value;
};

export {
  shortenCER
};
