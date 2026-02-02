export interface Category {
    id: string;
    orgId: string;
    keyName: string;
    name: string;
    externalTool?: string;
    createdBy?: string;
    updatedBy?: string;
    createdAt: string;
    updatedAt: string;
    customFieldMetaData?: CustomField[];
}

export type DataType = 'number' | 'text' | 'boolean' | 'json';

export interface CustomField {
    id: string;
    orgId: string;
    categoryId: string;
    name: string;
    keyName: string;
    dataType: DataType;
    enums?: string;
    description?: string;
    meta?: any;
    createdBy?: string;
    updatedBy?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: string;
}
