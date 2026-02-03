import { useCreateCategoryMutation } from '@/lib/redux/api/categoryApi';
import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

interface AddCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddCategoryModal({ isOpen, onClose }: AddCategoryModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [createCategory, { isLoading }] = useCreateCategoryMutation();
    const [formData, setFormData] = useState({
        name: '',
        keyName: '',
        externalTool: ''
    });

    useEffect(() => {
        if (!dialogRef.current?.open) {
            dialogRef.current?.showModal();
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createCategory(formData).unwrap();
            toast.success('Category created successfully');
            setFormData({ name: '', keyName: '', externalTool: '' });
            onClose();
        } catch (err: any) {
            toast.error(err.data?.error || 'Failed to create category');
        }
    };

    return (
        <dialog ref={dialogRef} className="modal" onClose={onClose}>
            <div className="modal-box bg-base-100 rounded-3xl shadow-2xl border border-base-200 p-0 max-w-md">
                <div className="flex justify-between items-center p-6 border-b border-base-200">
                    <h3 className="text-xl font-bold">Add New Category</h3>
                    <button onClick={onClose} className="btn btn-ghost btn-sm btn-square rounded-xl">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-bold">Category Name</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered w-full rounded-xl focus:ring-2 focus:ring-primary/20"
                            placeholder="e.g. Bug Report"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-bold">Key Name (Unique ID)</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered w-full rounded-xl font-mono text-sm focus:ring-2 focus:ring-primary/20"
                            placeholder="e.g. bug_report"
                            value={formData.keyName}
                            onChange={(e) => setFormData({ ...formData, keyName: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-bold">External Tool (Optional)</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered w-full rounded-xl focus:ring-2 focus:ring-primary/20"
                            placeholder="e.g. Jira, GitHub"
                            value={formData.externalTool}
                            onChange={(e) => setFormData({ ...formData, externalTool: e.target.value })}
                        />
                    </div>

                    <div className="modal-action mt-6">
                        <button type="button" onClick={onClose} className="btn btn-ghost rounded-xl">Cancel</button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary px-8 rounded-xl shadow-lg shadow-primary/20"
                        >
                            {isLoading ? <span className="loading loading-spinner loading-sm"></span> : 'Create Category'}
                        </button>
                    </div>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </dialog>
    );
}
