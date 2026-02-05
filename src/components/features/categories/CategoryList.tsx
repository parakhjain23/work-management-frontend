'use client';

import { useGetCategoriesQuery, useDeleteCategoryMutation } from '@/lib/redux/api/categoryApi';
import { Category } from '@/types/category';
import { Settings2, Trash2, Box, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { ManageCustomFieldsModal } from './ManageCustomFieldsModal';
import toast from 'react-hot-toast';

export function CategoryList() {
    const { data: categories, isLoading, error } = useGetCategoriesQuery();
    const [deleteCategory] = useDeleteCategoryMutation();
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [isManageFieldsOpen, setIsManageFieldsOpen] = useState(false);

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this category?')) {
            try {
                await deleteCategory(id).unwrap();
                toast.success('Category deleted successfully');
            } catch (err: any) {
                toast.error(err.data?.error || 'Failed to delete category');
            }
        }
    };

    if (isLoading) return <div className="flex justify-center p-10"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

    if (error) return <div className="alert alert-error">Failed to load categories</div>;

    return (
        <div className="space-y-6">

            <div className="flex flex-col gap-2">
                {categories?.map((category) => (
                    <div
                        key={category.id}
                        className="group flex flex-col md:flex-row md:items-center gap-4 bg-base-100 hover:bg-base-200/50 p-4 md:px-6 md:py-4 rounded-2xl border border-base-200 transition-all duration-200 hover:shadow-lg hover:shadow-base-300/10 active:scale-[0.99]"
                    >
                        {/* Name & ID */}
                        <div className="flex-2 min-w-0">
                            <h3 className="text-base font-bold text-base-content group-hover:text-primary transition-colors flex items-center gap-2">
                                <Box size={18} className="text-primary/50" />
                                {category.name}
                            </h3>
                            <p className="text-[10px] font-mono text-base-content/40 mt-0.5 uppercase tracking-widest leading-none">
                                KEY: {category.keyName}
                            </p>
                        </div>

                        {/* External Tool */}
                        <div className="flex-1">
                            {category.externalTool ? (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-secondary/5 text-secondary border-secondary/20">
                                    <ExternalLink size={12} strokeWidth={3} />
                                    {category.externalTool}
                                </div>
                            ) : (
                                <span className="text-[10px] font-black uppercase tracking-widest text-base-content/20 italic">Native Asset</span>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-2 shrink-0">
                            <button
                                onClick={() => {
                                    setSelectedCategory(category);
                                    setIsManageFieldsOpen(true);
                                }}
                                className="btn btn-ghost btn-sm gap-2 text-primary hover:bg-primary/5 px-4 rounded-xl font-bold border border-transparent hover:border-primary/10"
                            >
                                <Settings2 size={16} />
                                <span className="hidden sm:inline">Manage Fields</span>
                            </button>
                            <button
                                onClick={() => handleDelete(category.id)}
                                className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/5 rounded-xl border border-transparent hover:border-error/10"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {categories?.length === 0 && (
                <div className="text-center p-20 bg-base-200/30 rounded-3xl border-2 border-dashed border-base-300">
                    <Box size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="text-base-content/50 font-medium">No categories found. Create your first one!</p>
                </div>
            )}

            {selectedCategory && isManageFieldsOpen && (
                <ManageCustomFieldsModal
                    category={selectedCategory}
                    onClose={() => {
                        setIsManageFieldsOpen(false);
                        setSelectedCategory(null);
                    }}
                />
            )}
        </div>
    );
}
