'use client';

import React, { FormEvent, useState } from 'react';
import { Input } from '@/components/ui/input';

const SetNewPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      console.error('Passwords do not match');
      return;
    }
    console.log('Set new password:', { newPassword });
  };

  return (
    <>
      <nav className="bg-[#FBFCFC] h-20 shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="flex items-center justify-center w-full">
            <h1 className="text-3xl font-bold text-[#0B31BD]">Schäfer Tutoring</h1>
          </div>
        </div>
      </nav>

      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 bg-white">
        <div className="w-full max-w-[696px] space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Set New Password</h2>
            <p className="text-gray-600 text-sm sm:text-base">Enter your new password to complete the reset.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 block">New Password</label>
              <Input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-5 border border-gray-300 rounded-lg focus:border-gray-400 focus:ring-0 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 block">Confirm New Password</label>
              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-5 border border-gray-300 rounded-lg focus:border-gray-400 focus:ring-0 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0B31BD] hover:bg-blue-800 text-white font-semibold py-2.5 rounded-lg text-base transition-colors"
            >
              Set Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SetNewPasswordPage;
