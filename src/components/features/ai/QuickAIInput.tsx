'use client';

import { useState } from 'react';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { useCreateWorkItemMutation } from '@/lib/redux/api/workItemApi';

export function QuickAIInput() {
    const [input, setInput] = useState('');
    const [createWorkItem, { isLoading }] = useCreateWorkItemMutation();

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        try {
            await createWorkItem({
                title: input,
                description: 'Created via AI Assistant',
            }).unwrap();
            setInput('');
        } catch (error) {
            console.error('Failed to create work item:', error);
        }
    };

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50">
            <div className="relative group">
                <div className="absolute -inset-1 bg-linear-to-r from-primary/20 to-secondary/20 rounded-2xl blur opacity-25 group-focus-within:opacity-100 transition duration-1000 group-focus-within:duration-200"></div>
                <form
                    onSubmit={handleSubmit}
                    className="relative bg-base-100/70 backdrop-blur-2xl border border-base-200/50 rounded-2xl shadow-2xl p-2 flex items-center gap-3 transition-all duration-300 ring-1 ring-white/10"
                >
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
                        <Sparkles size={20} className={isLoading ? 'animate-pulse' : ''} />
                    </div>

                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type anything to create a work item..."
                        className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm font-medium placeholder:text-base-content/30"
                        disabled={isLoading}
                    />

                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="btn btn-primary btn-sm rounded-xl px-4 h-10 border-none shadow-lg shadow-primary/20 hover:shadow-primary/40 disabled:bg-base-300 group/btn"
                    >
                        {isLoading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <Send size={18} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        )}
                    </button>
                </form>
            </div>
            <div className="mt-3 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/10 flex items-center justify-center gap-3">
                    <span className="w-8 h-px bg-base-content/5"></span>
                    Workflow Intelligent Assistant
                    <span className="w-8 h-px bg-base-content/5"></span>
                </p>
            </div>
        </div>
    );
}
