'use client';
import { createApi } from '@reduxjs/toolkit/query/react';
import { customFetchBaseQuery } from './interceptor';

export const embedApi = createApi({
    reducerPath: 'embedApi',
    baseQuery: customFetchBaseQuery(`${process.env.NEXT_PUBLIC_API_URL}/chatbot`),
    endpoints: builder => ({
        getEmbedTokenChatbot: builder.query<{ embedToken: string; success: boolean }, void>({
            query: () => ({
                url: `/embed-token`,
            }),
            transformResponse: (response: { embedToken: string; success: boolean }) => response,
        }),
    }),
});

export const { useGetEmbedTokenChatbotQuery } = embedApi;
