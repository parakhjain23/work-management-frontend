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

export interface Category {
    id: number;
    name: string;
    keyName: string;
}

export interface SearchedWorkItem {
    id: number;
    orgId: number;
    externalId: string | null;
    categoryId: number;
    title: string;
    description: string;
    status: WorkItemStatus;
    priority: WorkItemPriority;
    assigneeId: number;
    createdBy: number;
    updatedBy: number;
    startDate: string | null;
    dueDate: string | null;
    parentId: number | null;
    rootParentId: number | null;
    docId: string;
    createdAt: string;
    updatedAt: string;
    category: Category;
}



export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}
