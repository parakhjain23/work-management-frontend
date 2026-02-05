'use client';

import { Search, LogOut, Zap, Building2, Menu } from 'lucide-react';
import { useGetProxyUserQuery } from '@/lib/redux/api/orgApi';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { SearchModal } from '@/components/features/search/SearchModal';

export function Navbar() {
    const { data: userData } = useGetProxyUserQuery(undefined);
    const router = useRouter();
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Keyboard shortcut for search (Cmd+K or Ctrl+K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('proxy_auth_token');
        localStorage.removeItem('selectedOrgId');
        Cookies.remove('proxy_auth_token');
        router.push('/login');
    };

    return (
        <>
            <div className="navbar bg-base-100/80 backdrop-blur-md border-b border-base-200 px-4 md:px-8 sticky top-0 z-30">
                <div className="flex-1">
                    <label htmlFor="my-drawer-2" className="btn btn-ghost drawer-button lg:hidden px-2">
                        <Menu size={20} />
                    </label>
                </div>
                <div className="flex-none flex items-center gap-2">
                    {/* Search Trigger */}
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="btn btn-ghost bg-base-200/50 hover:bg-base-200 border border-base-300 hover:border-base-content/20 font-normal gap-2 h-10 min-h-0 w-64 justify-between px-3 md:flex hidden animate-fadeIn"
                    >
                        <div className="flex items-center gap-2 text-base-content/50">
                            <Search size={16} />
                            <span className="text-sm">Search...</span>
                        </div>
                        <span className="flex items-center gap-1 text-[10px] font-medium opacity-50">
                            <kbd className="kbd kbd-xs bg-base-100 border-base-content/20 font-sans">⌘K</kbd>
                        </span>
                    </button>

                    {/* Mobile Search Icon */}
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="btn btn-ghost btn-circle md:hidden"
                    >
                        <Search size={20} />
                    </button>

                    {/* Profile Dropdown */}
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border-2 border-primary/20 p-0.5">
                            <div className="w-9 rounded-full bg-base-200 flex items-center justify-center overflow-hidden">
                                <img
                                    alt="User avatar"
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.name || 'User'}`}
                                />
                            </div>
                        </div>
                        <ul tabIndex={0} className="mt-3 z-1 p-2 shadow-xl menu menu-sm dropdown-content bg-base-100 rounded-box w-64 border border-base-200">
                            <div className="px-4 py-3 border-b border-base-200 mb-2">
                                <p className="font-bold text-base-content">{userData?.name || 'Felix Jaehn'}</p>
                                <p className="text-xs text-base-content/60 truncate">{userData?.email || 'admin@workflow.com'}</p>
                                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                                    <Building2 size={10} />
                                    {userData?.currentCompany?.name || 'No Company'}
                                </div>
                            </div>
                            <li><Link href={`/org/${userData?.currentCompany?.id}/automations`} className="py-2.5"><Zap size={16} /> Automations</Link></li>
                            <li>
                                <button onClick={() => {
                                    localStorage.removeItem('selectedOrgId');
                                    router.push('/');
                                }} className="py-2.5 text-base-content">
                                    <Building2 size={16} /> Switch Organization
                                </button>
                            </li>
                            <div className="divider my-1"></div>
                            <li>
                                <button onClick={handleLogout} className="text-error py-2.5 hover:bg-error/10">
                                    <LogOut size={16} /> Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Search Modal */}
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
