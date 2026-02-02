import { errorToast } from '@/app/utils/CustomToasts';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { storCurrentUrl } from '@/lib/utils/utils';

export const customFetchBaseQuery = (baseUrl: string) => {
    return async (args: any, api: any, extraOptions: any) => {
        const baseQuery = fetchBaseQuery({
            baseUrl,
            prepareHeaders: headers => {
                const token = localStorage.getItem('proxy_auth_token');
                if (token) {
                    headers.set('proxy_auth_token', `${token}`);
                    headers.set('Content-Type', 'application/json');
                }
                if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'local') {
                    // localStorage.getItem("proxy_auth_token");
                    headers.set('Authorization', process.env.NEXT_PUBLIC_TOKEN || '');
                }
                return headers;
            },
        });
        const result = await baseQuery(args, api, extraOptions);
        if (result.error) {
            const errorMessage = (result.error?.data as { message?: string })?.message || 'An unknown error occurred';

            if (result.error.status === 401) {
                storCurrentUrl();
                localStorage.removeItem('proxy_auth_token');
                Cookies.remove('proxy_auth_token');
                window.location.replace('/login');
                return result;
            }
            // Handle 404/403 errors - show error overlay without changing URL
            if (result.error.status === 404 || result.error.status === 403) {
                if (typeof window !== 'undefined') {
                    alert(errorMessage);
                }
                return result;
            }

            if (!extraOptions?.ignoreToast) errorToast(errorMessage);
        }
        return result;
    };
};
