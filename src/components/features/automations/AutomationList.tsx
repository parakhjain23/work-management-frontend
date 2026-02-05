import { useGetSystemPromptsQuery, useDeleteSystemPromptMutation } from '@/lib/redux/api/systemPromptApi';
import { Zap, Trash2, Clock, Settings2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { AutomationModal } from './AutomationModal';
import { SystemPrompt } from '@/types/system-prompt';

export function AutomationList() {
    const { data: automations, isLoading, error } = useGetSystemPromptsQuery();
    const [deleteAutomation] = useDeleteSystemPromptMutation();
    const [selectedAutomation, setSelectedAutomation] = useState<SystemPrompt | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this automation?')) {
            try {
                await deleteAutomation(id).unwrap();
                toast.success('Automation deleted successfully');
            } catch (err: any) {
                toast.error(err.data?.error || 'Failed to delete automation');
            }
        }
    };

    if (isLoading) return <div className="flex justify-center p-10"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

    if (error) return <div className="alert alert-error">Failed to load automations</div>;

    return (
        <div className="space-y-6">

            <div className="flex flex-col gap-2">
                {automations?.map((automation) => (
                    <div
                        key={automation.id}
                        className="group flex flex-col md:flex-row md:items-center gap-4 bg-base-100 hover:bg-base-200/50 p-4 md:px-6 md:py-4 rounded-2xl border border-base-200 transition-all duration-200 hover:shadow-lg hover:shadow-base-300/10 active:scale-[0.99]"
                    >
                        {/* Status Light */}
                        <div className="flex items-center justify-center shrink-0">
                            <div className="w-10 h-10 bg-success/10 text-success rounded-xl flex items-center justify-center">
                                <Zap size={18} fill="currentColor" className="animate-pulse" />
                            </div>
                        </div>

                        {/* Name & ID */}
                        <div className="flex-2 min-w-0">
                            <h3 className="text-base font-bold text-base-content group-hover:text-primary transition-colors truncate">
                                {automation.name}
                            </h3>
                            <p className="text-[10px] font-mono text-base-content/40 mt-0.5 uppercase tracking-widest leading-none">
                                ID: {automation.id}
                            </p>
                        </div>

                        {/* Condition / Logic */}
                        <div className="flex-3 min-w-0 hidden lg:block">
                            <div className="flex items-center gap-2 text-[10px] font-black text-base-content/20 uppercase tracking-widest mb-1">
                                <Clock size={12} /> Trigger
                            </div>
                            <p className="text-xs font-medium text-base-content/60 line-clamp-1 italic">
                                "{automation.conditionLabel}"
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-2 shrink-0">
                            <button
                                onClick={() => {
                                    setSelectedAutomation(automation);
                                    setIsEditModalOpen(true);
                                }}
                                className="btn btn-ghost btn-sm gap-2 text-primary hover:bg-primary/5 px-4 rounded-xl font-bold border border-transparent hover:border-primary/10"
                            >
                                <Settings2 size={16} />
                                <span className="hidden sm:inline">Edit</span>
                            </button>
                            <button
                                onClick={() => handleDelete(automation.id)}
                                className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/5 rounded-xl border border-transparent hover:border-error/10"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {automations?.length === 0 && (
                <div className="text-center p-20 bg-base-200/30 rounded-3xl border-2 border-dashed border-base-300">
                    <Zap size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="text-base-content/50 font-medium">No automations found. Create your first one!</p>
                </div>
            )}

            {isEditModalOpen && (
                <AutomationModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedAutomation(null);
                    }}
                    automation={selectedAutomation}
                />
            )}
        </div>
    );
}
