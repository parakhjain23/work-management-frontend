'use client';

import { AlertCircle, RefreshCcw } from 'lucide-react';

export function ErrorState({
    message = 'Something went wrong',
    onRetry,
}: {
    message?: string;
    onRetry?: () => void;
}) {
    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
            <div className="p-3 bg-error/10 text-error rounded-full">
                <AlertCircle size={32} />
            </div>
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Error Occurred</h3>
                <p className="text-sm text-base-content/70 max-w-xs">{message}</p>
            </div>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="btn btn-outline btn-sm gap-2"
                >
                    <RefreshCcw size={16} />
                    Try Again
                </button>
            )}
        </div>
    );
}
