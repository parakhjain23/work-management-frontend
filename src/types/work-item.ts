export type WorkItemStatus = 'CAPTURED' | 'CLARIFYING' | 'THINKING' | 'DECIDED' | 'IN_PROGRESS' | 'IN_REVIEW' | 'CLOSED' | 'ARCHIVED';
export type WorkItemPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
}

export interface WorkItem {
    id: string;
    title: string;
    description: string;
    status: WorkItemStatus;
    priority: WorkItemPriority;
    assigneeId?: string;
    assignee?: User;
    creatorId: string;
    creator: User;
    createdAt: string;
    updatedAt: string;
    dueDate?: string;
    categoryId?: string;
    customFieldValues?: Record<string, any>;
    customFields?: Record<string, any>;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}
