'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useGetProxyUserQuery } from '@/lib/redux/api/orgApi';
import { Building2, ChevronRight, Info, Save, Settings } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
    const { orgId } = useParams();
    const { data: userData } = useGetProxyUserQuery(undefined);
    const [instructions, setInstructions] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveInstructions = () => {
        setIsSaving(true);
        // Mocking save functionality as backend changes are not allowed
        setTimeout(() => {
            setIsSaving(false);
            toast.success('Organization instructions updated successfully (Mock)');
        }, 1000);
    };

    return (
        <DashboardLayout>
            <div className="space-y-10 pb-10">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-base-content/40">
                    <Link href={`/org/${orgId}`} className="hover:text-primary transition-colors">Dashboard</Link>
                    <ChevronRight size={14} strokeWidth={3} />
                    <span className="text-primary">Settings</span>
                </div>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                            <span className="w-8 h-[2px] bg-primary"></span>
                            Configuration
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-base-content md:text-5xl flex items-center gap-4">
                            Settings
                            <div className="p-2 bg-primary/10 rounded-2xl text-primary">
                                <Settings size={32} />
                            </div>
                        </h1>
                        <p className="text-base-content/50 font-medium max-w-md">
                            Manage your organization's general settings and preferences.
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Settings */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Organization Instructions */}
                        <div className="bg-base-100 rounded-[2.5rem] border border-base-200 p-8 shadow-xl shadow-base-content/5">
                            <h3 className="text-xl font-bold flex items-center gap-3 mb-6">
                                <Info className="text-primary" />
                                Organization Instructions
                            </h3>
                            <p className="text-sm text-base-content/60 mb-4">
                                Provide specific guidelines or context for your organization. These instructions will be used to guide AI analysis and team collaboration.
                            </p>
                            <textarea
                                className="textarea textarea-bordered w-full h-48 rounded-2xl focus:ring-2 focus:ring-primary/20 bg-base-200/50"
                                placeholder="Enter organization guidelines, mission, or specific work item rules..."
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                            ></textarea>
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={handleSaveInstructions}
                                    disabled={isSaving}
                                    className="btn btn-primary btn-md gap-2 px-8 rounded-xl shadow-lg shadow-primary/20"
                                >
                                    {isSaving ? <span className="loading loading-spinner loading-sm"></span> : <Save size={18} />}
                                    Save Instructions
                                </button>
                            </div>
                        </div>

                        {/* Additional Info / Mock Sections */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-base-100 rounded-3xl border border-base-200 p-6 shadow-md">
                                <h4 className="font-bold flex items-center gap-2 mb-2">
                                    <Building2 size={18} className="text-primary" />
                                    Org Details
                                </h4>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-base-content/30">Name</p>
                                        <p className="font-bold text-sm text-base-content/70">{userData?.currentCompany?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-base-content/30">Company ID</p>
                                        <p className="font-mono text-xs text-base-content/50">#{userData?.currentCompany?.id}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-base-100 rounded-3xl border border-base-200 p-6 shadow-md opacity-50">
                                <h4 className="font-bold flex items-center gap-2 mb-2">
                                    <Settings size={18} />
                                    Preferences
                                </h4>
                                <p className="text-xs font-medium">Coming soon: Notification and display preferences.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
