"use client";
import React, { useState } from 'react';
import { Plus, Paperclip, Send } from 'lucide-react';

export default function SupportPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketMessage, setTicketMessage] = useState('');

  const faqs = [
    {
      id: 'faq1',
      question: 'How do I schedule a tutoring session?',
      answer: 'To schedule a tutoring session, navigate to the Sessions tab, click on "Schedule New Session", select your preferred date and time, choose the subject and student level, and confirm the booking. You will receive a confirmation email with all the details.',
    },
    {
      id: 'faq2',
      question: 'What if I need to cancel or reschedule a session?',
      answer: 'You can cancel or reschedule a session up to 24 hours before the scheduled time. Go to your Sessions page, find the session you want to modify, and click the "Cancel" or "Reschedule" button. If you cancel within 24 hours, you may be subject to a cancellation fee.',
    },
    {
      id: 'faq3',
      question: 'How do I access my online tutoring session?',
      answer: 'Once your session is scheduled, you will receive a unique session link via email. Click the link at the scheduled time to join the online session. Make sure you have a stable internet connection and a working microphone and camera.',
    },
    {
      id: 'faq4',
      question: 'What subjects are available for tutoring?',
      answer: 'We offer tutoring in a wide range of subjects including Mathematics, English, Science, History, Geography, Languages, and more. You can view the complete list of available subjects in the Subject Selection page during the booking process.',
    },
    {
      id: 'faq5',
      question: 'How does the subscription plan work?',
      answer: 'Our subscription plans offer flexible options for regular tutoring sessions. Choose from monthly or annual plans, which include a set number of hours per month. You can upgrade or downgrade your plan anytime, and unused hours roll over to the next month.',
    },
    {
      id: 'faq6',
      question: 'What if I\'m not satisfied with my tutor?',
      answer: 'If you\'re not satisfied with your tutor, you can request a change through your account settings. Contact our support team with specific feedback, and we\'ll help match you with a more suitable tutor at no additional cost.',
    },
  ];

  const handleSubmitTicket = () => {
    if (ticketMessage.trim()) {
      // Handle ticket submission logic here
      console.log('Ticket submitted:', ticketMessage);
      setTicketMessage('');
      setShowTicketModal(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      {/* FAQ Section */}
      <section className="bg-[#F7F7F7] p-4 sm:p-5 lg:p-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-black">
              How can we help?
            </h2>
          </div>

          <div className='bg-white p-8 rounded-[12px] mb-10 shadow'>
            <div>
              <h2 className="text-2xl font-bold  mb-6">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4 mb-12">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;

                return (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-sm border-2 border-[#85C2DE] overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
                      aria-expanded={isOpen}
                    >
                      <span className="font-normal text-gray-900 text-sm sm:text-base pr-4 text-left">
                        {faq.question}
                      </span>
                      <Plus
                        className={`w-5 h-5 text-gray-400 transition-transform duration-300 shrink-0 ${isOpen ? "rotate-45" : ""
                          }`}
                      />
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
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

          {/* Need Personal Assistance Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Need Personal assistance?
            </h3>
            <p className="text-gray-600 text-sm sm:text-base mb-6">
              If you couldn't find the information you need, our support team is ready to assist you. Submit a ticket, and we'll get back to you as soon as possible.
            </p>
            <button
              onClick={() => setShowTicketModal(true)}
              className="bg-[#0B31BD] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#0a2aa0] transition-colors duration-200"
            >
              Submit Ticket
            </button>
          </div>
        </div>
      </section>

      {/* Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg border shadow-xl w-full max-w-md">
            <div className=" text-white px-4 py-3 rounded-t-lg flex items-center justify-end">
              <button
                onClick={() => setShowTicketModal(false)}
                className='text-black'
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <textarea
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                placeholder="Describe your issue or request here..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#0B31BD] focus:border-transparent text-sm"
              />
              <div className="flex items-center justify-between mt-4">
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm">
                  <Paperclip className="w-4 h-4" />
                  Attach file
                </button>
                <button
                  onClick={handleSubmitTicket}
                  className="text-[#0B31BD] hover:text-[#0a2aa0]"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}