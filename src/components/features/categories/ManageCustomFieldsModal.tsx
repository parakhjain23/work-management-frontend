'use client';

import {
    useGetCustomFieldsByCategoryQuery,
    useDeleteCustomFieldMutation,
    useCreateCustomFieldMutation
} from '@/lib/redux/api/categoryApi';
import { Category, DataType } from '@/types/category';
import { X, Plus, Trash2, Tag, Info } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface ManageCustomFieldsModalProps {
    category: Category;
    isOpen: boolean;
    onClose: () => void;
}

export function ManageCustomFieldsModal({ category, isOpen, onClose }: ManageCustomFieldsModalProps) {
    const { data: fields, isLoading } = useGetCustomFieldsByCategoryQuery(category.id);
    const [deleteField] = useDeleteCustomFieldMutation();
    const [createField, { isLoading: isCreating }] = useCreateCustomFieldMutation();

    const [isAddMode, setIsAddMode] = useState(false);
    const [newField, setNewField] = useState({
        name: '',
        keyName: '',
        dataType: 'text' as DataType,
        description: '',
        enums: ''
    });

    const handleDelete = async (fieldId: string) => {
        if (confirm('Are you sure you want to remove this custom field?')) {
            try {
                await deleteField({ id: fieldId, categoryId: category.id }).unwrap();
                toast.success('Field removed');
            } catch (err: any) {
                toast.error(err.data?.error || 'Failed to remove field');
            }
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createField({
                categoryId: category.id,
                body: newField
            }).unwrap();
            toast.success('Field added');
            setNewField({ name: '', keyName: '', dataType: 'text', description: '', enums: '' });
            setIsAddMode(false);
        } catch (err: any) {
            toast.error(err.data?.error || 'Failed to add field');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-base-100 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-base-200 flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b border-base-200 bg-base-50">
                    <div>
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Tag className="text-primary" />
                            Custom Fields: {category.name}
                        </h3>
                        <p className="text-xs text-base-content/50 font-medium uppercase tracking-wider mt-1">
                            Configure specific data points for this category
                        </p>
                    </div>
                    <button onClick={onClose} className="btn btn-ghost btn-sm btn-square rounded-xl">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Add New Field form */}
                    {isAddMode ? (
                        <form onSubmit={handleCreate} className="bg-base-200/50 p-6 rounded-2xl border border-base-300 space-y-4 animate-in fade-in slide-in-from-top-4">
                            <h4 className="font-bold flex items-center gap-2 text-primary">
                                <Plus size={18} />
                                New Custom Field
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label py-1"><span className="label-text text-xs font-bold uppercase tracking-widest opacity-60">Field Name</span></label>
                                    <input
                                        type="text"
                                        className="input input-bordered input-sm rounded-lg"
                                        placeholder="Display Name"
                                        value={newField.name}
                                        onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label py-1"><span className="label-text text-xs font-bold uppercase tracking-widest opacity-60">Key Name</span></label>
                                    <input
                                        type="text"
                                        className="input input-bordered input-sm rounded-lg font-mono text-xs"
                                        placeholder="unique_key"
                                        value={newField.keyName}
                                        onChange={(e) => setNewField({ ...newField, keyName: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                                        required
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label py-1"><span className="label-text text-xs font-bold uppercase tracking-widest opacity-60">Data Type</span></label>
                                    <select
                                        className="select select-bordered select-sm rounded-lg"
                                        value={newField.dataType}
                                        onChange={(e) => setNewField({ ...newField, dataType: e.target.value as DataType })}
                                    >
                                        <option value="text">Text</option>
                                        <option value="number">Number</option>
                                        <option value="boolean">Boolean</option>
                                        <option value="json">JSON / List</option>
                                    </select>
                                </div>
                                {newField.dataType === 'json' && (
                                    <div className="form-control">
                                        <label className="label py-1"><span className="label-text text-xs font-bold uppercase tracking-widest opacity-60">Enums (Comma separated)</span></label>
                                        <input
                                            type="text"
                                            className="input input-bordered input-sm rounded-lg"
                                            placeholder="Red, Blue, Green"
                                            value={newField.enums}
                                            onChange={(e) => setNewField({ ...newField, enums: e.target.value })}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="form-control">
                                <label className="label py-1"><span className="label-text text-xs font-bold uppercase tracking-widest opacity-60">Description</span></label>
                                <textarea
                                    className="textarea textarea-bordered textarea-sm rounded-lg"
                                    placeholder="What is this field for?"
                                    value={newField.description}
                                    onChange={(e) => setNewField({ ...newField, description: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setIsAddMode(false)} className="btn btn-ghost btn-sm rounded-lg">Cancel</button>
                                <button type="submit" disabled={isCreating} className="btn btn-primary btn-sm rounded-lg px-6">
                                    {isCreating ? <span className="loading loading-spinner loading-xs"></span> : 'Add Field'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <button
                            onClick={() => setIsAddMode(true)}
                            className="w-full py-4 border-2 border-dashed border-base-300 rounded-2xl flex items-center justify-center gap-2 text-base-content/40 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all group"
                        >
                            <Plus size={20} className="group-hover:scale-110 transition-transform" />
                            <span className="font-bold">Add Custom Field</span>
                        </button>
                    )}

                    <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-base-content/30 flex items-center gap-2">
                            Active Fields
                            <span className="bg-base-200 px-2 rounded-full font-mono">{fields?.length || 0}</span>
                        </h4>

                        {isLoading ? (
                            <div className="flex justify-center py-8"><span className="loading loading-spinner text-primary"></span></div>
                        ) : (
                            <div className="grid gap-3">
                                {fields?.map((field) => (
                                    <div key={field.id} className="flex items-center justify-between p-4 bg-base-100 border border-base-200 rounded-2xl hover:border-primary/20 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                                <Tag size={18} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-base-content">{field.name}</span>
                                                    <div className="badge badge-sm badge-outline opacity-50 uppercase text-[10px] font-bold tracking-tighter">{field.dataType}</div>
                                                </div>
                                                <div className="text-[11px] font-mono text-base-content/40">{field.keyName}</div>
                                                {field.description && (
                                                    <div className="flex items-center gap-1 text-[11px] text-base-content/60 mt-1 italic">
                                                        <Info size={10} />
                                                        {field.description}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(field.id)}
                                            className="btn btn-ghost btn-xs btn-square text-error opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                                {fields?.length === 0 && !isAddMode && (
                                    <div className="text-center py-10 opacity-30 italic font-medium">
                                        No custom fields defined for this category.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 border-t border-base-200 bg-base-50 flex justify-end">
                    <button onClick={onClose} className="btn btn-ghost rounded-xl px-10">Done</button>
                </div>
            </div>
        </div>
    );
}
