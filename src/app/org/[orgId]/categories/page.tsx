'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CategoryList } from '@/components/features/categories/CategoryList';
import { Settings, Box, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function CategoriesPage() {
    const { orgId } = useParams();

    return (
        <DashboardLayout>
            <div className="space-y-10 pb-10">
                {/* Breadcrumbs & Navigation */}
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-base-content/40">
                    <Link href={`/org/${orgId}`} className="hover:text-primary transition-colors">Dashboard</Link>
                    <ChevronRight size={14} strokeWidth={3} />
                    <span className="text-primary">Settings</span>
                    <ChevronRight size={14} strokeWidth={3} />
                    <span className="text-base-content/80">Categories</span>
                </div>

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                            <span className="w-8 h-[2px] bg-primary"></span>
                            Organization Assets
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-base-content md:text-5xl flex items-center gap-4">
                            Categories
                            <div className="p-2 bg-primary/10 rounded-2xl text-primary">
                                <Settings size={32} />
                            </div>
                        </h1>
                        <p className="text-base-content/50 font-medium max-w-md">
                            Manage work item types and their custom fields to tailor the platform to your workflow.
                        </p>
                    </div>
                </div>

                {/* Content Section */}
                <div className="relative">
                    {/* Decorative Elements */}
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

                    {/* Categories Main Component */}
                    <div className="bg-base-100/40 backdrop-blur-md rounded-[2.5rem] border border-base-200/50 p-8 shadow-xl shadow-base-content/5">
                        <CategoryList />
                    </div>
                </div>

                {/* Info Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                    <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10 flex gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                            <Box size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-primary mb-1">What are Categories?</h4>
                            <p className="text-sm text-base-content/60 leading-relaxed font-medium">
                                Categories allow you to group work items like "Bugs", "Features", or "General Tasks".
                                Each category can have its own set of custom fields.
                            </p>
                        </div>
                    </div>
                    <div className="bg-secondary/5 rounded-3xl p-6 border border-secondary/10 flex gap-4">
                        <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary shrink-0">
                            <Settings size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-secondary mb-1">Custom Fields</h4>
                            <p className="text-sm text-base-content/60 leading-relaxed font-medium">
                                Add text, number, boolean or list fields to capture specific data points for each category type.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
