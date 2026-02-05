'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AutomationList } from '@/components/features/automations/AutomationList';
import { Zap, ChevronRight, Activity, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { AutomationModal } from '@/components/features/automations/AutomationModal';

export default function AutomationsPage() {
    const { orgId } = useParams();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    return (
        <DashboardLayout>
            <div className="space-y-10 pb-10">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-base-content/40">
                    <Link href={`/org/${orgId}`} className="hover:text-primary transition-colors">Dashboard</Link>
                    <ChevronRight size={14} strokeWidth={3} />
                    <span className="text-primary">Settings</span>
                    <ChevronRight size={14} strokeWidth={3} />
                    <span className="text-base-content/80">Automations</span>
                </div>

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                            <span className="w-8 h-[2px] bg-primary"></span>
                            AI Intelligence
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-base-content md:text-5xl flex items-center gap-4">
                            Automations
                            <div className="p-2 bg-primary/10 rounded-2xl text-primary">
                                <Zap size={32} />
                            </div>
                        </h1>
                        <p className="text-base-content/50 font-medium max-w-md">
                            Manage AI-powered workflows and autonomous agents to automate your repetitive tasks.
                        </p>
                    </div>

                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="btn btn-primary btn-md gap-2 px-6 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-bold"
                    >
                        <Plus size={20} strokeWidth={3} />
                        New Automation
                    </button>
                </div>

                {/* Content Section */}
                <div className="relative">
                    {/* Decorative Elements */}
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

                    {/* Main Components */}
                    <AutomationList />
                </div>

                {/* Info Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                    <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10 flex gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                            <Activity size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-primary mb-1">What are Automations?</h4>
                            <p className="text-sm text-base-content/60 leading-relaxed font-medium">
                                Automations allow you to build intelligent reacting workflows.
                                Define logic that executes automatically when events occur.
                            </p>
                        </div>
                    </div>
                    <div className="bg-secondary/5 rounded-3xl p-6 border border-secondary/10 flex gap-4">
                        <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary shrink-0">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-secondary mb-1">AI Intelligence</h4>
                            <p className="text-sm text-base-content/60 leading-relaxed font-medium">
                                Use LLMs to process information, summarize work items, or generate responses
                                without manual intervention.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <AutomationModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
        </DashboardLayout>
    );
}
