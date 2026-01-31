export function Loading({ message = 'Loading...' }: { message?: string }) {
    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-sm font-medium text-base-content/70">{message}</p>
        </div>
    );
}
