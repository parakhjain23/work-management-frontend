import { useCreateSystemPromptMutation, useUpdateSystemPromptMutation } from '@/lib/redux/api/systemPromptApi';
import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import { SystemPrompt } from '@/types/system-prompt';

interface AutomationModalProps {
    isOpen: boolean;
    onClose: () => void;
    automation?: SystemPrompt | null;
}

export function AutomationModal({ isOpen, onClose, automation }: AutomationModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [createAutomation, { isLoading: isCreating }] = useCreateSystemPromptMutation();
    const [updateAutomation, { isLoading: isUpdating }] = useUpdateSystemPromptMutation();

    const [formData, setFormData] = useState({
        name: '',
        conditionLabel: '',
        promptTemplate: '',
    });

    useEffect(() => {
        if (automation) {
            setFormData({
                name: automation.name,
                conditionLabel: automation.conditionLabel || '',
                promptTemplate: automation.promptTemplate,
            });
        } else {
            setFormData({
                name: '',
                conditionLabel: '',
                promptTemplate: '',
            });
        }
    }, [automation, isOpen]);

    useEffect(() => {
        if (isOpen) {
            if (!dialogRef.current?.open) {
                dialogRef.current?.showModal();
            }
        } else {
            dialogRef.current?.close();
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (automation) {
                await updateAutomation({ id: automation.id, body: formData }).unwrap();
                toast.success('Automation updated successfully');
            } else {
                await createAutomation(formData).unwrap();
                toast.success('Automation created successfully');
            }
            onClose();
        } catch (err: any) {
            toast.error(err.data?.error || `Failed to ${automation ? 'update' : 'create'} automation`);
        }
    };

    const isLoading = isCreating || isUpdating;

    return (
        <dialog ref={dialogRef} className="modal" onClose={onClose}>
            <div className="modal-box bg-base-100 rounded-3xl shadow-2xl border border-base-200 p-0 max-w-md">
                <div className="flex justify-between items-center p-6 border-b border-base-200">
                    <h3 className="text-xl font-bold">{automation ? 'Edit Automation' : 'Add New Automation'}</h3>
                    <button onClick={onClose} className="btn btn-ghost btn-sm btn-square rounded-xl">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-bold">Automation Name</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered w-full rounded-xl focus:ring-2 focus:ring-primary/20"
                            placeholder="e.g. Auto-Prioritizer"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-bold">When to Execute (Condition)</span>
                        </label>
                        <textarea
                            className="textarea textarea-bordered w-full rounded-xl focus:ring-2 focus:ring-primary/20 h-24"
                            placeholder="e.g. When a work item is created..."
                            value={formData.conditionLabel}
                            onChange={(e) => setFormData({ ...formData, conditionLabel: e.target.value })}
                            required
                        ></textarea>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-bold">What to Execute (AI Prompt)</span>
                        </label>
                        <textarea
                            className="textarea textarea-bordered w-full rounded-xl focus:ring-2 focus:ring-primary/20 h-32"
                            placeholder="e.g. Analyze the description..."
                            value={formData.promptTemplate}
                            onChange={(e) => setFormData({ ...formData, promptTemplate: e.target.value })}
                            required
                        ></textarea>
                    </div>

                    <div className="modal-action mt-6">
                        <button type="button" onClick={onClose} className="btn btn-ghost rounded-xl">Cancel</button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary px-8 rounded-xl shadow-lg shadow-primary/20"
                        >
                            {isLoading ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                automation ? 'Update Automation' : 'Create Automation'
                            )}
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
