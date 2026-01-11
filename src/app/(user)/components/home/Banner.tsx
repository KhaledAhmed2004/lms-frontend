/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import PrimaryButton from '@/components/button/PrimaryButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const bannerData = {
  title: 'Find the online tutor that fits your needs',
  description: 'Tell us what you need - we\'ll find the perfect tutor for you.',
  buttons: [
    { text: 'Select Subject', type: 'primary', href: null },
    { text: 'Book free trial', type: 'secondary', href: '/free-trial-student' },
  ],
};

const subjects = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'History',
  'Geography',
  'Computer Science',
  'Economics',
  'Psychology',
];

const Banner = () => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  return (
    <div className="bg-linear-to-r from-[#0B31BD] to-[#4B71FF] relative overflow-hidden">
      <div className="max-w-7xl mx-auto h-full md:h-[749px] flex items-center relative px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full py-12 md:py-0">

          {/* LEFT */}
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {bannerData.title}
            </h1>

            <p className="text-base sm:text-lg text-blue-100 leading-relaxed mb-10 md:mb-[77px]">
              {bannerData.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {/* Select Subject Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-white text-lg hover:bg-white text-[#150B20] w-full h-[50px] rounded-[12px] sm:w-auto min-w-[200px] flex items-center justify-center gap-4">
                    {selectedSubject || 'Select Subject'}
                    <ChevronDown size={22} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {subjects.map((subject) => (
                    <DropdownMenuItem
                      key={subject}
                      onClick={() => setSelectedSubject(subject)}
                      className="cursor-pointer"
                    >
                      {subject}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Book Free Trial Button */}
              <PrimaryButton
                className="bg-transparent border-2 hover:bg-transparent text-white w-full sm:w-auto min-w-[200px]"
                name="Book Free Trial"
                href={
                  selectedSubject
                    ? `/free-trial-student?subject=${encodeURIComponent(
                        selectedSubject
                      )}`
                    : "/free-trial-student"
                }
              />
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="hidden md:block absolute right-0 bottom-0">
            <img
              src="/images/home/bannerimg.png"
              alt="Girl student"
              className="w-[350px] lg:w-[466px] h-full object-cover object-bottom"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Banner;