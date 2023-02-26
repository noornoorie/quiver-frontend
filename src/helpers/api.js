const baseUrl = 'https://raw.githubusercontent.com/OCR-D/quiver-back-end/main/data';

async function getProjects() {
    return await request(baseUrl + '/repos.json');
}

async function getOcrdAllReleases() {
    return await request(baseUrl + '/ocrd_all_releases.json');
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
    getEvalDefinitions,
    getOcrdAllReleases
};
