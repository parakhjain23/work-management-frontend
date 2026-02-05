export interface SystemPrompt {
    id: string;
    name: string;
    eventType?: string;
    conditionLabel?: string;
    promptTemplate: string;
    orgId: string;
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateSystemPromptRequest {
    name: string;
    conditionLabel: string;
    promptTemplate: string;
    eventType?: string;
}

export interface UpdateSystemPromptRequest {
    name?: string;
    conditionLabel?: string;
    promptTemplate?: string;
    eventType?: string;
}
