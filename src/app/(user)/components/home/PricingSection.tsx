"use client";

import { useState } from "react";
import PrimaryButton from "@/components/button/PrimaryButton";

const pricingPlans = [
  {
    id: 1,
    name: "Flexible",
    pricePerHour: "30€",
    courseDuration: "None",
    selectedHours: "Flexible number of sessions",
    selectedHoursDetails: "No minimum requirement",
    termType: "Flexible",
    inclusions: ["Shortterm support", "Exam preparation"],
  },
  {
    id: 2,
    name: "Regular",
    pricePerHour: "28€",
    courseDuration: "1 Month",
    selectedHours: "Flexible number of sessions",
    selectedHoursDetails: "Min. 4 hours per month",
    termType: "Flexible or recurring",
    inclusions: ["Homework support,", "continuous learning"],
  },
  {
    id: 3,
    name: "Longterm",
    pricePerHour: "25€",
    courseDuration: "3 Months",
    selectedHours: "Flexible number of sessions",
    selectedHoursDetails: "Min. 4 hours per month",
    termType: "Flexibel oder regelmäßig",
    inclusions: ["Longterm support", "foundation building"],
  },
];

export default function PricingSection() {
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0);

  return (
    <section className="bg-[#F7F7F7] py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mt-0">
          <h2 className="text-4xl md:text-[44px] font-bold text-[#0B31BD] mt-20 mb-[15px]">
            Pricing
          </h2>
          <p className="text-[#061651] text-lg mb-[43px]">
            Our plans are designed to adapt to you, flexible, fair, and suited
            to your current situation.
          </p>
        </div>

        {/* Mobile View */}
        <div className="md:hidden mb-12">
          <div className="space-y-6">
            <div className="flex gap-3 overflow-x-auto pb-2 px-4 sm:px-0">
              {pricingPlans.map((plan, index) => (
                <button
                  key={plan.id}
                  onClick={() => setCurrentPlanIndex(index)}
                  className={`flex-shrink-0 px-5 py-2 rounded-2xl font-semibold transition-all min-w-[100px] text-center ${
                    index === currentPlanIndex
                      ? "bg-[#0B31BD] text-white"
                      : "bg-white border-2 border-gray-200 text-gray-900"
                  }`}
                >
                  <div className="text-sm">{plan.name}</div>
                </button>
              ))}
            </div>

            <div className="bg-white border border-gray-200 rounded-[28px] p-6 space-y-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Price per hour</p>
                <p className="text-3xl font-bold text-gray-900">
                  {pricingPlans[currentPlanIndex].pricePerHour}
                </p>
              </div>
              <hr className="border-t border-gray-200" />
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">Scheduling</p>
                <p className="text-sm font-semibold text-gray-900">
                  {pricingPlans[currentPlanIndex].termType}
                </p>
              </div>
              <hr className="border-t border-gray-200" />
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">Sessions</p>
                <div className="text-right">
                  <p className="text-xs font-semibold text-gray-900">
                    {pricingPlans[currentPlanIndex].selectedHours}
                  </p>
                  <p className="text-xs font-semibold text-gray-900 mt-1">
                    {pricingPlans[currentPlanIndex].selectedHoursDetails}
                  </p>
                </div>
              </div>
              <hr className="border-t border-gray-200" />
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">Duration</p>
                <p className="text-sm font-semibold text-gray-900">
                  {pricingPlans[currentPlanIndex].courseDuration}
                </p>
              </div>
              <hr className="border-t border-gray-200" />
              <div className="flex justify-between text-right">
                <p className="text-sm text-gray-600 mb-3">Recommended for</p>
                <ul className="space-y-2">
                  {pricingPlans[currentPlanIndex].inclusions.map((inclusion, idx) => (
                    <li key={idx} className="text-xs font-semibold text-gray-900">
                      {inclusion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-10 mb-8 md:mb-[65px]">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white border border-gray-200 p-6 rounded-[28px] overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col h-full"
            >
              <div className="bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#6366F1] text-white px-4 py-3 rounded-lg mb-6">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
              </div>

              <div className="space-y-4 flex-1">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Price per hour</p>
                  <p className="text-2xl font-bold text-gray-900">{plan.pricePerHour}</p>
                </div>
                <hr className="border-t border-[#F4F6F9]" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Duration</p>
                  <p className="text-sm font-semibold text-gray-900">{plan.courseDuration}</p>
                </div>
                <hr className="border-t border-[#F4F6F9]" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Sessions</p>
                  <p className="text-sm font-semibold text-gray-900">{plan.selectedHours}</p>
                  <p className="text-sm text-gray-900 font-semibold mt-1">
                    {plan.selectedHoursDetails}
                  </p>
                </div>
                <hr className="border-t border-[#F4F6F9]" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Scheduling</p>
                  <p className="text-sm font-semibold text-gray-900">{plan.termType}</p>
                </div>
                <hr className="border-t border-[#F4F6F9]" />
                <div>
                  <p className="text-xs text-gray-500 mb-2">Recommended for</p>
                  <ul className="space-y-1">
                    {plan.inclusions.map((inclusion, idx) => (
                      <li key={idx} className="text-sm font-semibold text-gray-900">
                        {inclusion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mb-20">
          <PrimaryButton
            className="w-full md:w-[368px]"
            href="/free-trial-student"
            name="Try for free"
          />
        </div>
      </div>
    </section>
  );
}