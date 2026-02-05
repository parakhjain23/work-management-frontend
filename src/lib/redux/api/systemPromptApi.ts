import { createApi } from '@reduxjs/toolkit/query/react';
import { customFetchBaseQuery } from './interceptor';
import { ApiResponse } from '@/types/work-item';
import { SystemPrompt, CreateSystemPromptRequest, UpdateSystemPromptRequest } from '@/types/system-prompt';

export const systemPromptApi = createApi({
    reducerPath: 'systemPromptApi',
    baseQuery: customFetchBaseQuery(`${process.env.NEXT_PUBLIC_API_URL}/`),
    tagTypes: ['SystemPrompt'],
    endpoints: (builder) => ({
        getSystemPrompts: builder.query<SystemPrompt[], void>({
            query: () => '/system-prompts',
            transformResponse: (response: ApiResponse<SystemPrompt[]>) => response.data,
            providesTags: ['SystemPrompt'],
        }),
        getSystemPrompt: builder.query<SystemPrompt, string>({
            query: (id) => `/system-prompts/${id}`,
            transformResponse: (response: ApiResponse<SystemPrompt>) => response.data,
            providesTags: (_result, _error, id) => [{ type: 'SystemPrompt', id }],
        }),
        createSystemPrompt: builder.mutation<SystemPrompt, CreateSystemPromptRequest>({
            query: (body) => ({
                url: '/system-prompts',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['SystemPrompt'],
        }),
        updateSystemPrompt: builder.mutation<SystemPrompt, { id: string; body: UpdateSystemPromptRequest }>({
            query: ({ id, body }) => ({
                url: `/system-prompts/${id}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => ['SystemPrompt', { type: 'SystemPrompt', id }],
        }),
        deleteSystemPrompt: builder.mutation<void, string>({
            query: (id) => ({
                url: `/system-prompts/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['SystemPrompt'],
        }),
    }),
});

export const {
    useGetSystemPromptsQuery,
    useGetSystemPromptQuery,
    useCreateSystemPromptMutation,
    useUpdateSystemPromptMutation,
    useDeleteSystemPromptMutation,
} = systemPromptApi;
