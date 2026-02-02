'use client';

import { useGetCategoriesQuery, useDeleteCategoryMutation } from '@/lib/redux/api/categoryApi';
import { Category } from '@/types/category';
import { Settings2, Trash2, Plus, Box, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { AddCategoryModal } from './AddCategoryModal';
import { ManageCustomFieldsModal } from './ManageCustomFieldsModal';
import toast from 'react-hot-toast';

export function CategoryList() {
    const { data: categories, isLoading, error } = useGetCategoriesQuery();
    const [deleteCategory] = useDeleteCategoryMutation();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Box className="text-primary" />
                    Available Categories
                </h2>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="btn btn-primary btn-sm gap-2 rounded-xl"
                >
                    <Plus size={18} />
                    Add Category
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories?.map((category) => (
                    <div
                        key={category.id}
                        className="card bg-base-100 border border-base-200 hover:border-primary/30 transition-all hover:shadow-lg group"
                    >
                        <div className="card-body p-5">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="card-title text-lg font-bold">{category.name}</h3>
                                    <p className="text-xs font-mono text-base-content/50">ID: {category.keyName}</p>
                                </div>
                                {category.externalTool && (
                                    <div className="badge badge-outline badge-sm gap-1">
                                        <ExternalLink size={10} />
                                        {category.externalTool}
                                    </div>
                                )}
                            </div>

                            <div className="card-actions justify-end mt-4 pt-4 border-t border-base-200">
                                <button
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        setIsManageFieldsOpen(true);
                                    }}
                                    className="btn btn-ghost btn-sm gap-2 text-primary hover:bg-primary/5"
                                >
                                    <Settings2 size={16} />
                                    Manage Fields
                                </button>
                                <button
                                    onClick={() => handleDelete(category.id)}
                                    className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/5"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
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

            <AddCategoryModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

            {selectedCategory && (
                <ManageCustomFieldsModal
                    category={selectedCategory}
                    isOpen={isManageFieldsOpen}
                    onClose={() => {
                        setIsManageFieldsOpen(false);
                        setSelectedCategory(null);
                    }}
                />
            )}
        </div>
    );
}
