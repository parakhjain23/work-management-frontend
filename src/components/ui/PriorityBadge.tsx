import { cn } from '@/lib/utils/cn';
import { WorkItemPriority } from '@/types/work-item';
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

interface PriorityBadgeProps {
    priority: WorkItemPriority;
    className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
    const styles = {
        URGENT: 'bg-red-50 text-red-600 border-red-200',
        HIGH: 'bg-amber-50 text-amber-600 border-amber-200',
        MEDIUM: 'bg-blue-50 text-blue-600 border-blue-200',
        LOW: 'bg-slate-50 text-slate-600 border-slate-200'
    };
    const icons = {
        URGENT: AlertCircle,
        HIGH: AlertTriangle,
        MEDIUM: Info,
        LOW: CheckCircle2
    };
    const Icon = icons[priority] || CheckCircle2;

    return (
        <div className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-colors",
            styles[priority] || styles.LOW,
            className
        )}>
            <Icon size={12} strokeWidth={2.5} />
            <span>{priority}</span>
        </div>
    );
}
