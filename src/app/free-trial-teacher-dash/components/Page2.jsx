"use client";
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

const Page2 = () => {
  const [step, setStep] = useState(2);
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 10)); // November 2025
  const [selectedDate, setSelectedDate] = useState(18);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:00am - 11:00am');

  const timeSlots = [
    '10:00am - 11:00am',
    '11:00am - 12:00pm',
    '12:00pm - 1:00pm',
    '2:00pm - 3:00pm',
    '3:00pm - 4:00pm'
  ];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMonthName = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const prevMonthDays = getDaysInMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    
    const days = [];
    
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true
      });
    }
    
    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false
      });
    }
    
    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Application Card */}
        <div className="rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Teacher Application Progress</h2>

          {/* Progress Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-2.5 left-0 right-0 h-2 rounded-3xl bg-gray-300 z-0"></div>

              <div 
                className="absolute top-2.5 left-0 h-2 rounded-3xl bg-[#0B31BD] z-10 transition-all duration-700 ease-in-out"
                style={{
                  width: 
                    window.innerWidth <= 640 
                      ? (step === 1 ? "15%" : step === 2 ? "55%" : "95%")
                      : window.innerWidth <= 768
                        ? (step === 1 ? "12%" : step === 2 ? "52%" : "92%")
                        : (step === 1 ? "8%" : step === 2 ? "52%" : "95%")
                }}
              ></div>

              {/* Step 1 */}
              <div className="flex flex-col items-center relative z-10">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold mb-2 bg-[#0B31BD]">
                  <Check className="w-5 h-5" />
                </div>
                <span className="text-sm text-center text-gray-700">
                  Application Review
                </span>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center relative z-10">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold mb-2 bg-[#0B31BD]">
                </div>
                <span className="text-sm text-center text-gray-700">
                  Interview
                </span>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center relative z-10">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold mb-2 bg-gray-300">
                </div>
                <span className="text-sm text-center text-gray-600">
                  Profile Setup
                </span>
              </div>
            </div>
          </div>

          {/* Status Message */}
          <div className="border bg-[#FFF4E6] border-[#FFB800] rounded-lg p-4">
            <p className="font-semibold text-gray-800">Your Application has been approved for the interview phase</p>
            <p className="text-sm text-gray-600 mt-1">Please Select an available interview slot.</p>
          </div>
        </div>

        {/* Schedule Interview Card */}
        <div className="rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-8">Schedule Interview</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Calendar Section */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-4">Date</p>
              
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handlePrevMonth}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <span className="font-semibold text-gray-800">{getMonthName(currentMonth)}</span>
                <button
                  onClick={handleNextMonth}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="border border-gray-200 rounded-lg p-3">
                {/* Week Days */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {weekDays.map((day) => (
                    <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((dayObj, idx) => (
                    <button
                      key={idx}
                      onClick={() => dayObj.isCurrentMonth && setSelectedDate(dayObj.day)}
                      className={`py-2 rounded-lg text-sm font-medium transition-all ${
                        !dayObj.isCurrentMonth
                          ? 'text-gray-400 cursor-not-allowed'
                          : selectedDate === dayObj.day
                            ? 'bg-[#0B31BD] text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {dayObj.day}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Time Slots Section */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-4">Available Time Slots</p>
              
              <div className="space-y-3">
                {timeSlots.map((slot) => (
                  <label
                    key={slot}
                    className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedTimeSlot === slot
                        ? 'border-[#0B31BD] bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="timeSlot"
                      value={slot}
                      checked={selectedTimeSlot === slot}
                      onChange={(e) => setSelectedTimeSlot(e.target.value)}
                      className="w-4 h-4 accent-[#0B31BD] cursor-pointer"
                    />
                    <span className="text-sm font-medium text-gray-800">{slot}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Schedule Button */}
          <button className="w-full mt-8 px-6 py-3 bg-[#0B31BD] text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors">
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page2;