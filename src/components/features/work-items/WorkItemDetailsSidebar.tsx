'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { closeSidebar } from '@/lib/redux/features/uiSlice';
import { RootState } from '@/lib/redux/store';
import { cn } from '@/lib/utils/cn';
import { AlertTriangle, AlignLeft, Calendar, CheckCircle2, Clock, Hash, Info, User, X } from 'lucide-react';
import { ChatbotEmbed } from '../ai/ChatbotEmbed';
import { useUpdateWorkItemMutation, useGetWorkItemFullDataQuery } from '@/lib/redux/api/workItemApi';
import { WorkItemStatus, WorkItemPriority } from '@/types/work-item';
import toast from 'react-hot-toast';

export function WorkItemDetailsSidebar() {
    const dispatch = useAppDispatch();
    const { isSidebarOpen, selectedWorkItem } = useAppSelector((state: RootState) => state.ui);

    // Fetch full data when a work item is selected
    const { data: fullWorkItem, isLoading: isFetchingFullData } = useGetWorkItemFullDataQuery(
        selectedWorkItem?.id as string,
        { skip: !selectedWorkItem?.id || !isSidebarOpen }
    );

    const [updateWorkItem, { isLoading: isUpdating }] = useUpdateWorkItemMutation();

    // Local state for editing
    const [localTitle, setLocalTitle] = useState('');
    const [localDescription, setLocalDescription] = useState('');

    useEffect(() => {
        // Sync local state when full data arrives or changes
        if (fullWorkItem) {
            setLocalTitle(fullWorkItem.title || '');
            setLocalDescription(fullWorkItem.description || '');
        } else if (selectedWorkItem) {
            // Fallback to partial data if full data isn't here yet
            setLocalTitle(selectedWorkItem.title || '');
            setLocalDescription(selectedWorkItem.description || '');
        }
    }, [fullWorkItem, selectedWorkItem]);

    if (!selectedWorkItem) return null;

    // Use fullWorkItem if available, otherwise fallback to selectedWorkItem
    const item = fullWorkItem || selectedWorkItem;
    console.log(item, 'fullitem details')
    const handleStatusChange = async (newStatus: WorkItemStatus) => {
        try {
            await updateWorkItem({ id: selectedWorkItem.id, body: { status: newStatus } }).unwrap();
            toast.success('Status updated');
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const handlePriorityChange = async (newPriority: WorkItemPriority) => {
        try {
            await updateWorkItem({ id: selectedWorkItem.id, body: { priority: newPriority } }).unwrap();
            toast.success('Priority updated');
        } catch (err) {
            toast.error('Failed to update priority');
        }
    };

    const handleDueDateChange = async (newDueDate: string) => {
        try {
            await updateWorkItem({ id: selectedWorkItem.id, body: { dueDate: newDueDate } }).unwrap();
            toast.success('Due date updated');
        } catch (err) {
            toast.error('Failed to update due date');
        }
    };

    const handleTitleUpdate = async () => {
        if (!selectedWorkItem || !selectedWorkItem.title || localTitle === selectedWorkItem.title) return;
        try {
            await updateWorkItem({ id: selectedWorkItem.id, body: { title: localTitle } }).unwrap();
            toast.success('Title updated');
        } catch (err) {
            toast.error('Failed to update title');
        }
    };

    const handleDescriptionUpdate = async () => {
        if (!selectedWorkItem || !selectedWorkItem.description || localDescription === selectedWorkItem.description) return;
        try {
            await updateWorkItem({ id: selectedWorkItem.id, body: { description: localDescription } }).unwrap();
            toast.success('Description updated');
        } catch (err) {
            toast.error('Failed to update description');
        }
    };

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
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-base-300/10 backdrop-blur-xs z-50 transition-opacity duration-500 ease-in-out",
                    isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => dispatch(closeSidebar())}
            />

            {/* Sidebar */}
            <div
                className={cn(
                    "fixed top-0 right-0 h-full w-[95%] md:w-[85%] lg:w-[75%] xl:w-[65%] max-w-6xl bg-base-100 shadow-2xl z-50 flex flex-col transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) transform border-l border-base-200",
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
                                WORK ITEM <span className="text-primary/60">#{item.id?.toString().slice(-6).toUpperCase() || '......'}</span>
                            </h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {(isUpdating || isFetchingFullData) && <span className="loading loading-spinner loading-xs text-primary"></span>}
                        <div className="w-px h-4 bg-base-300 mx-2"></div>
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
                                <input
                                    value={localTitle}
                                    onChange={(e) => setLocalTitle(e.target.value)}
                                    onBlur={handleTitleUpdate}
                                    className="w-full text-3xl font-black text-base-content tracking-tight leading-[1.1] bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary/20 rounded-lg p-1 transition-all"
                                    placeholder="Enter title..."
                                />
                                <div className="flex flex-wrap gap-4 items-center">
                                    {/* Status Selector */}
                                    <div className="flex flex-col gap-1.5">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-base-content/40 ml-1 mt-1">Status</p>
                                        <select
                                            value={item.status ?? ''}
                                            onChange={(e) => handleStatusChange(e.target.value as WorkItemStatus)}
                                            className="select select-sm select-bordered rounded-xl text-xs font-medium bg-base-200/50 border-transparent focus:border-primary transition-all w-36"
                                        >
                                            {statusOptions.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Priority Selector */}
                                    <div className="flex flex-col gap-1.5">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-base-content/40 ml-1 mt-1">Priority</p>
                                        <select
                                            value={item.priority ?? ''}
                                            onChange={(e) => handlePriorityChange(e.target.value as WorkItemPriority)}
                                            className="select select-sm select-bordered rounded-xl text-xs font-medium bg-base-200/50 border-transparent focus:border-primary transition-all w-32"
                                        >
                                            {priorityOptions.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Due Date Selector */}
                                    <div className="flex flex-col gap-1.5">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-base-content/40 ml-1 mt-1">Due Date</p>
                                        <input
                                            type="date"
                                            value={(() => {
                                                if (!item.dueDate) return '';
                                                const date = new Date(item.dueDate);
                                                return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
                                            })()}
                                            onChange={(e) => handleDueDateChange(e.target.value)}
                                            className="input input-sm input-bordered rounded-xl text-xs font-medium bg-base-200/50 border-transparent focus:border-primary transition-all w-40"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Description Section */}
                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center gap-2 mb-4 text-base-content/30">
                                    <AlignLeft size={16} strokeWidth={2.5} />
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Context & Description</h3>
                                </div>
                                <div className="bg-base-200/30 rounded-4xl p-6 border border-base-200/50 relative group transition-all focus-within:bg-base-200/50">
                                    <textarea
                                        value={localDescription}
                                        onChange={(e) => setLocalDescription(e.target.value)}
                                        onBlur={handleDescriptionUpdate}
                                        className="w-full text-sm text-base-content/80 leading-relaxed font-medium bg-transparent border-none focus:outline-none resize-none min-h-[120px]"
                                        placeholder="Add a detailed description..."
                                    />
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
                                            <div className="bg-primary/10 text-primary rounded-2xl w-10 h-10 shadow-inner">
                                                <span className="text-sm font-black">{(item as any).assignee?.name?.charAt(0) || 'U'}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-base-content">{(item as any).assignee?.name || 'Unassigned'}</p>
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
                                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString(undefined, {
                                                month: 'long', day: 'numeric', year: 'numeric'
                                            }) : 'N/A'}
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
                                        Last synchronized {item.updatedAt ? new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
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
                            <ChatbotEmbed threadId={item.id?.toString() || ''} />
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
