'use client';

import React, { useState } from 'react';
import { FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { useLogin } from '@/hooks/api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberPassword, setRememberPassword] = useState(false);

  const { mutate: login, isPending } = useLogin();

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    login(
      { email, password },
      {
        onSuccess: () => {
          toast.success('Login successful!');
        },
        onError: (error: any) => {
          const message = error?.getFullMessage?.() || error?.message || 'Login failed. Please try again.';
          toast.error(message);
        },
      }
    );
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-[#FBFCFC] h-20 shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="flex items-center justify-center w-full">
            <h1 className="text-3xl font-bold text-[#0B31BD]">
              Schäfer Tutoring
            </h1>
          </div>
        </div>
      </nav>

      {/* Login Container */}
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 bg-white">
        <div className="w-full max-w-[696px] space-y-8">
          {/* Heading Section */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Hello Again!</h2>
            <p className="text-gray-600 text-sm sm:text-base">Please login to continue</p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleLogin} className="space-y-6 flex flex-col items-stretch">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 block">
                E-Mail
              </label>
              <Input
                type="email"
                placeholder="Enter your E-Mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-5 border border-gray-300 rounded-lg focus:border-gray-400 focus:ring-0 focus:outline-none"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 block">
                Password
              </label>
              <Input
                type="password"
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-5 border border-gray-300 rounded-lg focus:border-gray-400 focus:ring-0 focus:outline-none"
                required
              />
            </div>

            {/* Remember Password & Forgot Password */}
            <div className="flex items-center justify-between w-full gap-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberPassword}
                  onCheckedChange={(checked) => setRememberPassword(checked === true)}
                  className="border-gray-300"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  Remember Me
                </label>
              </div>
              <div>
                <Link href="/reset" className="text-sm text-[#0B31BD] hover:text-[#0B31BD] hover:underline font-medium">
                Forgot Password
              </Link>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#0B31BD] hover:bg-blue-800 text-white font-semibold py-2.5 rounded-lg text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-700 text-sm">
              Don't have an account?{' '}
              <a href="#" className="text-[#0B31BD] hover:text-blue-700 font-semibold">
                 Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
