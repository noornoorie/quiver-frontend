const baseUrl = 'https://raw.githubusercontent.com/mweidling/quiver-back-end/add-missing-metrics/data';

async function getProjects() {
    return await request(baseUrl + '/repos.json');
}

async function getWorkflows() {
    return await request(baseUrl + '/workflows.json');
    // return Promise.resolve(workflowsJson);
}
async function getEvalDefinitions() {
    return await request(baseUrl + '/metrics_definitions.json');
}


async function request (url) {
    const response = await fetch(url);
    return await response.json();
}

export default {
    getProjects,
    getWorkflows,
    getEvalDefinitions
};
