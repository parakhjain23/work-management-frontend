'use client';

import { Plus, PackageOpen } from 'lucide-react';

export function EmptyState({
    title = 'No items found',
    description = 'There are no items to display at the moment.',
    actionLabel,
    onAction,
}: {
    title?: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
}) {
    return (
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-base-300 rounded-xl space-y-4 text-center">
            <div className="p-4 bg-base-200 text-base-content/40 rounded-full">
                <PackageOpen size={40} />
            </div>
            <div className="space-y-1">
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-base-content/60 max-w-sm">{description}</p>
            </div>
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="btn btn-primary gap-2"
                >
                    <Plus size={18} />
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
