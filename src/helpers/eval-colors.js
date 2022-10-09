import { ref } from 'vue';

const evalColors = ref({
    wall_time: {
        'eval-low': 2000,
        'eval-medium': 4000,
        'eval-high': 6000
    },
    cer: {
        'eval-low': 0.6,
        'eval-medium': 0.8,
        'eval-high': 0.9
    },
    cer_min_max: {
        'eval-low': 0.6,
        'eval-medium': 0.8,
        'eval-high': 0.9
    }
});

const getEvalColor = (name, value) => {
    const colorMap = evalColors.value[name];
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
    const allCERs = [];
    const allWallTimes = [];

    data.forEach(({ evaluation }) => {
        const { document_wide: evals } = evaluation;
        const { cer, wall_time, cer_min_max } = evals;

        if (cer) allCERs.push(cer);
        if (wall_time) allWallTimes.push(wall_time);
    });

    const minCER = Math.min(...allCERs);
    const maxCER = Math.max(...allCERs);

    const minWallTime = Math.min(...allWallTimes);
    const maxWallTime = Math.max(...allWallTimes);

    const diffCER = maxCER - minCER;
    const stepCER = diffCER / 3;

    evalColors.value.cer["eval-low"] = minCER + stepCER;
    evalColors.value.cer["eval-medium"] = minCER + 2 * stepCER;
    evalColors.value.cer["eval-high"] = minCER + 3 * stepCER;

    const diffallTime = maxWallTime - minWallTime;
    const stepWallTime = diffallTime / 3;

    evalColors.value.wall_time["eval-low"] = minWallTime + stepWallTime;
    evalColors.value.wall_time["eval-medium"] = minWallTime + 2 * stepWallTime;
    evalColors.value.wall_time["eval-high"] = minWallTime + 3 * stepWallTime;
};

export {
    getEvalColor,
    setEvalColors
};
