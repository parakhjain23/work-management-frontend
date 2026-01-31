import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-base-100 overflow-hidden">
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
        </div>
    );
}
