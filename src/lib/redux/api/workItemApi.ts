import { createApi } from '@reduxjs/toolkit/query/react';
import { customFetchBaseQuery } from './interceptor';
import { WorkItem, ApiResponse } from '@/types/work-item';

export const workItemApi = createApi({
    reducerPath: 'workItemApi',
    baseQuery: customFetchBaseQuery(`${process.env.NEXT_PUBLIC_API_URL}/`),
    tagTypes: ['WorkItem'],
    endpoints: (builder) => ({
        getWorkItems: builder.query<WorkItem[], void>({
            query: () => '/work-items',
            transformResponse: (response: ApiResponse<WorkItem[]>) => response.data,
            providesTags: ['WorkItem'],
        }),
        getWorkItemsByCategory: builder.query<WorkItem[], string>({
            query: (categoryId) => `/categories/${categoryId}/work-items`,
            transformResponse: (response: ApiResponse<WorkItem[]>) => response.data,
            providesTags: (result, _error, categoryId) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'WorkItem' as const, id })), { type: 'WorkItem', id: `CATEGORY_${categoryId}` }]
                    : [{ type: 'WorkItem', id: `CATEGORY_${categoryId}` }],
        }),
        getWorkItem: builder.query<WorkItem, string>({
            query: (id) => `/work-items/${id}`,
            transformResponse: (response: ApiResponse<WorkItem>) => response.data,
            providesTags: (_result, _error, id) => [{ type: 'WorkItem', id }],
        }),
        createWorkItem: builder.mutation<WorkItem, Partial<WorkItem>>({
            query: (body) => ({
                url: '/work-items',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['WorkItem'],
        }),
        updateWorkItem: builder.mutation<WorkItem, { id: string; body: Partial<WorkItem> }>({
            query: ({ id, body }) => ({
                url: `/work-items/${id}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => ['WorkItem', { type: 'WorkItem', id }],
        }),
        deleteWorkItem: builder.mutation<void, string>({
            query: (id) => ({
                url: `/work-items/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['WorkItem'],
        }),
    }),
});

export const {
    useGetWorkItemsQuery,
    useGetWorkItemsByCategoryQuery,
    useGetWorkItemQuery,
    useCreateWorkItemMutation,
    useUpdateWorkItemMutation,
    useDeleteWorkItemMutation,
} = workItemApi;

