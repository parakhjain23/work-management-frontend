import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { WorkItemList } from '@/components/features/work-items/WorkItemList';
import { Plus, Filter, LayoutGrid, List } from 'lucide-react';

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-10 pb-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
              <span className="w-8 h-[2px] bg-primary"></span>
              Overview
            </div>
            <h1 className="text-4xl font-black tracking-tight text-base-content md:text-5xl">
              Work Items
            </h1>
            <p className="text-base-content/50 font-medium max-w-md">
              Streamline your productivity with our advanced tracking system.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-base-200 p-1 rounded-xl border border-base-300">
              <button className="btn btn-ghost btn-sm px-2 hover:bg-base-100">
                <Filter size={16} className="text-base-content/60" />
              </button>
              <div className="w-[1px] h-4 bg-base-300 mx-1"></div>
              <button className="btn btn-ghost btn-xs rounded-lg bg-base-100 shadow-sm">
                <LayoutGrid size={14} />
              </button>
              <button className="btn btn-ghost btn-xs rounded-lg opacity-40 hover:opacity-100">
                <List size={14} />
              </button>
            </div>

            <button className="btn btn-primary btn-md gap-2 px-6 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-bold">
              <Plus size={20} strokeWidth={3} />
              <span className="hidden sm:inline">New Item</span>
            </button>
          </div>
        </div>

        {/* content Section */}
        <div className="relative">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>
          <WorkItemList />
        </div>
      </div>
    </DashboardLayout>
  );
}
