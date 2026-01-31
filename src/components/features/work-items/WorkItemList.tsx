'use client';

import { WorkItem } from '@/types/work-item';
import { Clock, CheckCircle2, AlertTriangle, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

// Dummy work items data
const dummyWorkItems: WorkItem[] = [
    {
        id: '1',
        title: 'Design System Implementation',
        description: 'Create a comprehensive design system with reusable components and style guidelines.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        assigneeId: '1',
        assignee: {
            id: '1',
            name: 'Sarah Johnson',
            email: 'sarah@workflow.com',
        },
        creatorId: '1',
        creator: {
            id: '1',
            name: 'Sarah Johnson',
            email: 'sarah@workflow.com',
        },
        createdAt: new Date('2026-01-15').toISOString(),
        updatedAt: new Date('2026-01-25').toISOString(),
    },
    {
        id: '2',
        title: 'API Documentation',
        description: 'Write comprehensive API documentation for all endpoints with examples and use cases.',
        status: 'TODO',
        priority: 'MEDIUM',
        assigneeId: '2',
        assignee: {
            id: '2',
            name: 'Mike Chen',
            email: 'mike@workflow.com',
        },
        creatorId: '1',
        creator: {
            id: '1',
            name: 'Sarah Johnson',
            email: 'sarah@workflow.com',
        },
        createdAt: new Date('2026-01-20').toISOString(),
        updatedAt: new Date('2026-01-20').toISOString(),
    },
    {
        id: '3',
        title: 'Database Migration',
        description: 'Migrate legacy database to new PostgreSQL schema with zero downtime.',
        status: 'DONE',
        priority: 'URGENT',
        assigneeId: '3',
        assignee: {
            id: '3',
            name: 'Emma Davis',
            email: 'emma@workflow.com',
        },
        creatorId: '2',
        creator: {
            id: '2',
            name: 'Mike Chen',
            email: 'mike@workflow.com',
        },
        createdAt: new Date('2026-01-10').toISOString(),
        updatedAt: new Date('2026-01-28').toISOString(),
    },
    {
        id: '4',
        title: 'User Authentication Refactor',
        description: 'Refactor authentication system to support OAuth2.0 and multi-factor authentication.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        assigneeId: '1',
        assignee: {
            id: '1',
            name: 'Sarah Johnson',
            email: 'sarah@workflow.com',
        },
        creatorId: '3',
        creator: {
            id: '3',
            name: 'Emma Davis',
            email: 'emma@workflow.com',
        },
        createdAt: new Date('2026-01-22').toISOString(),
        updatedAt: new Date('2026-01-30').toISOString(),
    },
    {
        id: '5',
        title: 'Performance Optimization',
        description: 'Optimize application performance by implementing caching and lazy loading.',
        status: 'TODO',
        priority: 'LOW',
        assigneeId: '2',
        assignee: {
            id: '2',
            name: 'Mike Chen',
            email: 'mike@workflow.com',
        },
        creatorId: '1',
        creator: {
            id: '1',
            name: 'Sarah Johnson',
            email: 'sarah@workflow.com',
        },
        createdAt: new Date('2026-01-18').toISOString(),
        updatedAt: new Date('2026-01-18').toISOString(),
    },
    {
        id: '6',
        title: 'Mobile Responsive Design',
        description: 'Ensure all pages are fully responsive and optimized for mobile devices.',
        status: 'DONE',
        priority: 'MEDIUM',
        assigneeId: '3',
        assignee: {
            id: '3',
            name: 'Emma Davis',
            email: 'emma@workflow.com',
        },
        creatorId: '2',
        creator: {
            id: '2',
            name: 'Mike Chen',
            email: 'mike@workflow.com',
        },
        createdAt: new Date('2026-01-12').toISOString(),
        updatedAt: new Date('2026-01-29').toISOString(),
    },
];

import { useGetWorkItemsQuery } from '@/lib/redux/api/workItemApi';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';

export function WorkItemList() {
    const { data: workItems, isLoading, isError, error, refetch } = useGetWorkItemsQuery();

    if (isLoading) {
        return (
            <div className="flex flex-col gap-3">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-20 bg-base-200/50 animate-pulse rounded-2xl w-full"></div>
                ))}
            </div>
        );
    }

    if (isError) {
        return <ErrorState message={(error as any)?.data?.message || 'Failed to load work items'} onRetry={refetch} />;
    }

    if (!workItems || workItems.length === 0) {
        return <EmptyState title="No Work Items" description="Ready to start something new? Create your first work item to get started." actionLabel="New Work Item" onAction={() => { }} />;
    }

    return (
        <div className="flex flex-col gap-1 page-fade-in">
            <div className="hidden md:flex items-center px-6 py-4 text-[10px] font-black uppercase tracking-widest text-base-content/20 border-b border-base-200/50 mb-2">
                <div className="flex-[2]">Work Item</div>
                <div className="flex-1">Status</div>
                <div className="flex-1">Priority</div>
                <div className="flex-1">Assignee</div>
                <div className="w-32 text-right">Created</div>
            </div>

            <div className="flex flex-col gap-2">
                {workItems.map((item) => (
                    <div
                        key={item.id}
                        className="group flex flex-col md:flex-row md:items-center gap-4 bg-base-100 hover:bg-base-200/50 p-4 md:px-6 md:py-4 rounded-2xl border border-base-200 transition-all duration-200 hover:shadow-lg hover:shadow-base-300/10 active:scale-[0.99]"
                    >
                        {/* Title & Description */}
                        <div className="flex-[2] min-w-0">
                            <h3 className="text-base font-bold text-base-content group-hover:text-primary transition-colors truncate">
                                {item.title}
                            </h3>
                            <p className="text-xs text-base-content/50 line-clamp-1 mt-0.5 font-medium">
                                {item.description}
                            </p>
                        </div>

                        {/* Status */}
                        <div className="flex-1 flex items-center">
                            <div className={cn(
                                "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                item.status === 'DONE' ? 'bg-success/10 text-success border-success/20' :
                                    item.status === 'IN_PROGRESS' ? 'bg-primary/10 text-primary border-primary/20' :
                                        'bg-base-200 text-base-content/40 border-base-300'
                            )}>
                                {item.status === 'DONE' ? <CheckCircle2 size={12} strokeWidth={3} /> :
                                    item.status === 'IN_PROGRESS' ? <Clock size={12} strokeWidth={3} /> : <AlertTriangle size={12} strokeWidth={3} />}
                                {item.status}
                            </div>
                        </div>

                        {/* Priority */}
                        <div className="flex-1">
                            <span className={cn(
                                "badge badge-xs uppercase font-black tracking-widest px-2 py-2 text-[9px]",
                                item.priority === 'URGENT' ? 'badge-error text-error-content' :
                                    item.priority === 'HIGH' ? 'badge-warning text-warning-content' :
                                        item.priority === 'MEDIUM' ? 'badge-info text-info-content' : 'badge-neutral'
                            )}>
                                {item.priority}
                            </span>
                        </div>

                        {/* Assignee */}
                        <div className="flex-1 flex items-center gap-3">
                            <div className="avatar placeholder ring-1 ring-primary/20 rounded-full">
                                <div className="bg-neutral text-neutral-content rounded-full w-6 shadow-inner">
                                    <span className="text-[10px] font-bold">{item.assignee?.name?.charAt(0) || 'U'}</span>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-base-content/70">{item.assignee?.name || 'Unassigned'}</span>
                        </div>

                        {/* Date */}
                        <div className="w-32 md:text-right flex items-center md:justify-end gap-2 text-base-content/40 text-[10px] font-bold uppercase tracking-tight">
                            <Calendar size={12} />
                            {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
