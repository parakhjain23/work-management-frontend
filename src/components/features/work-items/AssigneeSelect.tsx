import { useState, useEffect, useRef } from "react";
import { User, Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Props = {
    item: any;
    orgUsers: any[];
    handleAssigneeUpdate: (id: string) => void;
};

export default function AssigneeSelect({
    item,
    orgUsers,
    handleAssigneeUpdate,
}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const assignee = orgUsers?.find(
        (u: any) => String(u.id) === String(item.assigneeId)
    );

    const filteredUsers = orgUsers?.filter((u: any) =>
        (u.name || "").toLowerCase().includes(search.toLowerCase())
    ) || [];

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setSelectedIndex((prev) =>
                    prev < filteredUsers.length - 1 ? prev + 1 : prev
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
                break;
            case "Enter":
                e.preventDefault();
                if (filteredUsers[selectedIndex]) {
                    handleAssigneeUpdate(String(filteredUsers[selectedIndex].id));
                    setIsOpen(false);
                }
                break;
            case "Escape":
                e.preventDefault();
                setIsOpen(false);
                break;
        }
    };

    return (
        <div className="relative col-span-1" onKeyDown={handleKeyDown} ref={containerRef}>
            {/* Trigger */}
            <div
                onClick={() => {
                    setIsOpen((v) => !v);
                    setSelectedIndex(0);
                    setSearch("");
                }}
                className="card card-compact bg-base-100 border border-base-200 hover:bg-base-200/50 transition cursor-pointer rounded-2xl"
            >
                <div className="card-body p-4">
                    <div className="flex items-center gap-2 mb-1 text-base-content/40">
                        <User size={14} />
                        <span className="text-[10px] font-medium tracking-wide uppercase">
                            Ownership
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <div
                            className={cn(
                                "avatar placeholder p-0.5 rounded-full",
                                assignee ? "ring-2 ring-primary/10" : "bg-base-200"
                            )}
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold",
                                assignee ? "bg-primary/10 text-primary" : "text-base-content/50"
                            )}>
                                {assignee?.name?.charAt(0) || <User size={14} />}
                            </div>
                        </div>

                        <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">
                                {assignee?.name || "Unassigned"}
                            </p>
                            <p className="text-[11px] text-base-content/40">
                                Responsible person
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 z-50">
                    <div className="card compact bg-base-100 shadow-xl border border-base-200 rounded-xl overflow-hidden">
                        {/* Search */}
                        <div className="p-2 border-b border-base-200">
                            <label className="input input-sm input-bordered flex items-center gap-2 bg-base-200/50">
                                <Search size={14} className="text-base-content/50" />
                                <input
                                    autoFocus
                                    type="text"
                                    className="grow text-xs"
                                    placeholder="Filter people..."
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setSelectedIndex(0);
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </label>
                        </div>

                        {/* List */}
                        <div className="overflow-y-auto overflow-x-hidden custom-scrollbar max-h-64 p-1">
                            {filteredUsers.map((user: any, index: number) => {
                                const isSelected = String(item.assigneeId) === String(user.id);
                                const isHighlighted = index === selectedIndex;

                                return (
                                    <button
                                        key={user.id}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAssigneeUpdate(String(user.id));
                                            setIsOpen(false);
                                        }}
                                        onMouseEnter={() => setSelectedIndex(index)}
                                        className={cn(
                                            "flex items-center gap-2.5 w-full p-2 text-left transition-all rounded-lg mb-1",
                                            isSelected ? "bg-primary/10 text-primary" : "hover:bg-base-200",
                                            isHighlighted && !isSelected ? "bg-base-300/50" : ""
                                        )}
                                    >
                                        <div className="avatar placeholder shrink-0">
                                            <div className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold",
                                                isSelected ? "bg-primary text-primary-content" : "bg-base-300 text-base-content/70"
                                            )}>
                                                {user.name?.charAt(0)}
                                            </div>
                                        </div>

                                        <div className="flex flex-col min-w-0 flex-1">
                                            <span className="font-semibold text-xs truncate leading-tight">
                                                {user.name}
                                            </span>
                                            <span className="text-[10px] text-base-content/50 truncate">
                                                {user.email}
                                            </span>
                                        </div>

                                        {isSelected && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                        )}
                                    </button>
                                );
                            })}

                            {filteredUsers.length === 0 && (
                                <div className="py-6 text-center text-xs text-base-content/40">
                                    <User size={20} className="mx-auto mb-2 opacity-30" />
                                    <span className="font-medium">No people found</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
