import { member, proxyUser } from '@/types/org-user';
import { createApi } from '@reduxjs/toolkit/query/react';
import { customFetchBaseQuery } from './interceptor';

export const orgsApi = createApi({
    reducerPath: 'orgsApi',
    baseQuery: customFetchBaseQuery('https://routes.msg91.com/api'),
    endpoints: builder => ({

        getProxyUser: builder.query({
            query: () => 'c/getDetails',
            transformResponse: (response: { data: proxyUser[] }) => {
                return response?.data?.[0];
            },
        }),
        getOrgUsers: builder.query({
            query: () => 'c/getUsers?itemsPerPage=300',
            transformResponse: (response: { data: { data: member[] } }) => {
                return response?.data?.data;
            },
        }),
        createNewOrg: builder.mutation({
            query: ({ name }) => {
                const url = '/c/createCompany';
                return {
                    url,
                    method: 'POST',
                    body: {
                        company: { name },
                    },
                };
            },
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const newCompany = data.data;
                    if (newCompany) {
                        dispatch(
                            orgsApi.util.updateQueryData('getProxyUser', undefined, (currentState: proxyUser) => {
                                currentState.c_companies?.push(newCompany);
                                currentState.currentCompany = newCompany;
                            })
                        );
                        await dispatch(orgsApi.endpoints.switchOrg.initiate({ orgId: newCompany.id })).unwrap();
                    }
                } catch (error) {
                    console.error('Failed to add message to cache', error);
                }
            },
        }),

        switchOrg: builder.mutation({
            query: ({ orgId }) => ({
                url: '/c/switchCompany',
                method: 'POST',
                body: {
                    company_ref_id: { id: orgId },
                },
            }),
            async onQueryStarted({ orgId }, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    // Update currentCompany in getProxyUser cache after successful switch
                    dispatch(
                        orgsApi.util.updateQueryData('getProxyUser', undefined, (currentState: proxyUser) => {
                            const newCompany = currentState.c_companies?.find(c => c.id === orgId);
                            if (newCompany) {
                                currentState.currentCompany = newCompany;
                            }
                        })
                    );
                } catch (error) {
                    console.error('Failed to switch organization', error);
                }
            },
        }),

        inviteMember: builder.mutation({
            query: ({ email }) => {
                const url = '/c/addUser';
                return {
                    url,
                    method: 'POST',
                    body: {
                        user: { email },
                    },
                };
            },
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const newMember = data?.data;

                    dispatch(
                        orgsApi.util.updateQueryData('getOrgUsers', undefined, currentState => {
                            currentState.push(newMember);
                        })
                    );
                } catch (error) {
                    console.error('Failed to add message to cache', error);
                }
            },
        }),
    }),
});

export const {
    useCreateNewOrgMutation,
    useGetProxyUserQuery,
    useGetOrgUsersQuery,
    useInviteMemberMutation,
    useSwitchOrgMutation,
} = orgsApi;

