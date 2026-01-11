"use client";

import { useState, useEffect, useRef } from "react";
import { Paperclip, Calendar, ArrowUp, ArrowLeft, Loader2, Headphones, X, FileText, Image as ImageIcon, Film } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ScheduleModal from "./schedule-modal";
import SessionProposal from "./session-proposal";
import { Textarea } from "../ui/textarea";
import { useMessages, useSendMessage, useMarkChatAsRead, useChats, Chat, useSendMessageWithAttachment, Attachment } from "@/hooks/api/use-chats";
import { useAuthStore } from "@/store/auth-store";
import { useSocket } from "@/providers/socket-provider";
import { useProposeSession, useAcceptSessionProposal, useRejectSessionProposal, useCounterProposeSession, useCancelSession } from "@/hooks/api/use-sessions";
import { useVideoCall } from "@/providers/video-call-provider";
import { toast } from "sonner";

interface ChatAreaProps {
  conversationId: string;
  onMenuClick: () => void;
}

export default function ChatArea({
  conversationId,
  onMenuClick,
}: ChatAreaProps) {
  const [message, setMessage] = useState("");
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [counterProposalMessageId, setCounterProposalMessageId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthStore();
  const { joinChat, leaveChat, isConnected } = useSocket();

  // Get chats to find the current chat info
  const { data: chats } = useChats();

  // Check if it's a support chat (special case) - find admin chat
  const isSupportChatView = conversationId === "support";

  // Find admin chat (chat where other participant is SUPER_ADMIN)
  const adminChat = chats?.find(c =>
    c.participants.some(p => p._id !== user?._id && p.role === 'SUPER_ADMIN')
  );

  // Use admin chat ID if viewing support, otherwise use provided conversationId
  const actualChatId = isSupportChatView ? (adminChat?._id || '') : conversationId;
  const currentChat = chats?.find(c => c._id === actualChatId);

  // Join/leave socket room when conversation changes
  useEffect(() => {
    if (actualChatId && isConnected) {
      joinChat(actualChatId);
      return () => {
        leaveChat(actualChatId);
      };
    }
  }, [actualChatId, isConnected, joinChat, leaveChat]);

  // Get messages from API
  const { data: messages, isLoading: messagesLoading } = useMessages(actualChatId);
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();
  const { mutate: sendMessageWithAttachment, isPending: isUploadingSending } = useSendMessageWithAttachment();
  const { mutate: markAsRead } = useMarkChatAsRead();
  const { mutate: proposeSession, isPending: isProposing } = useProposeSession();
  const { mutate: acceptProposal, isPending: isAccepting } = useAcceptSessionProposal();
  const { mutate: rejectProposal, isPending: isRejecting } = useRejectSessionProposal();
  const { mutate: counterPropose, isPending: isCounterProposing } = useCounterProposeSession();
  const { mutate: cancelSession, isPending: isCancelling } = useCancelSession();
  const { joinSessionCall } = useVideoCall();

  // Check if user is a tutor (can send session proposals)
  const isTutor = user?.role === 'TUTOR';

  // Get the other participant (not the current user)
  const getOtherParticipant = (chat: Chat) => {
    return chat.participants.find(p => p._id !== user?._id) || chat.participants[0];
  };

  const otherParticipant = currentChat ? getOtherParticipant(currentChat) : null;

  // Check if the other participant is a student (schedule button should only show for student chats)
  const isOtherParticipantStudent = otherParticipant?.role === 'STUDENT';

  // Schedule button should only appear if tutor is chatting with a student
  const canShowScheduleButton = isTutor && isOtherParticipantStudent;

  // Get initials from name
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Mark chat as read when viewing
  useEffect(() => {
    if (actualChatId && currentChat?.unreadCount && currentChat.unreadCount > 0) {
      markAsRead(actualChatId);
    }
  }, [actualChatId, currentChat?.unreadCount, markAsRead]);

  const handleSend = () => {
    if (actualChatId) {
      // If there are files selected, send with attachments
      if (selectedFiles.length > 0) {
        sendMessageWithAttachment({
          chatId: actualChatId,
          text: message.trim() || undefined,
          files: selectedFiles,
        }, {
          onSuccess: () => {
            setMessage("");
            setSelectedFiles([]);
          },
          onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to send attachment');
          },
        });
      } else if (message.trim()) {
        // Text only message
        sendMessage({
          chatId: actualChatId,
          content: message.trim(),
          type: 'TEXT',
        });
        setMessage("");
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // File handling functions
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate file types and sizes
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

    // Limit to 3 files total
    const newFiles = [...selectedFiles, ...validFiles].slice(0, 3);
    setSelectedFiles(newFiles);

    // Reset input
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

  const handleSchedule = (selectedDate: Date, time: string) => {
    if (!actualChatId) return;

    // Parse time (format: HH:MM AM/PM)
    const [timePart, period] = time.split(' ');
    const [hours, minutes] = timePart.split(':').map(Number);
    let hour24 = hours;
    if (period === 'PM' && hours !== 12) hour24 += 12;
    if (period === 'AM' && hours === 12) hour24 = 0;

    // Create start time using the selected date
    const startTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      hour24,
      minutes
    );

    // ============================================
    // 🧪 TEST MODE: Set to true for 5 min test sessions
    // Set to false for production (60 min sessions)
    // ============================================
    const TEST_MODE = true;
    const SESSION_DURATION_MS = TEST_MODE ? 5 * 60 * 1000 : 60 * 60 * 1000; // 5 min or 1 hour

    const endTime = new Date(startTime.getTime() + SESSION_DURATION_MS);

    // Check if this is a counter-proposal (student suggesting alternative time)
    if (counterProposalMessageId) {
      counterPropose(
        {
          messageId: counterProposalMessageId,
          newStartTime: startTime.toISOString(),
          newEndTime: endTime.toISOString(),
        },
        {
          onSuccess: () => {
            toast.success('Counter-proposal sent! Waiting for tutor response.');
            setIsScheduleOpen(false);
            setCounterProposalMessageId(null);
          },
          onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to send counter-proposal');
          },
        }
      );
    } else {
      // Tutor proposing new session
      const subject = currentChat?.subject || 'Tutoring Session';

      proposeSession(
        {
          chatId: actualChatId,
          subject,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        },
        {
          onSuccess: () => {
            toast.success('Session proposal sent!');
            setIsScheduleOpen(false);
          },
          onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to send proposal');
          },
        }
      );
    }
  };

  const handleSessionAction = (messageId: string, action: string, sessionId?: string) => {
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
    } else if (action === 'cancelled' && sessionId) {
      cancelSession(
        { sessionId, cancellationReason: 'Cancelled by user' },
        {
          onSuccess: () => {
            toast.success('Session cancelled successfully');
          },
          onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to cancel session');
          },
        }
      );
    }
  };

  // Support chat view - show admin conversation or placeholder
  if (isSupportChatView) {
    // No admin chat exists yet - show placeholder
    if (!adminChat) {
      return (
        <div className="h-full flex flex-col bg-background">
          {/* Header */}
          <div className="border-b border-border bg-card px-4 md:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onMenuClick}
                className="md:hidden h-8 w-8"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center justify-center w-10 h-10 bg-primary text-white rounded-full">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Support Chat</h2>
                <p className="text-xs text-muted-foreground">Get help from our team</p>
              </div>
            </div>
          </div>

          {/* Placeholder Message */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            <div className="flex justify-start">
              <div className="flex gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full shrink-0">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <div className="rounded-lg px-4 py-2 bg-card border border-border rounded-bl-none">
                    <p className="text-sm">Need help? Submit a support ticket and our team will get back to you soon!</p>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1 block">Support Team</span>
                </div>
              </div>
            </div>
          </div>

          {/* Disabled Input Area */}
          <div className="w-full flex bg-background p-4">
            <div className="w-full">
              <div className="bg-card border border-border rounded-lg p-4 opacity-60">
                <Textarea
                  placeholder="Submit a support ticket to start a conversation..."
                  disabled
                  className="min-h-20 mb-3 resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                />
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2 text-foreground bg-transparent" disabled>
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <div className="flex-1" />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="shrink-0 bg-[#0B31BD] text-white"
                    disabled
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Admin chat exists - continue to show real chat below (using actualChatId)
  }

  // No conversation selected
  if (!conversationId) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="md:hidden h-8 w-8"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          {isSupportChatView ? (
            // Support Chat header
            <>
              <div className="flex items-center justify-center w-10 h-10 bg-primary text-white rounded-full">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Support Chat</h2>
                <p className="text-xs text-muted-foreground">Get help from our team</p>
              </div>
            </>
          ) : (
            // Regular chat header
            <>
              <Avatar className="w-10 h-10">
                {(otherParticipant?.image || otherParticipant?.avatar) ? (
                  <AvatarImage src={otherParticipant.image || otherParticipant.avatar} alt={otherParticipant.name} />
                ) : null}
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(otherParticipant?.name || 'U')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-foreground">
                  {otherParticipant?.name || 'Chat'}
                </h2>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messagesLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : messages && messages.length > 0 ? (
          messages.map((msg) => {
            const isOwn = msg.sender._id === user?._id;
            const messageContent = (msg as any).text || msg.content;

            return (
              <div
                key={msg._id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}>
                  {!isOwn && (
                    isSupportChatView ? (
                      // Support Chat: Show support icon instead of admin avatar
                      <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full shrink-0">
                        <Headphones className="w-4 h-4" />
                      </div>
                    ) : (
                      <Avatar className="w-8 h-8 shrink-0">
                        {(msg.sender.profilePicture || msg.sender.avatar) ? (
                          <AvatarImage src={msg.sender.profilePicture || msg.sender.avatar} alt={msg.sender.name} />
                        ) : null}
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getInitials(msg.sender.name || 'U')}
                        </AvatarFallback>
                      </Avatar>
                    )
                  )}
                  <div className={isOwn && !msg.sessionProposal ? "text-right" : ""}>
                    {msg.sessionProposal ? (
                      <SessionProposal
                        date={new Date((msg.sessionProposal as any).startTime || msg.sessionProposal.scheduledAt).toLocaleDateString()}
                        time={new Date((msg.sessionProposal as any).startTime || msg.sessionProposal.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        endTime={(msg.sessionProposal as any).endTime ? new Date((msg.sessionProposal as any).endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined}
                        startTimeRaw={(msg.sessionProposal as any).startTime || msg.sessionProposal.scheduledAt}
                        endTimeRaw={(msg.sessionProposal as any).endTime}
                        status={(msg.sessionProposal as any).status}
                        isOwn={isOwn}
                        isLoading={isAccepting || isRejecting || isCounterProposing || isCancelling}
                        userRole={user?.role}
                        onAccept={() => handleSessionAction(msg._id, "accepted")}
                        onReschedule={() => {
                          // Counter-proposing alternative time
                          setCounterProposalMessageId(msg._id);
                          setIsScheduleOpen(true);
                        }}
                        onDecline={() => handleSessionAction(msg._id, "declined")}
                        onCancel={() => handleSessionAction(msg._id, "cancelled", (msg.sessionProposal as any).sessionId)}
                        onJoinSession={() => {
                          // Join session-based video call with the other participant
                          // Both users will join the same channel based on sessionId
                          if (otherParticipant && (msg.sessionProposal as any)?.sessionId) {
                            joinSessionCall(
                              (msg.sessionProposal as any).sessionId,
                              otherParticipant._id,
                              otherParticipant.name || 'User'
                            );
                          }
                        }}
                      />
                    ) : (
                      <>
                        <div
                          className={`rounded-lg px-4 py-2 ${
                            isOwn
                              ? "bg-accent text-accent-foreground rounded-br-none"
                              : "bg-card border border-border rounded-bl-none"
                          }`}
                        >
                          {/* Display attachments */}
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                              {msg.attachments.map((attachment, idx) => (
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
                                        className="max-w-[200px] max-h-[200px] rounded object-cover cursor-pointer hover:opacity-90"
                                      />
                                    </a>
                                  ) : attachment.type === 'video' ? (
                                    <video
                                      src={attachment.url}
                                      controls
                                      className="max-w-[250px] max-h-[200px] rounded"
                                    />
                                  ) : attachment.type === 'audio' ? (
                                    <audio
                                      src={attachment.url}
                                      controls
                                      className="max-w-[250px]"
                                    />
                                  ) : (
                                    <a
                                      href={attachment.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 p-2 bg-background rounded hover:bg-muted transition-colors"
                                    >
                                      <FileText className="w-5 h-5 text-primary" />
                                      <span className="text-sm truncate max-w-[150px]">
                                        {attachment.name || 'Document'}
                                      </span>
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          {messageContent && (
                            <p className="text-sm wrap-break-word">{messageContent}</p>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground mt-1 block">
                          {formatTime(msg.createdAt)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="w-full flex bg-background p-4">
        <div className="w-full">
          <div className="bg-card border border-border rounded-lg p-4">
            {/* File Preview */}
            {selectedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedFiles.map((file, index) => {
                  const preview = getFilePreview(file);
                  return (
                    <div
                      key={index}
                      className="relative group bg-muted rounded-lg p-2 flex items-center gap-2"
                    >
                      {preview ? (
                        <img
                          src={preview}
                          alt={file.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 flex items-center justify-center bg-background rounded">
                          {getFileIcon(file)}
                        </div>
                      )}
                      <div className="flex flex-col max-w-[100px]">
                        <span className="text-xs truncate">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(0)} KB
                        </span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <Textarea
              placeholder="Type your Message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isSending || isUploadingSending}
              className="min-h-20 mb-3 resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
            />

            <div className="flex items-center gap-2">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,audio/*,.pdf"
                onChange={handleFileSelect}
                className="hidden"
              />

              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-foreground bg-transparent"
                onClick={() => fileInputRef.current?.click()}
                disabled={selectedFiles.length >= 3 || isUploadingSending}
              >
                <Paperclip className="w-4 h-4" />
              </Button>

              {canShowScheduleButton && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-foreground bg-transparent"
                  onClick={() => setIsScheduleOpen(true)}
                  disabled={isProposing}
                >
                  {isProposing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Calendar className="w-4 h-4 text-blue-500" />
                  )}
                </Button>
              )}

              <div className="flex-1" />

              <Button
                size="icon"
                variant="ghost"
                className="shrink-0 bg-[#0B31BD] text-white disabled:opacity-50"
                onClick={handleSend}
                disabled={(!message.trim() && selectedFiles.length === 0) || isSending || isUploadingSending}
              >
                {(isSending || isUploadingSending) ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowUp className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={isScheduleOpen}
        onClose={() => {
          setIsScheduleOpen(false);
          setCounterProposalMessageId(null);
        }}
        onSchedule={handleSchedule}
      />
    </div>
  );
}
