'use client';

import {
    LayoutDashboard,
    CheckSquare,
    FolderOpen,
    Plus
} from 'lucide-react';
import Link from 'next/link';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: FolderOpen, label: 'Categories', href: '/categories' },
];

export function Sidebar() {
    return (
        <div className="flex flex-col h-full bg-base-200/50 backdrop-blur-lg w-64 border-r border-base-300 transition-all duration-300">
            <div className="flex items-center gap-3 px-8 py-10">
                <div className="bg-primary p-2 rounded-xl text-primary-content shadow-lg shadow-primary/20">
                    <CheckSquare size={24} strokeWidth={2.5} />
                </div>
                <span className="text-2xl font-black tracking-tighter bg-gradient-to-br from-base-content to-base-content/60 bg-clip-text text-transparent">
                    WorkFlow
                </span>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => (
                    <div key={item.label} className="relative">
                        <Link
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 hover:bg-base-300 group relative overflow-hidden active:scale-95"
                        >
                            <item.icon size={20} className="text-base-content/40 group-hover:text-primary transition-colors duration-300" />
                            <span className="font-bold text-sm text-base-content/70 group-hover:text-base-content transition-colors">
                                {item.label}
                            </span>
                            {item.label === 'Dashboard' && (
                                <span className="absolute right-4 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--p),0.6)]"></span>
                            )}
                        </Link>
                        {item.label === 'Categories' && (
                            <button
                                onClick={() => console.log('Create new category')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-primary hover:text-primary-content transition-all duration-200 active:scale-95"
                                title="Create new category"
                            >
                                <Plus size={16} strokeWidth={2.5} />
                            </button>
                        )}
                    </div>
                ))}
            </nav>

        </div>
    );
}
