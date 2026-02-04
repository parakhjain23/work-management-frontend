'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { WorkItemList } from '@/components/features/work-items/WorkItemList';
import { useGetCategoryQuery } from '@/lib/redux/api/categoryApi';
import { useParams } from 'next/navigation';
import { Tag, Filter, LayoutGrid, List, Plus } from 'lucide-react';

import { useAppDispatch } from '@/hooks/redux';
import { openCreateModal } from '@/lib/redux/features/uiSlice';

export default function CategoryWorkItemsPage() {
    const { categoryId } = useParams();
    const dispatch = useAppDispatch();
    const { data: category, isLoading } = useGetCategoryQuery(categoryId as string);

    return (
        <DashboardLayout>
            <div className="space-y-10 pb-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                            <span className="w-8 h-[2px] bg-primary"></span>
                            Category View
                        </div>
                        {isLoading ? (
                            <div className="h-10 w-48 bg-base-300 animate-pulse rounded-xl"></div>
                        ) : (
                            <h1 className="text-4xl font-black tracking-tight text-base-content md:text-5xl flex items-center gap-3">
                                {category?.name}
                                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                    <Tag size={24} />
                                </div>
                            </h1>
                        )}
                        <p className="text-base-content/50 font-medium max-w-md">
                            Viewing all work items associated with the {category?.name || 'selected'} category.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 bg-base-200 p-1 rounded-xl border border-base-300">
                            <button className="btn btn-ghost btn-sm px-2 hover:bg-base-100">
                                <Filter size={16} className="text-base-content/60" />
                            </button>
                            <div className="w-px h-4 bg-base-300 mx-1"></div>
                            <button className="btn btn-ghost btn-xs rounded-lg bg-base-100 shadow-sm">
                                <LayoutGrid size={14} />
                            </button>
                            <button className="btn btn-ghost btn-xs rounded-lg opacity-40 hover:opacity-100">
                                <List size={14} />
                            </button>
                        </div>

                        <button
                            onClick={() => dispatch(openCreateModal({ categoryId: categoryId as string }))}
                            className="btn btn-primary btn-md gap-2 px-6 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-bold"
                        >
                            <Plus size={20} strokeWidth={3} />
                            <span className="hidden sm:inline">New Item</span>
                        </button>
                    </div>
                </div>

                {/* Content Section */}
                <div className="relative">
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>
                    <WorkItemList categoryId={categoryId as string} />
                </div>
            </div>
        </DashboardLayout>
    );
}
