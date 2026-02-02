'use client';

import { Bell, Search, LogOut, Settings, User, Building2 } from 'lucide-react';
import { useGetProxyUserQuery } from '@/lib/redux/api/orgApi';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';

export function Navbar() {
    const { data: userData } = useGetProxyUserQuery(undefined);
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('proxy_auth_token');
        localStorage.removeItem('selectedOrgId');
        Cookies.remove('proxy_auth_token');
        router.push('/login');
    };

    return (
        <div className="navbar bg-base-100/80 backdrop-blur-md border-b border-base-200 px-4 md:px-8 sticky top-0 z-30">
            <div className="flex-1">
                <div className="relative hidden md:flex items-center">
                    <Search className="absolute left-3 text-base-content/40" size={18} />
                    <input
                        type="text"
                        placeholder="Search work items..."
                        className="input input-bordered input-sm pl-10 w-64 focus:outline-primary bg-base-200/50 border-transparent transition-all focus:bg-base-100"
                    />
                </div>
            </div>
            <div className="flex-none gap-2">
                <button className="btn btn-ghost btn-circle">
                    <div className="indicator">
                        <Bell size={20} />
                        <span className="badge badge-xs badge-primary indicator-item"></span>
                    </div>
                </button>

                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border-2 border-primary/20 p-0.5">
                        <div className="w-9 rounded-full bg-base-200 flex items-center justify-center overflow-hidden">
                            <img
                                alt="User avatar"
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.name || 'User'}`}
                            />
                        </div>
                    </div>
                    <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-xl menu menu-sm dropdown-content bg-base-100 rounded-box w-64 border border-base-200">
                        <div className="px-4 py-3 border-b border-base-200 mb-2">
                            <p className="font-bold text-base-content">{userData?.name || 'Felix Jaehn'}</p>
                            <p className="text-xs text-base-content/60 truncate">{userData?.email || 'admin@workflow.com'}</p>
                            <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                                <Building2 size={10} />
                                {userData?.currentCompany?.name || 'No Company'}
                            </div>
                        </div>
                        <li><Link href="/profile" className="py-2.5"><User size={16} /> Profile</Link></li>
                        <li><Link href="/settings" className="py-2.5"><Settings size={16} /> Settings</Link></li>
                        <li><Link href="/" className="py-2.5"><Building2 size={16} /> Switch Organization</Link></li>
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
    );
}

