'use client';

import React, { useState } from 'react';
import { FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { AuthNavbar } from '@/components/auth-navbar';
import { Link } from '@/i18n/routing';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');

  const handleResetPassword = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Reset password attempt:', { email });
  };
  return (
    <>
      <AuthNavbar />

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
