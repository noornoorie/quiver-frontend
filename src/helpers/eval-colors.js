const evalColors = {
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
};

const getEvalColor = (name, value) => {
    const colorMap = evalColors[name];
    if (colorMap) {
        const keys = Object.keys(colorMap);
        return keys.find((key, i) => {
            const isLast = i === keys.length - 1;
            return value <= colorMap[key] || isLast && value > colorMap[key];
        });
    }
    return null;
};

export {
    getEvalColor
};