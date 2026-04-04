"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

const faqs = [
  {
    question: "How does online tutoring work?",
    answer:
      "All lessons are conducted on an integrated online meeting platform. Tutor and student collaborate in a secure digital room using interactive whiteboards for writing, drawing, and sharing tasks. Teaching takes place live and is individually tailored to the student's learning goals.",
  },
  {
    question: "Which subjects and grade levels are offered?",
    answer: "A wide range of school subjects from grades 1–13 is available. This includes Math, English, German, Sciences, Languages and more.",
  },
  {
    question: "How are tutors selected?",
    answer:
      "All tutors undergo a structured two-step screening process. Qualifications, teaching experience, and pedagogical skills are reviewed. Only applicants who demonstrate clear communication and strong individual support are accepted.",
  },
  {
    question: "Can sessions be rescheduled or cancelled?",
    answer:
      "Sessions can be rescheduled or cancelled free of charge up to 10 minutes before the scheduled start time.",
  },
  {
    question: "How long is a typical lesson?",
    answer:
      "A standard lesson lasts 60 minutes. This duration has proven effective for achieving consistent academic progress.",
  },
  {
    question: "What equipment is required?",
    answer:
      "Only basic equipment is needed: laptop, tablet, or smartphone; stable internet connection; microphone; optional camera. No additional software installation is necessary.",
  },
  {
    question: "Can tutors be changed if needed?",
    answer:
      "A tutor change is possible at any time if the match is not optimal. In such cases, an alternative tutor is recommended.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-[#F7F7F7] py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-11">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B31BD]">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 mt-[15px] text-base sm:text-lg">
            Everything you need to know about our online tutoring.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-[11px] shadow-sm border-2 border-[#85C2DE] overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-gray-900 text-sm sm:text-base pr-4 text-left">
                    {faq.question}
                  </span>
                  <Plus
                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                  style={{
                    transition:
                      "max-height 0.5s ease-in-out, opacity 0.4s ease-in-out, padding 0.5s ease-in-out",
                  }}
                >
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-2">
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}