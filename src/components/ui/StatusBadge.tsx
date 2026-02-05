import { cn } from '@/lib/utils/cn';
import { WorkItemStatus } from '@/types/work-item';
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

interface StatusBadgeProps {
    status: WorkItemStatus;
    className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    return (
        <div className={cn(
            "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
            status === 'CLOSED' || status === 'ARCHIVED' ? 'bg-success/10 text-success border-success/20' :
                status === 'IN_PROGRESS' || status === 'IN_REVIEW' ? 'bg-primary/10 text-primary border-primary/20' :
                    status === 'DECIDED' || status === 'THINKING' ? 'bg-info/10 text-info border-info/20' :
                        'bg-base-200 text-base-content/40 border-base-300',
            className
        )}>
            {status === 'CLOSED' ? <CheckCircle2 size={12} strokeWidth={3} /> :
                status === 'IN_PROGRESS' || status === 'IN_REVIEW' ? <Clock size={12} strokeWidth={3} /> :
                    <AlertTriangle size={12} strokeWidth={3} />}
            {status}
        </div>
    );
}
