import type { EvaluationRun, GroundTruth, Workflow } from "@/types"

const baseUrlOld = 'https://raw.githubusercontent.com/OCR-D/quiver-back-end/main/data'
const baseUrl = 'https://quiver-dev.sub.uni-goettingen.de/api'
async function getProjects() {
    return await request(baseUrlOld + '/repos.json')
}

async function getOcrdAllReleases() {
    return await request(baseUrlOld + '/ocrd_all_releases.json')
}

async function getLatestWorkflows() {
    return await request(baseUrlOld + '/workflows.json')
    // return Promise.resolve(workflowsJson);
}
async function getEvalDefinitions() {
    return await request(baseUrlOld + '/metrics_definitions.json')
}

async function getWorkflows(): Promise<Workflow[]> {
    return await request(baseUrl + '/workflows')
}

async function getGroundTruth(): Promise<GroundTruth[]> {
    return await request(baseUrl + '/gt')
}

async function getRuns(gtId: string, workflowId: string): Promise<EvaluationRun[]> {
    return await request(baseUrl + `/runs/${gtId}/${workflowId}`)
}

async function request (url: string) {
    const response = await fetch(url)
    return await response.json()
}

export default {
    getProjects,
    getWorkflows,
    getGroundTruth,
    getLatestWorkflows,
    getEvalDefinitions,
    getOcrdAllReleases,
    getRuns
}
