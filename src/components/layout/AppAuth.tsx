'use client';

import React from 'react';
import WithAuth from './WithAuth';

interface AppAuthProps {
    children: React.ReactNode;
}

const AppAuthComponent: React.FC<AppAuthProps> = ({ children }) => {
    return <>{children}</>;
};

const AppAuth = WithAuth(AppAuthComponent);

export default AppAuth;
