'use client';

import Cookies from 'js-cookie';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useLayoutEffect, useState } from 'react';

function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const proxy_auth_token = searchParams.get('proxy_auth_token') as string | undefined;
  const autoClose = (searchParams.get('autoclose')?.toLowerCase() === 'true') as boolean;
  const state = JSON.parse(searchParams.get('state') || '{}');

  async function runEffect() {
    if (localStorage.getItem('proxy_auth_token')) {
      // Check for stored redirect URL first
      const redirectUrl = localStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin');
        router.push(redirectUrl);
        return;
      }

      router.push('/');
      return;
    }

    if (proxy_auth_token) {
      setLoading(true);
      localStorage.setItem('proxy_auth_token', proxy_auth_token);
      Cookies.set('proxy_auth_token', proxy_auth_token, { expires: 365 });
      if (state.autoClose) {
        window.close();
      } else {
        // Check for stored redirect URL first
        const redirectUrl = localStorage.getItem('redirectAfterLogin');
        if (redirectUrl) {
          localStorage.removeItem('redirectAfterLogin');
          router.push(redirectUrl);
        } else {
          router.push('/');
        }
      }
      setLoading(false);
      return;
    }

    // If the user has not logged in, redirect the user to the login page
    const configuration = {
      referenceId: '870623k177027341669843a88950ba',
      state: JSON.stringify({ autoClose }),
      theme: 'light',
      addInfo: {
        redirect_path: '/login',
      },
      success: (data: any) => {
        // Called when the user is successfully authenticated
        // Get the verified token in response
        console.dir('success response', data);
      },
      failure: (error: Error) => {
        // Called when there is an error
        // Handle the error
        console.error('failure reason', error);
      },
    };

    // Load the login script from msg91
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.onload = () => {
      const checkInitVerification = setInterval(() => {
        if (typeof (window as any).initVerification === 'function') {
          clearInterval(checkInitVerification);
          (window as any).initVerification(configuration); // Initialize the login
        }
      }, 100);
    };
    script.src = 'https://proxy.msg91.com/assets/proxy-auth/proxy-auth.js';
    document.body.appendChild(script); // Add the script to the page
  }

  useLayoutEffect(() => {
    runEffect();
  }, []);

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-amber-50/30 via-white to-orange-50/20">
      {/* Left: Image Section */}
      <div className="hidden lg:flex w-1/2 items-center justify-center p-12 relative overflow-hidden rounded-r-4xl border-r-4 border-gray-100">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-orange-100/30 to-amber-100/40"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl"></div>

        {/* SVG Image */}
        <div className="relative z-10 w-full max-w-2xl">
          <Image
            src="/login-banner.svg"
            alt="Work Management Illustration"
            width={800}
            height={600}
            priority
            className="w-full h-auto drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Right: Login Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {loading ? (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 opacity-20 animate-pulse absolute"></div>
                  <Loader2 className="w-20 h-20 text-yellow-500 animate-spin relative" strokeWidth={2} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-800">Signing you in</h2>
                  <p className="text-sm text-gray-500">
                    Authenticating your account...
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 flex flex-col items-center">
              {/* Header - Outside Card */}
              <div className="space-y-3">
                <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
                  Work Management
                </h1>
                <p className="text-lg text-gray-600">
                  Streamline your workflow, achieve more together
                </p>
              </div>

              {/* Main Content Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 p-4">
                {/* Auth Form Container */}
                <div className="flex justify-center">
                  {/* MSG91 Auth Widget */}
                  <div
                    id="870623k177027341669843a88950ba"
                  />
                </div>
                {/* Security Badge */}
                <div className="flex items-center justify-center pt-4">
                  <p className="text-xs text-gray-400">
                    🔒 Secure authentication • End-to-end encrypted
                  </p>
                </div>
              </div>
            </div>

          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-amber-50/30 via-white to-purple-50/20">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 opacity-20 animate-pulse absolute"></div>
              <Loader2 className="w-20 h-20 text-yellow-500 animate-spin relative" strokeWidth={2} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-gray-800">Loading...</h2>
              <p className="text-sm text-gray-500">Preparing your login experience</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <Login />
    </Suspense>
  );
}
