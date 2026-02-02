'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetProxyUserQuery } from '@/lib/redux/api/orgApi';
import LoadingScreen from '@/components/layout/LoadingScreen';
import { Building2, ChevronRight, LogOut, Layout } from 'lucide-react';
import Cookies from 'js-cookie';

export default function HomePage() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Check for stored orgId
  useEffect(() => {
    const storedOrgId = localStorage.getItem('selectedOrgId');
    if (storedOrgId) {
      setIsRedirecting(true);
      router.replace(`/org/${storedOrgId}`);
    }
  }, [router]);

  const { data: userData, isLoading, error } = useGetProxyUserQuery(undefined);

  const orgs = userData?.c_companies || [];

  // Handle auto-selection and data loading
  useEffect(() => {
    if (!isLoading && userData && !localStorage.getItem('selectedOrgId')) {
      if (orgs.length === 1) {
        const orgId = orgs[0].id.toString();
        localStorage.setItem('selectedOrgId', orgId);
        router.replace(`/org/${orgId}`);
      }
    }
  }, [isLoading, userData, orgs, router]);

  const handleOrgSelect = (orgId: number) => {
    localStorage.setItem('selectedOrgId', orgId.toString());
    router.replace(`/org/${orgId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('proxy_auth_token');
    localStorage.removeItem('selectedOrgId');
    Cookies.remove('proxy_auth_token');
    router.push('/login');
  };

  if (isLoading || isRedirecting) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100 p-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-error">Session Expired</h2>
          <p className="text-base-content/60">Please log in again to continue.</p>
          <button onClick={handleLogout} className="btn btn-primary">Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-amber-50">
      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-2xl px-6 py-12">
        <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 border border-white/50 overflow-hidden">
          {/* Header */}
          <div className="p-10 pb-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6">
              <Layout size={32} />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-2">
              Welcome back, <span className="text-primary">{userData?.name?.split(' ')[0]}</span>
            </h1>
            <p className="text-gray-500 font-medium text-lg">
              Select an organization to access your workstation
            </p>
          </div>

          {/* Org List */}
          <div className="px-10 pb-10 space-y-4">
            <div className="grid gap-4">
              {orgs.map((org) => (
                <button
                  key={org.id}
                  onClick={() => handleOrgSelect(org.id)}
                  className="group flex items-center justify-between p-6 bg-white border border-gray-100 rounded-[1.5rem] hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 text-left"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <Building2 size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-primary transition-colors">
                        {org.name}
                      </h3>
                      <p className="text-sm text-gray-400 font-medium">Organization ID: #{org.id}</p>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <ChevronRight size={20} />
                  </div>
                </button>
              ))}
            </div>

            {/* Empty State */}
            {orgs.length === 0 && (
              <div className="text-center py-10 px-6 border-2 border-dashed border-gray-100 rounded-3xl">
                <Building2 size={48} className="mx-auto text-gray-200 mb-4" />
                <h3 className="text-lg font-bold text-gray-900">No organizations found</h3>
                <p className="text-gray-400">You haven't been added to any organization yet.</p>
              </div>
            )}

            {/* Actions */}
            <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
              <p className="text-sm text-gray-400 font-medium">
                Not seeing your organization? Contact your admin.
              </p>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-error transition-colors"
                id="logout-button"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
