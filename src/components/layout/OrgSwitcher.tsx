'use client';

import { useGetProxyUserQuery, useSwitchOrgMutation, orgsApi } from '@/lib/redux/api/orgApi';
import { ChevronDown, User, Check, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { categoryApi } from '@/lib/redux/api/categoryApi';
import { workItemApi } from '@/lib/redux/api/workItemApi';
import { systemPromptApi } from '@/lib/redux/api/systemPromptApi';
import { embedApi } from '@/lib/redux/api/embedApi';

export function OrgSwitcher() {
    const { data: userData, isLoading } = useGetProxyUserQuery(undefined);
    const [switchOrg] = useSwitchOrgMutation();
    const router = useRouter();
    const dispatch = useDispatch();

    if (isLoading || !userData) {
        return (
            <div className="px-6 py-4 animate-pulse">
                <div className="h-10 bg-base-300 rounded-xl w-full"></div>
            </div>
        );
    }

    const currentCompany = userData.currentCompany;
    const companies = userData.c_companies || [];

    // Sort companies: current one first, then others
    const sortedCompanies = [...companies].sort((a, b) => {
        if (a.id === currentCompany?.id) return -1;
        if (b.id === currentCompany?.id) return 1;
        return 0;
    });

    const displayCompanies = sortedCompanies.slice(0, 6);
    const hasMore = companies.length > 6;

    const handleSwitch = async (orgId: number) => {
        try {
            await switchOrg({ orgId }).unwrap();

            // Reset all API states to clear cache for the new organization
            dispatch(categoryApi.util.resetApiState());
            dispatch(workItemApi.util.resetApiState());
            dispatch(systemPromptApi.util.resetApiState());
            dispatch(orgsApi.util.resetApiState());
            dispatch(embedApi.util.resetApiState());

            router.push(`/org/${orgId}`);
        } catch (error) {
            console.error('Failed to switch organization:', error);
        }
    };

    return (
        <div className="px-4 pb-6">
            <div className="dropdown dropdown-bottom w-full">
                <div
                    tabIndex={0}
                    role="button"
                    className="group flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-base-200/50 hover:bg-base-200 border border-base-300/50 cursor-pointer transition-all duration-300 active:scale-[0.98] w-full"
                >
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="shrink-0 w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-colors duration-300">
                            <Building2 size={20} />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-black uppercase tracking-wider text-base-content/30 leading-none mb-1">
                                Organization
                            </span>
                            <span className="text-sm font-bold text-base-content truncate">
                                {currentCompany?.name || 'Select Org'}
                            </span>
                        </div>
                    </div>
                    <ChevronDown
                        size={16}
                        className="text-base-content/30 transition-transform duration-300"
                    />
                </div>

                <div
                    tabIndex={0}
                    className="dropdown-content z-50 bg-base-100 border border-base-300 rounded-2xl shadow-2xl shadow-base-content/20 overflow-hidden w-full mt-2"
                >
                    <div className="p-2">
                        <div className="space-y-1">
                            {/* All companies list */}
                            {displayCompanies.map((company) => {
                                const isCurrent = company.id === currentCompany?.id;
                                return (
                                    <button
                                        key={company.id}
                                        onClick={() => handleSwitch(company.id)}
                                        className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all active:scale-[0.98] group/item ${isCurrent
                                            ? 'bg-base-content text-base-100 shadow-lg shadow-base-content/10'
                                            : 'hover:bg-base-200 text-base-content/70 hover:text-base-content'
                                            }`}
                                    >
                                        <span className="text-sm font-bold truncate">{company.name}</span>
                                        {isCurrent && <Check size={14} className="shrink-0" />}
                                    </button>
                                );
                            })}

                            {hasMore && (
                                <button
                                    onClick={() => { localStorage.removeItem('selectedOrgId'); router.push('/') }}
                                    className="w-full text-left px-3 py-2 text-xs font-bold text-primary hover:underline transition-all"
                                >
                                    Show more
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
