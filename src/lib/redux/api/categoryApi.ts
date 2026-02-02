import { createApi } from '@reduxjs/toolkit/query/react';
import { customFetchBaseQuery } from './interceptor';
import { Category, CustomField, ApiResponse } from '@/types/category';

export const categoryApi = createApi({
    reducerPath: 'categoryApi',
    baseQuery: customFetchBaseQuery(`${process.env.NEXT_PUBLIC_API_URL}/`),
    tagTypes: ['Category', 'CustomField'],
    endpoints: (builder) => ({
        getCategories: builder.query<Category[], void>({
            query: () => '/categories',
            transformResponse: (response: ApiResponse<Category[]>) => response.data,
            providesTags: ['Category'],
        }),
        getCategory: builder.query<Category, string>({
            query: (id) => `/categories/${id}`,
            transformResponse: (response: ApiResponse<Category>) => response.data,
            providesTags: (_result, _error, id) => [{ type: 'Category', id }],
        }),
        createCategory: builder.mutation<Category, Partial<Category>>({
            query: (body) => ({
                url: '/categories',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Category'],
        }),
        updateCategory: builder.mutation<Category, { id: string; body: Partial<Category> }>({
            query: ({ id, body }) => ({
                url: `/categories/${id}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => ['Category', { type: 'Category', id }],
        }),
        deleteCategory: builder.mutation<void, string>({
            query: (id) => ({
                url: `/categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Category'],
        }),

        // Custom Fields
        getCustomFieldsByCategory: builder.query<CustomField[], string>({
            query: (categoryId) => `/categories/${categoryId}/custom-fields`,
            transformResponse: (response: ApiResponse<CustomField[]>) => response.data,
            providesTags: (result, _error, categoryId) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'CustomField' as const, id })), { type: 'CustomField', id: `LIST_${categoryId}` }]
                    : [{ type: 'CustomField', id: `LIST_${categoryId}` }],
        }),
        createCustomField: builder.mutation<CustomField, { categoryId: string; body: Partial<CustomField> }>({
            query: ({ categoryId, body }) => ({
                url: `/categories/${categoryId}/custom-fields`,
                method: 'POST',
                body,
            }),
            invalidatesTags: (_result, _error, { categoryId }) => [{ type: 'CustomField', id: `LIST_${categoryId}` }],
        }),
        updateCustomField: builder.mutation<CustomField, { id: string; body: Partial<CustomField> }>({
            query: ({ id, body }) => ({
                url: `/custom-fields/${id}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: 'CustomField', id }],
        }),
        deleteCustomField: builder.mutation<void, { id: string; categoryId: string }>({
            query: ({ id }) => ({
                url: `/custom-fields/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, { id, categoryId }) => [
                { type: 'CustomField', id },
                { type: 'CustomField', id: `LIST_${categoryId}` }
            ],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useGetCategoryQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useGetCustomFieldsByCategoryQuery,
    useCreateCustomFieldMutation,
    useUpdateCustomFieldMutation,
    useDeleteCustomFieldMutation,
} = categoryApi;
