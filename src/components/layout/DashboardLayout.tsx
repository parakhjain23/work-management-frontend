'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { QuickAIInput } from '@/components/features/ai/QuickAIInput';
import { WorkItemDetailsSidebar } from '@/components/features/work-items/WorkItemDetailsSidebar';
import { CreateWorkItemModal } from '@/components/features/work-items/CreateWorkItemModal';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    // Only show QuickAIInput on the organization dashboard (root org page)
    const segments = pathname.split('/');
    const isDashboard = segments.length === 3 && segments[1] === 'org';


    return (
        <div className="flex h-screen bg-base-100 overflow-hidden relative">
            <div className="hidden lg:block h-full">
                <Sidebar />
            </div>
            <div className="flex flex-col flex-1 h-full overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-base-100/50">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
            {isDashboard && <QuickAIInput />}
            <WorkItemDetailsSidebar />
            <CreateWorkItemModal />
        </div>
    );
}

