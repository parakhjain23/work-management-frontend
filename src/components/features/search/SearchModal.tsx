'use client';

import { Search, X } from 'lucide-react';
import { useSearchWorkItemsQuery } from '@/lib/redux/api/workItemApi';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { selectWorkItem } from '@/lib/redux/features/uiSlice';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch search results
    const { data: searchResults = [], isLoading } = useSearchWorkItemsQuery(
        { query: debouncedQuery, limit: 20 },
        { skip: debouncedQuery.length < 2 }
    );

    console.log(searchResults, 'search')

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Escape to close
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const handleWorkItemClick = (workItem: any) => {
        // Don't close modal or clear search - keep state
        dispatch(selectWorkItem(workItem));
    };

    const handleClose = () => {
        onClose();
    };

    const handleClearAndClose = () => {
        setSearchQuery('');
        setDebouncedQuery('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 animate-fadeIn"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-60 flex items-start justify-center pt-[15vh] pointer-events-none">
                <div
                    className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 pointer-events-auto animate-slideDown border border-base-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Search Input */}
                    <div className="flex items-center gap-3 px-6 py-4 border-b border-base-200">
                        <Search className="text-base-content/40 shrink-0" size={20} />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search work items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-base placeholder:text-base-content/40"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="btn btn-ghost btn-sm btn-circle"
                            >
                                <X size={16} />
                            </button>
                        )}
                        <kbd className="kbd kbd-sm hidden sm:inline-flex">ESC</kbd>
                    </div>

                    {/* Search Results */}
                    <div className="max-h-[60vh] overflow-y-auto">
                        {searchQuery.length < 2 ? (
                            <div className="p-12 text-center">
                                <Search className="mx-auto mb-4 text-base-content/20" size={48} />
                                <p className="text-base-content/60 text-sm">
                                    Type at least 2 characters to search
                                </p>
                                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-base-content/40">
                                    <span>Press</span>
                                    <kbd className="kbd kbd-xs">⌘</kbd>
                                    <span>+</span>
                                    <kbd className="kbd kbd-xs">K</kbd>
                                    <span>to search anytime</span>
                                </div>
                            </div>
                        ) : isLoading ? (
                            <div className="p-12 text-center">
                                <span className="loading loading-spinner loading-lg text-primary"></span>
                                <p className="mt-4 text-base-content/60 text-sm">Searching...</p>
                            </div>
                        ) : searchResults.length > 0 ? (
                            <div className="py-2">
                                <div className="px-4 py-2 text-xs font-semibold text-base-content/60 uppercase tracking-wider">
                                    {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                                </div>
                                <ul className="menu menu-sm px-2 w-full">
                                    {searchResults.map((item) => (
                                        <li key={item.id} className='border-b-2 border-base-300'>
                                            <button
                                                onClick={() => handleWorkItemClick(item)}
                                                className="w-full flex flex-col items-start py-4 px-4 rounded-lg hover:bg-base-200 transition-colors group text-left"
                                            >
                                                <div className="flex items-start justify-between w-full gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-semibold text-base-content group-hover:text-primary transition-colors">
                                                            {item.title}
                                                        </div>
                                                        {item.description && (
                                                            <div className="text-xs text-base-content/60 line-clamp-2 mt-1">
                                                                {item.description}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 mt-3 items-center">
                                                    <PriorityBadge priority={item.priority} className="text-[10px]" />
                                                    <StatusBadge status={item.status} className="text-[10px]" />
                                                    {item.category && (
                                                        <span className="badge badge-xs badge-outline">
                                                            {item.category.name}
                                                        </span>
                                                    )}
                                                </div>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <div className="text-6xl mb-4">🔍</div>
                                <p className="text-base-content/60 text-sm">
                                    No results found for <span className="font-semibold">"{searchQuery}"</span>
                                </p>
                                <p className="text-base-content/40 text-xs mt-2">
                                    Try different keywords
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-3 border-t border-base-200 bg-base-200/30">
                        <div className="flex items-center justify-between text-xs text-base-content/60">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <kbd className="kbd kbd-xs">↑</kbd>
                                    <kbd className="kbd kbd-xs">↓</kbd>
                                    <span>Navigate</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <kbd className="kbd kbd-xs">↵</kbd>
                                    <span>Select</span>
                                </div>
                            </div>
                            <button
                                onClick={handleClearAndClose}
                                className="text-base-content/60 hover:text-base-content transition-colors"
                            >
                                Clear & Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                .animate-slideDown {
                    animation: slideDown 0.3s ease-out;
                }
            `}</style>
        </>
    );
}
