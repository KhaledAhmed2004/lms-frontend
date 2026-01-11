/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useMessages, useSendMessage, useSendMessageWithAttachment } from '@/hooks/api/use-chats';
import { useAuthStore } from '@/store/auth-store';
import { TrialRequest, AcceptedTutor } from '@/hooks/api/use-trial-requests';
import { Loader2, Send, Paperclip, X, FileText, Image as ImageIcon, Film } from 'lucide-react';
import { useSocket } from '@/providers/socket-provider';
import { useAcceptSessionProposal, useRejectSessionProposal } from '@/hooks/api/use-sessions';
import SessionProposal from '@/components/messages/session-proposal';
import ScheduleModal from '@/components/messages/schedule-modal';
import { useVideoCall } from '@/providers/video-call-provider';
import { toast } from 'sonner';

interface Page2Props {
  trialRequest: TrialRequest;
}

const Page2 = ({ trialRequest }: Page2Props) => {
  const step = 2;
  const [message, setMessage] = useState('');
  const [progressWidth, setProgressWidth] = useState("55%");
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthStore();
  const { joinChat, leaveChat, isConnected } = useSocket();

  // Get tutor info from populated acceptedTutorId
  const tutor = typeof trialRequest.acceptedTutorId === 'object'
    ? trialRequest.acceptedTutorId as AcceptedTutor
    : null;

  // Handle both populated (object with _id) and non-populated (string) chatId
  const chatId = typeof trialRequest.chatId === 'object' && trialRequest.chatId !== null
    ? (trialRequest.chatId as { _id: string })._id
    : (trialRequest.chatId as string) || '';

  // Fetch messages from API
  const { data: messagesData, isLoading: messagesLoading } = useMessages(chatId);
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();
  const { mutate: sendMessageWithAttachment, isPending: isUploadingSending } = useSendMessageWithAttachment();
  const { mutate: acceptProposal, isPending: isAccepting } = useAcceptSessionProposal();
  const { mutate: rejectProposal, isPending: isRejecting } = useRejectSessionProposal();
  const { joinSessionCall } = useVideoCall();

  // Join/leave socket room when chatId changes
  useEffect(() => {
    if (chatId && isConnected) {
      joinChat(chatId);
      return () => {
        leaveChat(chatId);
      };
    }
  }, [chatId, isConnected, joinChat, leaveChat]);

  // Get tutor initials for avatar
  const getTutorInitials = () => {
    if (!tutor?.name) return 'T';
    const names = tutor.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  // Handle responsive progress bar (step 2 = 55% progress)
  useEffect(() => {
    const computeWidth = () => {
      const w = typeof window !== "undefined" ? window.innerWidth : 0;
      if (w <= 640) return "55%";
      if (w <= 768) return "52%";
      return "55%";
    };
    setProgressWidth(computeWidth());

    const handleResize = () => setProgressWidth(computeWidth());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messagesData]);

  const handleSendMessage = () => {
    if (chatId) {
      // If there are files selected, send with attachments
      if (selectedFiles.length > 0) {
        sendMessageWithAttachment({
          chatId,
          text: message.trim() || undefined,
          files: selectedFiles,
        }, {
          onSuccess: () => {
            setMessage('');
            setSelectedFiles([]);
          },
          onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to send attachment');
          },
        });
      } else if (message.trim()) {
        // Text only message
        sendMessage({
          chatId,
          content: message.trim(),
          type: 'TEXT',
        });
        setMessage('');
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // File handling functions
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles: File[] = [];
    const maxSize = 10 * 1024 * 1024; // 10MB max per file

    files.forEach(file => {
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Max size is 10MB`);
        return;
      }

      const mimeType = file.type.toLowerCase();
      const isValidType =
        mimeType.startsWith('image/') ||
        mimeType.startsWith('video/') ||
        mimeType.startsWith('audio/') ||
        mimeType === 'application/pdf';

      if (!isValidType) {
        toast.error(`${file.name} is not supported. Use images, videos, audio, or PDF`);
        return;
      }

      validFiles.push(file);
    });

    const newFiles = [...selectedFiles, ...validFiles].slice(0, 3);
    setSelectedFiles(newFiles);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    const mimeType = file.type.toLowerCase();
    if (mimeType.startsWith('image/')) return <ImageIcon className="w-4 h-4" />;
    if (mimeType.startsWith('video/')) return <Film className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const getFilePreview = (file: File) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  const handleSessionAction = (messageId: string, action: string) => {
    if (action === 'accepted') {
      acceptProposal(messageId, {
        onSuccess: () => {
          toast.success('Session accepted! Check your upcoming sessions.');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Failed to accept session');
        },
      });
    } else if (action === 'declined') {
      rejectProposal(messageId, {
        onSuccess: () => {
          toast.info('Session proposal declined');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Failed to decline session');
        },
      });
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-12 px-4">

        {/* Trial Session Card */}
        <div className="rounded-lg shadow-sm border border-gray-200 p-6 mb-6 bg-white">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Trial Session Request</h2>

          {/* Progress Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-2.5 left-0 right-0 h-2 rounded-3xl bg-gray-300 z-0"></div>

              <div
                className="absolute top-2.5 left-0 h-2 rounded-3xl bg-[#0B31BD] z-10 transition-all duration-700 ease-in-out"
                style={{ width: progressWidth }}
              ></div>

              {/* Step 1 */}
              <div className="flex flex-col items-center relative z-10">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-semibold mb-2 transition-all duration-500 ${step >= 1 ? 'bg-[#0B31BD]' : 'bg-gray-300'}`}></div>
                <span className={`text-sm text-center ${step >= 1 ? 'text-gray-700' : 'text-gray-600'}`}>
                  Tutor Matching request
                </span>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center relative z-10">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-semibold mb-2 transition-all duration-500 ${step >= 2 ? 'bg-[#0B31BD]' : 'bg-gray-300'}`}></div>
                <span className={`text-sm text-center ${step >= 2 ? 'text-gray-700' : 'text-gray-600'}`}>
                  Trial Session
                </span>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center relative z-10">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-semibold mb-2 transition-all duration-500 ${step >= 3 ? 'bg-[#0B31BD]' : 'bg-gray-300'}`}></div>
                <span className={`text-sm text-center ${step >= 3 ? 'text-gray-700' : 'text-gray-600'}`}>
                  Start Learning
                </span>
              </div>
            </div>
          </div>

          {/* Status Message */}
          <div className="border bg-[#FFF4E6] border-[#FF8A00] rounded-lg p-4">
            <p className="font-normal">We have found the perfect tutor for you.</p>
            <p className="text-sm text-[#666666]">Start chatting and schedule your trial session.</p>
          </div>
        </div>

        {/* Tutor Profile Card */}
        <div className="rounded-lg p-6">
          <div className="flex items-start gap-4 pb-4">
            {tutor?.profilePicture ? (
              <img
                src={tutor.profilePicture}
                alt={tutor.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#0B31BD] flex items-center justify-center text-white font-semibold text-lg">
                {getTutorInitials()}
              </div>
            )}
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{tutor?.name || 'Tutor'}</p>
              <p className="text-sm text-gray-600">{trialRequest.subject?.name} Tutor</p>
            </div>
          </div>
        </div>

        {/* Messaging Card */}
        <div className="rounded-lg shadow-sm border border-gray-200 p-6 mb-6 bg-white">

          {/* Chat Area */}
          <div
            ref={chatContainerRef}
            className="bg-gray-50 rounded-lg p-4 mb-4 h-96 overflow-y-auto space-y-4"
          >
            {messagesLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-[#0B31BD]" />
              </div>
            ) : messagesData && messagesData.length > 0 ? (
              messagesData.map((msg) => {
                const isStudent = msg.sender._id === user?._id;
                const isTutor = !isStudent;

                return (
                  <div key={msg._id} className={`flex gap-3 ${isStudent ? "justify-end" : ""}`}>
                    {/* Tutor Avatar */}
                    {isTutor && (
                      tutor?.profilePicture ? (
                        <img
                          src={tutor.profilePicture}
                          alt={tutor.name}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#0B31BD] flex-shrink-0 flex items-center justify-center text-white text-xs font-semibold">
                          {getTutorInitials()}
                        </div>
                      )
                    )}

                    <div className={isStudent ? "text-right" : ""}>
                      {isTutor && (
                        <p className="text-xs font-semibold text-gray-700">{tutor?.name || 'Tutor'}</p>
                      )}

                      {/* Check if message has session proposal */}
                      {(msg as any).sessionProposal ? (
                        <SessionProposal
                          date={new Date((msg as any).sessionProposal.startTime || (msg as any).sessionProposal.scheduledAt).toLocaleDateString()}
                          time={new Date((msg as any).sessionProposal.startTime || (msg as any).sessionProposal.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          endTime={(msg as any).sessionProposal.endTime ? new Date((msg as any).sessionProposal.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined}
                          startTimeRaw={(msg as any).sessionProposal.startTime || (msg as any).sessionProposal.scheduledAt}
                          endTimeRaw={(msg as any).sessionProposal.endTime}
                          status={(msg as any).sessionProposal.status}
                          isOwn={isStudent}
                          isLoading={isAccepting || isRejecting}
                          onAccept={() => handleSessionAction(msg._id, "accepted")}
                          onReschedule={() => setIsScheduleOpen(true)}
                          onDecline={() => handleSessionAction(msg._id, "declined")}
                          onJoinSession={() => {
                            // Join session-based video call with the tutor
                            // Both users will join the same channel based on sessionId
                            if (tutor?._id && (msg as any).sessionProposal?.sessionId) {
                              joinSessionCall(
                                (msg as any).sessionProposal.sessionId,
                                tutor._id,
                                tutor.name || 'Tutor'
                              );
                            }
                          }}
                        />
                      ) : (
                        <>
                          <div className={`inline-block rounded-lg p-3 mt-1 max-w-xs ${isStudent ? "bg-[#0B31BD] text-white" : "bg-white border border-gray-200"}`}>
                            {/* Display attachments */}
                            {(msg as any).attachments && (msg as any).attachments.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-2">
                                {(msg as any).attachments.map((attachment: any, idx: number) => (
                                  <div key={idx} className="relative">
                                    {attachment.type === 'image' ? (
                                      <a
                                        href={attachment.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <img
                                          src={attachment.url}
                                          alt={attachment.name || 'Image'}
                                          className="max-w-[180px] max-h-[180px] rounded object-cover cursor-pointer hover:opacity-90"
                                        />
                                      </a>
                                    ) : attachment.type === 'video' ? (
                                      <video
                                        src={attachment.url}
                                        controls
                                        className="max-w-[200px] max-h-[150px] rounded"
                                      />
                                    ) : attachment.type === 'audio' ? (
                                      <audio
                                        src={attachment.url}
                                        controls
                                        className="max-w-[200px]"
                                      />
                                    ) : (
                                      <a
                                        href={attachment.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex items-center gap-2 p-2 rounded hover:opacity-80 transition-opacity ${isStudent ? "bg-blue-600" : "bg-gray-100"}`}
                                      >
                                        <FileText className="w-5 h-5" />
                                        <span className="text-sm truncate max-w-[120px]">
                                          {attachment.name || 'Document'}
                                        </span>
                                      </a>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                            {((msg as any).text || msg.content) && (
                              <p className="text-sm">{(msg as any).text || msg.content}</p>
                            )}
                          </div>

                          <p className={`text-xs text-gray-500 mt-1 ${isStudent ? "text-right" : ""}`}>
                            {formatTime(msg.createdAt)}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>No messages yet. Start the conversation!</p>
              </div>
            )}
          </div>

          {/* Input + Send + Attach */}
          <div className="space-y-3">
            {/* File Preview */}
            {selectedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 p-2 bg-gray-100 rounded-lg">
                {selectedFiles.map((file, index) => {
                  const preview = getFilePreview(file);
                  return (
                    <div
                      key={index}
                      className="relative group bg-white rounded-lg p-2 flex items-center gap-2 border border-gray-200"
                    >
                      {preview ? (
                        <img
                          src={preview}
                          alt={file.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      ) : (
                        <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded">
                          {getFileIcon(file)}
                        </div>
                      )}
                      <div className="flex flex-col max-w-[80px]">
                        <span className="text-xs truncate">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          {(file.size / 1024).toFixed(0)} KB
                        </span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSending || isUploadingSending}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0B31BD] focus:ring-2 focus:ring-blue-100 transition disabled:opacity-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={(!message.trim() && selectedFiles.length === 0) || isSending || isUploadingSending}
                className="bg-[#0B31BD] text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
              >
                {(isSending || isUploadingSending) ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Send
              </button>
            </div>

            {/* Attach Button */}
            <div className="flex justify-between items-center">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,audio/*,.pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={selectedFiles.length >= 3 || isUploadingSending}
                className="cursor-pointer flex items-center gap-2 text-gray-600 hover:text-[#0B31BD] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Paperclip className="h-5 w-5" />
                <span className="text-sm font-medium">Attach file (max 3)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Modal for reschedule */}
      <ScheduleModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onSchedule={(selectedDate, time) => {
          // For now just close the modal - reschedule would need a separate API
          setIsScheduleOpen(false);
          toast.info('Reschedule request noted. Please discuss with your tutor.');
        }}
      />
    </div>
  );
};

export default Page2;