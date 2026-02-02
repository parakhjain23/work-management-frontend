export default function LoadingScreen() {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-base-100">
            <h2 className="text-xl font-semibold text-base-content">
                Your time is precious; let us manage the rest.
            </h2>
            <div className="w-full max-w-md px-4">
                <progress className="progress progress-primary w-full"></progress>
            </div>
        </div>
    );
}
