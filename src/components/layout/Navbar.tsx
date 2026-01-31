'use client';

import { Bell, Search } from 'lucide-react';

export function Navbar() {
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
                        <div className="w-9 rounded-full">
                            <img alt="User avatar" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
                        </div>
                    </div>
                    <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-xl menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-200">
                        <div className="px-4 py-2 border-b border-base-200 mb-2">
                            <p className="font-bold">Felix Jaehn</p>
                            <p className="text-xs text-base-content/60">admin@workflow.com</p>
                        </div>
                        <li><a>Profile</a></li>
                        <li><a>Settings</a></li>
                        <li><a className="text-error">Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
