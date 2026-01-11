"use client";
import React, { useState } from 'react';
import { Plus, Paperclip, Send, Loader2, Clock, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import {
  useCreateSupportTicket,
  useMyTickets,
  TICKET_CATEGORY,
  TICKET_CATEGORY_LABELS,
  TICKET_STATUS,
  TICKET_STATUS_LABELS,
  TICKET_STATUS_COLORS,
  SupportTicket,
} from '@/hooks/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const getStatusIcon = (status: TICKET_STATUS) => {
  switch (status) {
    case TICKET_STATUS.OPEN:
      return <AlertCircle className="w-4 h-4" />;
    case TICKET_STATUS.IN_PROGRESS:
      return <Clock className="w-4 h-4" />;
    case TICKET_STATUS.RESOLVED:
      return <CheckCircle2 className="w-4 h-4" />;
    case TICKET_STATUS.CLOSED:
      return <XCircle className="w-4 h-4" />;
    default:
      return null;
  }
};

export default function SupportPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketCategory, setTicketCategory] = useState<TICKET_CATEGORY | ''>('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const createTicketMutation = useCreateSupportTicket();
  const { data: ticketsData, isLoading: ticketsLoading } = useMyTickets({ limit: 10 });

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

  const handleSubmitTicket = async () => {
    if (!ticketCategory) {
      toast.error('Please select a category');
      return;
    }
    if (!ticketMessage.trim()) {
      toast.error('Please enter your message');
      return;
    }

    try {
      await createTicketMutation.mutateAsync({
        category: ticketCategory,
        subject: TICKET_CATEGORY_LABELS[ticketCategory],
        message: ticketMessage.trim(),
      });

      toast.success('Support ticket submitted successfully!');
      setTicketCategory('');
      setTicketMessage('');
      setShowTicketModal(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to submit ticket');
    }
  };

  const handleCloseModal = (open: boolean) => {
    if (!open) {
      setTicketCategory('');
      setTicketMessage('');
    }
    setShowTicketModal(open);
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
              <h2 className="text-2xl font-bold mb-6">
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
                        className={`w-5 h-5 text-gray-400 transition-transform duration-300 shrink-0 ${isOpen ? "rotate-45" : ""}`}
                      />
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
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
            <Button
              onClick={() => setShowTicketModal(true)}
              className="bg-[#0B31BD] hover:bg-[#0a2aa0]"
            >
              Submit Ticket
            </Button>
          </div>

          {/* My Tickets Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 mt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              My Support Tickets
            </h3>

            {ticketsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : ticketsData?.data && ticketsData.data.length > 0 ? (
              <div className="space-y-4">
                {ticketsData.data.map((ticket) => (
                  <Card
                    key={ticket._id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm text-gray-500">
                              {ticket.ticketNumber}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {TICKET_CATEGORY_LABELS[ticket.category]}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {ticket.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        <Badge className={`${TICKET_STATUS_COLORS[ticket.status]} flex items-center gap-1 shrink-0`}>
                          {getStatusIcon(ticket.status)}
                          {TICKET_STATUS_LABELS[ticket.status]}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No support tickets yet</p>
                <p className="text-sm">Submit a ticket if you need help</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Submit Ticket Modal */}
      <Dialog open={showTicketModal} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Submit Support Ticket</DialogTitle>
            <DialogDescription>
              Select a category and describe your issue. Our team will get back to you soon.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Category Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={ticketCategory}
                onValueChange={(value) => setTicketCategory(value as TICKET_CATEGORY)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TICKET_CATEGORY).map((category) => (
                    <SelectItem key={category} value={category}>
                      {TICKET_CATEGORY_LABELS[category]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Message Textarea */}
            <div className="space-y-2">
              <Label htmlFor="message">
                Message <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="message"
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                placeholder="Describe your issue or request in detail..."
                className="min-h-[120px] resize-none"
                maxLength={2000}
              />
              <p className="text-xs text-muted-foreground text-right">
                {ticketMessage.length}/2000
              </p>
            </div>
          </div>

          <DialogFooter className="flex-row justify-between sm:justify-between">
            <Button variant="ghost" size="sm" className="gap-2">
              <Paperclip className="w-4 h-4" />
              Attach file
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleCloseModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitTicket}
                disabled={createTicketMutation.isPending}
                className="bg-[#0B31BD] hover:bg-[#0a2aa0] gap-2"
              >
                {createTicketMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Ticket Details Modal */}
      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Ticket Details
              {selectedTicket && (
                <Badge className={TICKET_STATUS_COLORS[selectedTicket.status]}>
                  {TICKET_STATUS_LABELS[selectedTicket.status]}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Ticket Number</p>
                  <p className="font-medium">{selectedTicket.ticketNumber}</p>
                </div>
                <div>
                  <p className="text-gray-500">Category</p>
                  <p className="font-medium">{TICKET_CATEGORY_LABELS[selectedTicket.category]}</p>
                </div>
                <div>
                  <p className="text-gray-500">Submitted</p>
                  <p className="font-medium">
                    {new Date(selectedTicket.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                {selectedTicket.resolvedAt && (
                  <div>
                    <p className="text-gray-500">Resolved</p>
                    <p className="font-medium">
                      {new Date(selectedTicket.resolvedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-gray-500 text-sm mb-1">Message</p>
                <div className="bg-gray-50 rounded-lg p-4 text-sm">
                  {selectedTicket.message}
                </div>
              </div>

              {selectedTicket.adminNotes && (
                <div>
                  <p className="text-gray-500 text-sm mb-1">Admin Response</p>
                  <div className="bg-blue-50 rounded-lg p-4 text-sm border border-blue-100">
                    {selectedTicket.adminNotes}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTicket(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
