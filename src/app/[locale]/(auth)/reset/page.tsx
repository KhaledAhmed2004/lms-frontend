'use client';

import React, { useState } from 'react';
import { FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');

  const handleResetPassword = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Reset password attempt:', { email });
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

      {/* Reset Password Container */}
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 bg-white">
        <div className="w-full max-w-[696px] space-y-8">
          {/* Heading Section */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Reset Password</h2>
            <p className="text-gray-600 text-sm sm:text-base">Enter the email and we will send you a link to reset your password</p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleResetPassword} className="space-y-6 flex flex-col items-stretch">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 block">
                Email
              </label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-5 border border-gray-300 rounded-lg focus:border-gray-400 focus:ring-0 focus:outline-none"
                required
              />
            </div>

            {/* Request Reset Link Button */}
            <Link href="/otp">
              <button
                type="submit"
                className="w-full bg-[#0B31BD] hover:bg-blue-800 text-white font-semibold py-2.5 rounded-lg text-base transition-colors"
              >
                Request Reset Link
              </button>
            </Link>
          </form>

          {/* Back to Login Link */}
          <div className="text-center">
            <Link href="/login" className="text-[#0B31BD] hover:text-[#0B31BD] font-semibold text-sm">
              Back to login
            </Link>
            </div>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
