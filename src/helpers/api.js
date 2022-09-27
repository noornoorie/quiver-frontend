const baseUrl = 'https://raw.githubusercontent.com/OCR-D/quiver-back-end/main/data';
const workflowsJson = [
    {
        "@id": "https://github.com/OCR-D/quiver/tree/data/evaluations/wf1-data345-eval1.json",
        "label": "OCR workflow 1 on workspace 345",
        "metadata": {
            "ocr_workflow": {
                "@id": "https://github.com/OCR-D/quiver/tree/data/workflows/1.nf",
                "label": "OCR Workflow 1"
            },
            "eval_workflow": {
                "@id": "https://github.com/OCR-D/quiver/tree/data/workflows/eval1.nf",
                "label": "Evaluation Workflow 1"
            },
            "gt_workspace": {
                "@id": "https://gt.ocr-d.de/workspace/789",
                "label": "GT workspace 789 (19th century fraktur)"
            },
            "ocr_workspace": {
                "@id": "https://github.com/OCR-D/quiver/tree/data/workspaces/3000.ocrd.zip",
                "label": "OCR result workspace 3000"
            },
            "eval_workspace": {
                "@id": "https://github.com/OCR-D/quiver/tree/data/workspaces/345.ocrd.zip",
                "label": "Evaluation Workspace 345"
            },
            "workflow_steps": {
                "0": "Processor A",
                "1": "Processor B"
            },
            "workflow_model": "Fraktur_GT4HistOCR",
            "document_metadata": {
                "fonts": [
                    "antiqua",
                    "fraktur"
                ],
                "publication_century": "1800-1900",
                "publication_decade": "1850-1860",
                "publication_year": 1855,
                "number_of_pages": 100,
                "layout": "simple"
            }
        },
        "evaluation": {
            "document_wide": {
                "wall_time": 1234,
                "cer": 0.57,
                "cer_min_max": [
                    0.2,
                    0.57
                ]
            },
            "by_page": [
                {
                    "page_id": "PHYS_0001",
                    "cer": 0.8,
                    "processing_time": 2.1
                }
            ]
        }
    },
    {
        "@id": "https://github.com/OCR-D/quiver/tree/data/evaluations/wf2-data345-eval1.json",
        "label": "OCR Workflow 2 on Data 345",
        "metadata": {
            "ocr_workflow": {
                "@id": "https://github.com/OCR-D/quiver/tree/data/workflows/2.nf",
                "label": "OCR Workflow 2"
            },
            "eval_workflow": {
                "@id": "https://github.com/OCR-D/quiver/tree/data/workflows/eval1.nf",
                "label": "Evaluation Workflow 1"
            },
            "gt_workspace": {
                "@id": "https://gt.ocr-d.de/workspace/789",
                "label": "GT workspace 789 (19th century fraktur)"
            },
            "ocr_workspace": {
                "@id": "https://github.com/OCR-D/quiver/tree/data/workspaces/3000.ocrd.zip",
                "label": "OCR result workspace 3000"
            },
            "eval_workspace": {
                "@id": "https://github.com/OCR-D/quiver/tree/data/workspaces/345.ocrd.zip",
                "label": "Evaluation Workspace 345"
            },
            "workflow_steps": {
                "0": "Processor A",
                "1": "Processor B"
            },
            "workflow_model": "Fraktur_GT4HistOCR",
            "document_metadata": {
                "fonts": [
                    "antiqua",
                    "fraktur"
                ],
                "publication_century": "1800-1900",
                "publication_decade": "1850-1860",
                "publication_year": 1855,
                "number_of_pages": 100,
                "layout": "simple"
            }
        },
        "evaluation": {
            "document_wide": {
                "wall_time": 4567,
                "cer": 0.9,
                "cer_min_max": [
                    0.2,
                    0.99
                ]
            },
            "by_page": [
                {
                    "page_id": "PHYS_0001",
                    "cer": 0.9,
                    "processing_time": 2.1
                }
            ]
        }
    },
    {
        "@id": "https://github.com/OCR-D/quiver/tree/data/evaluations/wf2-data345-eval1.json",
        "label": "OCR Workflow 3 on Data 345",
        "metadata": {
            "ocr_workflow": {
                "@id": "https://github.com/OCR-D/quiver/tree/data/workflows/2.nf",
                "label": "OCR Workflow 3"
            },
            "eval_workflow": {
                "@id": "https://github.com/OCR-D/quiver/tree/data/workflows/eval1.nf",
                "label": "Evaluation Workflow 1"
            },
            "gt_workspace": {
                "@id": "https://gt.ocr-d.de/workspace/123",
                "label": "GT workspace 123 (16th century fraktur)"
            },
            "ocr_workspace": {
                "@id": "https://github.com/OCR-D/quiver/tree/data/workspaces/3000.ocrd.zip",
                "label": "OCR result workspace 3000"
            },
            "eval_workspace": {
                "@id": "https://github.com/OCR-D/quiver/tree/data/workspaces/345.ocrd.zip",
                "label": "Evaluation Workspace 345"
            },
            "workflow_steps": {
                "0": "Processor A",
                "1": "Processor B"
            },
            "workflow_model": "Fraktur_GT4HistOCR",
            "document_metadata": {
                "fonts": [
                    "antiqua",
                    "fraktur"
                ],
                "publication_century": "1800-1900",
                "publication_decade": "1850-1860",
                "publication_year": 1855,
                "number_of_pages": 100,
                "layout": "simple"
            }
        },
        "evaluation": {
            "document_wide": {
                "wall_time": 8765,
                "cer": 0.4,
                "cer_min_max": [
                    0.2,
                    0.4
                ]
            },
            "by_page": [
                {
                    "page_id": "PHYS_0001",
                    "cer": 0.4,
                    "processing_time": 2.1
                }
            ]
        }
    },
];

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