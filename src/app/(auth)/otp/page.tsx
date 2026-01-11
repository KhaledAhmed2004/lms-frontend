'use client';

import React, { FormEvent, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

const OTPPage = () => {
  const length = 6;
  const [code, setCode] = useState<string[]>(Array(length).fill(''));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const focusInput = (index: number) => {
    const el = inputsRef.current[index];
    if (el) el.focus();
  };

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(0, 1);
    const next = [...code];
    next[index] = digit;
    setCode(next);
    if (digit && index < length - 1) focusInput(index + 1);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (code[index]) {
        const next = [...code];
        next[index] = '';
        setCode(next);
      } else if (index > 0) {
        focusInput(index - 1);
      }
    }
    if (e.key === 'ArrowLeft' && index > 0) focusInput(index - 1);
    if (e.key === 'ArrowRight' && index < length - 1) focusInput(index + 1);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!text) return;
    e.preventDefault();
    const next = Array(length)
      .fill('')
      .map((_, i) => text[i] ?? '');
    setCode(next);
    const lastFilled = Math.min(text.length - 1, length - 1);
    focusInput(lastFilled);
  };

  const handleVerify = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const entered = code.join('');
    console.log('Verify OTP:', entered);
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
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Verify Code</h2>
            <p className="text-gray-600 text-sm sm:text-base">Enter the 6-digit code sent to your email</p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex justify-center gap-2 sm:gap-3">
              {Array.from({ length }).map((_, i) => (
                <Input
                  key={i}
                  ref={(el: HTMLInputElement | null) => { inputsRef.current[i] = el; }}
                  value={code[i]}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  className="w-12 h-12 text-center text-lg sm:text-xl font-semibold border border-gray-300 rounded-lg focus:border-gray-400 focus:ring-0"
                />
              ))}
            </div>

            <div className="flex items-center justify-center w-full">
              <button
                type="button"
                className="text-sm text-[#0B31BD] hover:text-blue-800 font-semibold"
                onClick={() => setCode(Array(length).fill(''))}
              >
                Resend code
              </button>
            </div>

            <Link href="/setnewpassword">
              <button
              type="submit"
              className="w-full bg-[#0B31BD] hover:bg-blue-800 text-white font-semibold py-2.5 rounded-lg text-base transition-colors"
            >
              Verify
            </button>
            </Link>
          </form>

          <div className="text-center">
            <Link href="/login" className="text-[#0B31BD] hover:text-blue-700 font-semibold text-sm">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default OTPPage;
