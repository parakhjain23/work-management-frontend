'use client';

import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useGetCategoriesQuery } from '@/lib/redux/api/categoryApi';
import { useGetOrgUsersQuery } from '@/lib/redux/api/orgApi';
import { useCreateWorkItemMutation } from '@/lib/redux/api/workItemApi';
import { closeCreateModal } from '@/lib/redux/features/uiSlice';
import { RootState } from '@/lib/redux/store';
import { WorkItemPriority, WorkItemStatus } from '@/types/work-item';
import { AlignLeft, Clock, Flag, Tag, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

export function CreateWorkItemModal() {
    const dispatch = useAppDispatch();
    const { isCreateModalOpen, creationMetadata } = useAppSelector((state: RootState) => state.ui);
    const dialogRef = useRef<HTMLDialogElement>(null);

    const [createWorkItem, { isLoading: isCreating }] = useCreateWorkItemMutation();
    const { data: allCategories } = useGetCategoriesQuery();
    const { data: orgUsers } = useGetOrgUsersQuery(undefined);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'CAPTURED' as WorkItemStatus,
        priority: 'MEDIUM' as WorkItemPriority,
        categoryId: '',
        assigneeId: '',
        dueDate: '',
    });

    const [customFieldValues, setCustomFieldValues] = useState<Record<string, any>>({});

    const categoryData = allCategories?.find(c => String(c.id) === String(formData.categoryId));
    const customFieldMetaData = categoryData?.customFieldMetaData;

    useEffect(() => {
        if (isCreateModalOpen) {
            dialogRef.current?.showModal();
            // Pre-fill category if provided in metadata
            if (creationMetadata?.categoryId) {
                setFormData(prev => ({ ...prev, categoryId: creationMetadata.categoryId as string }));
            }
        } else {
            dialogRef.current?.close();
            // Reset form when closing
            setFormData({
                title: '',
                description: '',
                status: 'CAPTURED',
                priority: 'MEDIUM',
                categoryId: '',
                assigneeId: '',
                dueDate: '',
            });
            setCustomFieldValues({});
        }
    }, [isCreateModalOpen, creationMetadata]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title) {
            toast.error('Title is required');
            return;
        }

        try {
            await createWorkItem({
                ...formData,
                customFieldValues,
            }).unwrap();
            toast.success('Work item created successfully');
            dispatch(closeCreateModal());
        } catch (err: any) {
            toast.error(err.data?.message || 'Failed to create work item');
        }
    };

    const handleCustomFieldChange = (keyName: string, value: any, dataType: string) => {
        setCustomFieldValues(prev => ({
            ...prev,
            [keyName]: dataType === 'number' ? Number(value) : value,
        }));
    };

    if (!isCreateModalOpen) return null;

    const statusOptions: { value: WorkItemStatus; label: string }[] = [
        { value: 'CAPTURED', label: 'Captured' },
        { value: 'CLARIFYING', label: 'Clarifying' },
        { value: 'THINKING', label: 'Thinking' },
        { value: 'DECIDED', label: 'Decided' },
        { value: 'IN_PROGRESS', label: 'In Progress' },
        { value: 'IN_REVIEW', label: 'In Review' },
        { value: 'CLOSED', label: 'Closed' },
        { value: 'ARCHIVED', label: 'Archived' },
    ];

    const priorityOptions: { value: WorkItemPriority; label: string }[] = [
        { value: 'LOW', label: 'Low' },
        { value: 'MEDIUM', label: 'Medium' },
        { value: 'HIGH', label: 'High' },
        { value: 'URGENT', label: 'Urgent' },
    ];

    return (
        <dialog ref={dialogRef} className="modal modal-bottom sm:modal-middle" onClose={() => dispatch(closeCreateModal())}>
            <div className="modal-box bg-base-100 rounded-3xl shadow-2xl border border-base-200 p-0 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center px-8 py-6 border-b border-base-200 bg-base-100/50 backdrop-blur-md sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/30 leading-none mb-1.5">New Task</p>
                            <h2 className="text-xl font-black text-base-content leading-none">CREATE WORK ITEM</h2>
                        </div>
                    </div>
                    <button
                        onClick={() => dispatch(closeCreateModal())}
                        className="p-2 hover:bg-base-200 rounded-2xl transition-all duration-300 text-base-content/40 hover:text-base-content active:scale-95"
                    >
                        <X size={24} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
                    {/* Basic Info */}
                    <section className="space-y-6">
                        <div className="form-control w-full">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/30 mb-2 ml-1">Title</label>
                            <input
                                autoFocus
                                type="text"
                                placeholder="What needs to be done?"
                                className="w-full text-2xl font-black text-base-content tracking-tight leading-tight bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-xl p-2 transition-all"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-control w-full">
                            <div className="flex items-center gap-2 mb-3 text-base-content/30">
                                <AlignLeft size={16} strokeWidth={2.5} />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Description</h3>
                            </div>
                            <textarea
                                className="textarea textarea-bordered w-full rounded-2xl bg-base-200/30 border-base-200/50 focus:border-primary/30 focus:bg-base-200/50 transition-all min-h-[120px] text-sm font-medium"
                                placeholder="Add more context to this item..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </section>

                    {/* Metadata Grid */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Status & Priority */}
                        <div className="space-y-6">
                            <div className="form-control">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-base-content/40 mb-2 ml-1">
                                    <Clock size={12} /> Status
                                </label>
                                <select
                                    className="select select-bordered w-full rounded-xl bg-base-200/50 border-transparent focus:border-primary transition-all text-xs font-bold"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as WorkItemStatus })}
                                >
                                    {statusOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-base-content/40 mb-2 ml-1">
                                    <Flag size={12} /> Priority
                                </label>
                                <select
                                    className="select select-bordered w-full rounded-xl bg-base-200/50 border-transparent focus:border-primary transition-all text-xs font-bold"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as WorkItemPriority })}
                                >
                                    {priorityOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Assignee & Category */}
                        <div className="space-y-6">
                            <div className="form-control">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-base-content/40 mb-2 ml-1">
                                    <User size={12} /> Assignee
                                </label>
                                <select
                                    className="select select-bordered w-full rounded-xl bg-base-200/50 border-transparent focus:border-primary transition-all text-xs font-bold"
                                    value={formData.assigneeId}
                                    onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
                                >
                                    <option value="">Unassigned</option>
                                    {orgUsers?.map(user => (
                                        <option key={user.id} value={user.id}>{user.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-base-content/40 mb-2 ml-1">
                                    <Tag size={12} /> Category
                                </label>
                                <select
                                    className="select select-bordered w-full rounded-xl bg-base-200/50 border-transparent focus:border-primary transition-all text-xs font-bold"
                                    value={formData.categoryId}
                                    onChange={(e) => {
                                        setFormData({ ...formData, categoryId: e.target.value });
                                        setCustomFieldValues({});
                                    }}
                                >
                                    <option value="">No Category</option>
                                    {allCategories?.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Custom Fields Section */}
                    {formData.categoryId && customFieldMetaData && customFieldMetaData.length > 0 && (
                        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-2 mb-4 text-base-content/30">
                                <Tag size={16} strokeWidth={2.5} />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Custom Fields</h3>
                            </div>
                            <div className="bg-base-200/30 rounded-3xl p-6 border border-base-200/50 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {customFieldMetaData.map((field) => {
                                    const currentValue = customFieldValues[field.keyName] || '';
                                    return (
                                        <div key={field.id} className="flex flex-col gap-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-base-content/40 pl-1">
                                                {field.name}
                                            </label>
                                            {field.enums ? (
                                                <select
                                                    value={currentValue}
                                                    onChange={(e) => handleCustomFieldChange(field.keyName, e.target.value, field.dataType)}
                                                    className="select select-sm select-bordered rounded-xl text-xs font-medium bg-base-100/50 border-base-content/10 focus:border-primary w-full"
                                                >
                                                    <option value="">Select {field.name}</option>
                                                    {field.enums.split(',').map((opt: string) => (
                                                        <option key={opt.trim()} value={opt.trim()}>
                                                            {opt.trim()}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    type={field.dataType === 'number' ? 'number' : 'text'}
                                                    value={currentValue}
                                                    onChange={(e) => handleCustomFieldChange(field.keyName, e.target.value, field.dataType)}
                                                    className="input input-sm input-bordered rounded-xl text-xs font-medium bg-base-100/50 border-base-content/10 focus:border-primary w-full"
                                                    placeholder={`Enter ${field.name}`}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Due Date */}
                    <section>
                        <div className="form-control w-full md:w-1/2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/30 mb-2 ml-1">Due Date (Optional)</label>
                            <input
                                type="date"
                                className="input input-bordered w-full rounded-xl bg-base-200/50 border-transparent focus:border-primary transition-all text-xs font-bold"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            />
                        </div>
                    </section>
                </form>

                {/* Footer */}
                <div className="p-8 border-t border-base-200 flex justify-end gap-3 bg-base-100">
                    <button
                        type="button"
                        onClick={() => dispatch(closeCreateModal())}
                        className="btn btn-ghost rounded-2xl px-6 font-bold"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isCreating || !formData.title}
                        className="btn btn-primary rounded-2xl px-8 shadow-lg shadow-primary/20 hover:shadow-primary/40 font-black tracking-wide"
                    >
                        {isCreating ? <span className="loading loading-spinner"></span> : 'CREATE ITEM'}
                    </button>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={() => dispatch(closeCreateModal())}>close</button>
            </form>
        </dialog>
    );
}
