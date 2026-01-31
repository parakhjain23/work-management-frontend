'use client';

import { useEffect } from 'react';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import { errorToast, successToast } from '@/app/utils/CustomToasts';
import { ArrowLeft } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export const runtime = 'edge';

declare global {
    interface Window {
        initVerification: (config: any) => void;
    }
}

export default function MembersPage() {
    const router = useRouter();


    // MSG91 Proxy Auth Token
    const PROXY_AUTH_TOKEN = typeof window !== 'undefined' ? localStorage.getItem('proxy_auth_token') : null;

    useEffect(() => {
        if (!PROXY_AUTH_TOKEN) {
            router.push('/login');
            return;
        }

        let script: HTMLScriptElement | null = null;

        if (typeof window !== 'undefined') {
            // Configuration for MSG91 Proxy Auth
            const configuration = {
                authToken: PROXY_AUTH_TOKEN,
                pass: true,
                type: 'user-management',
                theme: 'light',
                success: (data: any) => {
                    console.log('MSG91 Auth success response', data);
                    successToast('Authentication verified successfully!');
                },
                failure: (error: any) => {
                    console.log('MSG91 Auth failure reason', error);
                    errorToast('Authentication failed. Please try again.');
                },
            };

            // Load MSG91 Proxy Auth Script
            script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://proxy.msg91.com/assets/proxy-auth/proxy-auth.js';
            script.onload = function () {
                if (typeof window.initVerification === 'function') {
                    window.initVerification(configuration);
                }
            };
            document.head.appendChild(script);
        }

        return () => {
            if (script && script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, [PROXY_AUTH_TOKEN, router]);

    return (
        <DashboardLayout>
            <Box sx={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'transparent' }}>
                <title>Organization Members | 50Agents</title>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <IconButton onClick={() => router.back()} sx={{ mr: 2, color: 'inherit' }}>
                        <ArrowLeft size={20} />
                    </IconButton>
                    <Typography variant="h5" fontWeight="bold" sx={{ color: 'text.primary' }}>
                        Organization Members
                    </Typography>
                </Box>

                <Paper
                    elevation={0}
                    variant="outlined"
                    sx={{
                        flexGrow: 1,
                        borderRadius: '12px',
                        overflow: 'auto', // Handle overflow within the paper
                        position: 'relative',
                        bgcolor: 'background.paper',
                        p: 0,
                        minHeight: 'calc(100vh - 250px)',
                        border: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    <style
                        dangerouslySetInnerHTML={{
                            __html: `
          /* Ensure the widget container and its ancestors don't clip the dropdowns */
          #userProxyContainer {
            height: 100% !important;
            width: 100% !important;
            min-height: 800px !important; /* Force extra height for dropdowns */
            display: block !important;
          }

          /* Target the specific invite form popup */
          #userProxyContainer div[style*="position: fixed"],
          #userProxyContainer div[style*="position: absolute"] {
            z-index: 99999 !important;
          }

          /* Material UI Dialog/Modal fix if script uses them */
          [class*="MuiPopover-root"], [class*="MuiMenu-root"] {
            z-index: 100000 !important;
          }
        `,
                        }}
                    />
                    <div id="userProxyContainer"></div>
                </Paper>
            </Box>
        </DashboardLayout>
    );
}
