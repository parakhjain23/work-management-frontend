import { storCurrentUrl } from '@/lib/utils/utils';
import { useRouter, usePathname } from 'next/navigation';

import React, { useEffect } from 'react';
import LoadingScreen from './LoadingScreen';

const WithAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    const ComponentWithAuth = (props: P) => {
        const router = useRouter();
        const pathname = usePathname();

        useEffect(() => {
            const token = localStorage.getItem('proxy_auth_token');
            if (!token && pathname !== '/login') {
                storCurrentUrl();
                router.push('/login');
            }
        }, [pathname, router]);

        const token = typeof window !== 'undefined' ? localStorage.getItem('proxy_auth_token') : null;

        // If we are on the login page, just render the component without auth check
        if (pathname === '/login') {
            return <WrappedComponent {...props} />;
        }

        if (typeof window !== 'undefined' && !token) {
            return <LoadingScreen />;
        }

        return <WrappedComponent {...props} />;
    };

    return ComponentWithAuth;
};

export default WithAuth;


