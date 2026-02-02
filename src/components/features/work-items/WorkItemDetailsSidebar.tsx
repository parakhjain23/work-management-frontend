'use client';

import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { closeSidebar } from '@/lib/redux/features/uiSlice';
import { RootState } from '@/lib/redux/store';
import { cn } from '@/lib/utils/cn';
import { AlertTriangle, AlignLeft, Calendar, CheckCircle2, Clock, Hash, Info, User, X } from 'lucide-react';
import { ChatbotEmbed } from '../ai/ChatbotEmbed';

export function WorkItemDetailsSidebar() {
    const dispatch = useAppDispatch();
    const { isSidebarOpen, selectedWorkItem } = useAppSelector((state: RootState) => state.ui);

    if (!selectedWorkItem) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-base-300/10 backdrop-blur-[4px] z-[100] transition-opacity duration-500 ease-in-out",
                    isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => dispatch(closeSidebar())}
            />

            {/* Sidebar */}
            <div
                className={cn(
                    "fixed top-0 right-0 h-full w-[95%] md:w-[85%] lg:w-[75%] xl:w-[65%] max-w-6xl bg-base-100 shadow-2xl z-[101] flex flex-col transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) transform border-l border-base-200",
                    isSidebarOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-base-200 bg-base-100/50 backdrop-blur-md sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-primary/10 rounded-2xl text-primary shadow-inner shadow-primary/5">
                            <Hash size={22} className="stroke-[2.5]" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/30 leading-none mb-1.5">Focus Mode</p>
                            <h2 className="text-sm font-black text-base-content leading-none flex items-center gap-2">
                                WORK ITEM <span className="text-primary/60">#{selectedWorkItem.id.slice(-6).toUpperCase()}</span>
                            </h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            className="btn btn-ghost btn-sm rounded-xl font-black uppercase tracking-widest text-[10px] opacity-40 hover:opacity-100 transition-all"
                            onClick={() => {/* Implement Edit */ }}
                        >
                            Edit Item
                        </button>
                        <div className="w-[1px] h-4 bg-base-300 mx-2"></div>
                        <button
                            onClick={() => dispatch(closeSidebar())}
                            className="p-2 hover:bg-base-200 rounded-2xl transition-all duration-300 text-base-content/40 hover:text-base-content hover:rotate-90 active:scale-95"
                        >
                            <X size={22} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>

                {/* Main Content Area - Split Horizontally */}
                <div className="flex-1 flex overflow-hidden">

                    {/* Left Part: Work Item Details */}
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar border-r border-base-200 bg-base-100">
                        <div className="max-w-xl mx-auto space-y-10">
                            {/* Title Section */}
                            <section className="space-y-6">
                                <h1 className="text-3xl font-black text-base-content tracking-tight leading-[1.1]">
                                    {selectedWorkItem.title}
                                </h1>
                                <div className="flex flex-wrap gap-2.5">
                                    <div className={cn(
                                        "flex items-center gap-2 px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 shadow-sm transition-all animate-in fade-in slide-in-from-left-2",
                                        selectedWorkItem.status === 'DONE' ? 'bg-success/5 text-success border-success/20' :
                                            selectedWorkItem.status === 'IN_PROGRESS' ? 'bg-primary/5 text-primary border-primary/20 bg-primary/2 shadow-primary/5' :
                                                'bg-base-200 text-base-content/40 border-base-300'
                                    )}>
                                        {selectedWorkItem.status === 'DONE' ? <CheckCircle2 size={14} strokeWidth={3} /> :
                                            selectedWorkItem.status === 'IN_PROGRESS' ? <Clock size={14} strokeWidth={3} /> : <AlertTriangle size={14} strokeWidth={3} />}
                                        {selectedWorkItem.status}
                                    </div>
                                    <div className={cn(
                                        "flex items-center gap-2 px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 shadow-sm animate-in fade-in slide-in-from-left-4",
                                        selectedWorkItem.priority === 'URGENT' ? 'bg-error/5 text-error border-error/20' :
                                            selectedWorkItem.priority === 'HIGH' ? 'bg-warning/5 text-warning border-warning/20' :
                                                selectedWorkItem.priority === 'MEDIUM' ? 'bg-info/5 text-info border-info/20' : 'bg-base-200 text-base-content/40 border-base-300'
                                    )}>
                                        {selectedWorkItem.priority}
                                    </div>
                                </div>
                            </section>

                            {/* Description Section */}
                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center gap-2 mb-4 text-base-content/30">
                                    <AlignLeft size={16} strokeWidth={2.5} />
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Context & Description</h3>
                                </div>
                                <div className="bg-base-200/30 rounded-[2rem] p-6 border border-base-200/50 relative group transition-all hover:bg-base-200/50">
                                    <p className="text-sm text-base-content/80 leading-relaxed font-medium">
                                        {selectedWorkItem.description || 'No detailed description provided for this work item.'}
                                    </p>
                                </div>
                            </section>

                            {/* Details Grid */}
                            <section className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                                <div className="bg-base-200/30 rounded-3xl p-5 border border-base-200/50 hover:border-primary/20 transition-colors group">
                                    <div className="flex items-center gap-2 mb-4 text-base-content/30 group-hover:text-primary/50 transition-colors">
                                        <User size={14} strokeWidth={2.5} />
                                        <h3 className="text-[10px] font-black uppercase tracking-widest">Ownership</h3>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar placeholder ring-4 ring-base-100 rounded-full">
                                            <div className="bg-primary/10 text-primary rounded-[1rem] w-10 h-10 shadow-inner">
                                                <span className="text-sm font-black">{selectedWorkItem.assignee?.name?.charAt(0) || 'U'}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-base-content">{selectedWorkItem.assignee?.name || 'Unassigned'}</p>
                                            <p className="text-[9px] font-bold text-base-content/30 uppercase tracking-tighter">Current Lead</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-base-200/30 rounded-3xl p-5 border border-base-200/50 hover:border-primary/20 transition-colors group">
                                    <div className="flex items-center gap-2 mb-4 text-base-content/30 group-hover:text-primary/50 transition-colors">
                                        <Calendar size={14} strokeWidth={2.5} />
                                        <h3 className="text-[10px] font-black uppercase tracking-widest">Timeline</h3>
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-base-content">
                                            {new Date(selectedWorkItem.createdAt).toLocaleDateString(undefined, {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </p>
                                        <p className="text-[9px] font-bold text-base-content/30 uppercase tracking-tighter">Initialization Date</p>
                                    </div>
                                </div>
                            </section>

                            {/* Metadata */}
                            <section className="pt-8 border-t border-base-200">
                                <div className="flex items-center justify-between text-[10px] font-black text-base-content/20 uppercase tracking-widest">
                                    <div className="flex items-center gap-2">
                                        <Info size={14} strokeWidth={2.5} />
                                        Last synchronized {new Date(selectedWorkItem.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="flex items-center gap-1.5 opacity-50">
                                        v1.0.4-build
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Right Part: Chatbot AI Sync */}
                    <div className="flex-1 flex flex-col bg-base-200/10 p-4 lg:p-6 overflow-hidden relative">
                        <div className="flex-1 rounded-2xl bg-base-100 shadow-sm border border-gray-400 overflow-hidden">
                            <ChatbotEmbed threadId={selectedWorkItem.id} />
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/5 rounded-full blur-[80px] pointer-events-none"></div>
                    </div>

                </div>
            </div>
        </>
    );
}
