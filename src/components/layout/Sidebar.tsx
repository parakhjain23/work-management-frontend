'use client';

import {
    LayoutDashboard,
    CheckSquare,
    FolderOpen,
    Plus,
    Users,
    Tag,
    Settings
} from 'lucide-react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useGetCategoriesQuery } from '@/lib/redux/api/categoryApi';

export function Sidebar() {
    const params = useParams();
    const pathname = usePathname();
    const orgId = params.orgId;
    const { data: categories } = useGetCategoriesQuery();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: `/org/${orgId}` },
        { icon: FolderOpen, label: 'Manage Categories', href: `/org/${orgId}/categories` },
        { icon: Users, label: 'Members', href: `/org/${orgId}/members` },
        { icon: Settings, label: 'Settings', href: `/org/${orgId}/settings` },
    ];

    return (
        <div className="flex flex-col h-full bg-base-200/50 backdrop-blur-lg w-64 border-r border-base-300 transition-all duration-300">
            <div className="flex items-center gap-3 px-8 py-10">
                <div className="bg-primary p-2 rounded-xl text-primary-content shadow-lg shadow-primary/20">
                    <CheckSquare size={24} strokeWidth={2.5} />
                </div>
                <span className="text-2xl font-black tracking-tighter bg-linear-to-br from-base-content to-base-content/60 bg-clip-text text-transparent">
                    WorkFlow
                </span>
            </div>

            <div className="flex-1 overflow-y-auto px-4 space-y-8 scrollbar-hide">
                <nav className="space-y-2">
                    <div className="px-4 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/30">Main Menu</span>
                    </div>
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group relative active:scale-95 ${isActive ? 'bg-primary text-primary-content shadow-lg shadow-primary/20' : 'hover:bg-base-300'}`}
                            >
                                <item.icon
                                    size={18}
                                    className={`${isActive ? 'text-primary-content' : 'text-base-content/40 group-hover:text-primary'} transition-colors duration-300`}
                                />
                                <span className={`font-bold text-sm ${isActive ? 'text-primary-content' : 'text-base-content/70 group-hover:text-base-content'} transition-colors`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                <nav className="space-y-2">
                    <div className="px-4 mb-2 flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/30">Work Categories</span>
                        <Link href={`/org/${orgId}/categories`} className="p-1 hover:bg-base-300 rounded-lg text-base-content/40 transition-colors">
                            <Plus size={12} strokeWidth={3} />
                        </Link>
                    </div>

                    <div className="space-y-1">
                        {categories?.map((category) => {
                            const categoryHref = `/org/${orgId}/category/${category.id}`;
                            const isActive = pathname === categoryHref;
                            return (
                                <Link
                                    key={category.id}
                                    href={categoryHref}
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group active:scale-95 ${isActive ? 'bg-base-content text-base-100 shadow-md' : 'hover:bg-base-300/60'}`}
                                >
                                    <Tag
                                        size={16}
                                        className={`${isActive ? 'text-base-100' : 'text-base-content/30 group-hover:text-primary'} transition-colors`}
                                    />
                                    <span className={`font-bold text-xs truncate ${isActive ? 'text-base-100' : 'text-base-content/60 group-hover:text-base-content'}`}>
                                        {category.name}
                                    </span>
                                </Link>
                            );
                        })}
                        {(!categories || categories.length === 0) && (
                            <div className="px-4 py-2 text-[10px] italic text-base-content/30">
                                No categories active
                            </div>
                        )}
                    </div>
                </nav>
            </div>

            {/* Back to Org Selector */}

        </div>
    );
}

