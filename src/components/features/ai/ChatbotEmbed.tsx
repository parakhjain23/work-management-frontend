'use client';

import { useGetEmbedTokenChatbotQuery } from '@/lib/redux/api/embedApi';
import { useEffect, useRef } from 'react';

interface ChatbotEmbedProps {
    threadId: string;
}

declare global {
    interface Window {
        Chatbot: any;
    }
}

export function ChatbotEmbed({ threadId }: ChatbotEmbedProps) {
    const { data: embedData, isLoading } = useGetEmbedTokenChatbotQuery();
    const containerRef = useRef<HTMLDivElement>(null);
    const scriptLoaded = useRef(false);
    const containerId = `chatbot-container-${threadId}`;

    useEffect(() => {
        if (!embedData?.embedToken) return;

        const initializeChatbot = () => {
            if (window.Chatbot && window.Chatbot.sendData) {
                window.Chatbot.sendData({
                    bridgeName: 'work_manager',
                    threadId: threadId,
                    parentId: containerId,
                    fullScreen: true,
                    hideCloseButton: true,
                    hideIcon: true,
                    defaultOpen: true
                });
            }
        };

        const loadScript = () => {
            if (document.getElementById('chatbot-main-script')) {
                scriptLoaded.current = true;
                initializeChatbot();
                return;
            }

            const script = document.createElement('script');
            script.id = 'chatbot-main-script';
            script.src = 'https://chatbot-embed.viasocket.com/chatbot-prod.js';
            script.setAttribute('embedToken', embedData.embedToken);
            script.setAttribute('bridgeName', 'work_manager');
            script.setAttribute('threadId', threadId);
            script.async = true;
            script.onload = () => {
                scriptLoaded.current = true;
                initializeChatbot();
            };
            document.body.appendChild(script);
        };

        if (scriptLoaded.current) {
            initializeChatbot();
        } else {
            loadScript();
        }
    }, [embedData, threadId, containerId]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-base-content/40">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="text-[10px] font-black uppercase tracking-widest">Initializing AI Sync...</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-base-200/20 overflow-hidden border border-base-200">
            <div id={containerId} className="w-full h-full min-h-[500px]" ref={containerRef} />
        </div>
    );
}
