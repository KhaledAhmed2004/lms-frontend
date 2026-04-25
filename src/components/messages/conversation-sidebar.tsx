"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Chat, useChats } from "@/hooks/api/use-chats";
import { useAuthStore } from "@/store/auth-store";
import { Headphones, Loader2, User } from "lucide-react";

interface ConversationSidebarProps {
  selectedConversation: string;
  onSelectConversation: (id: string) => void;
}

export default function ConversationSidebar({
  selectedConversation,
  onSelectConversation,
}: ConversationSidebarProps) {
  const { data: chats, isLoading } = useChats();
  const { user } = useAuthStore();

  // Get the other participant (not the current user)
  const getOtherParticipant = (chat: Chat) => {
    return (
      chat.participants.find((p) => p._id !== user?._id) || chat.participants[0]
    );
  };

  // Get initials from name
  const getInitials = (name: string) => {
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  // Check if user is admin (SUPER_ADMIN)
  const isAdmin = user?.role === "SUPER_ADMIN";

  // Filter out admin chats from regular list (for non-admin users)
  // Admin chats will be shown in Support Chat section
  const filteredChats = isAdmin
    ? chats
    : chats?.filter(
        (chat) =>
          !chat.participants.some(
            (p) => p._id !== user?._id && p.role === "SUPER_ADMIN",
          ),
      );

  // Check if there's an admin chat (for showing indicator on Support Chat)
  const hasAdminChat =
    !isAdmin &&
    chats?.some((chat) =>
      chat.participants.some(
        (p) => p._id !== user?._id && p.role === "SUPER_ADMIN",
      ),
    );

  // Get unread count from admin chat
  const adminChatUnread = !isAdmin
    ? chats?.find((chat) =>
        chat.participants.some(
          (p) => p._id !== user?._id && p.role === "SUPER_ADMIN",
        ),
      )?.unreadCount || 0
    : 0;

  return (
    <div className="w-full h-full bg-transparent flex flex-col">
      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : filteredChats && filteredChats.length > 0 ? (
          filteredChats.map((chat) => {
            const otherParticipant = getOtherParticipant(chat);
            const hasUnread = chat.unreadCount > 0;
            const isSelected = selectedConversation === chat._id;

            return (
              <button
                key={chat._id}
                onClick={() => onSelectConversation(chat._id)}
                className={`w-full p-4 border-b border-slate-100 text-left transition-all hover:bg-white hover:shadow-sm ${
                  isSelected ? "bg-white shadow-sm ring-1 ring-slate-200/50" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-11 h-11 shrink-0">
                    {otherParticipant?.image || otherParticipant?.avatar ? (
                      <AvatarImage
                        src={otherParticipant.image || otherParticipant.avatar}
                        alt={otherParticipant.name}
                      />
                    ) : null}
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(otherParticipant?.name || "U")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className={`font-semibold text-sm text-foreground truncate ${hasUnread ? "font-bold" : ""}`}
                      >
                        {otherParticipant?.name || "User"}
                      </h3>
                      {hasUnread && (
                        <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-xs text-muted-foreground truncate ${hasUnread ? "font-medium" : ""}`}
                    >
                      {chat.lastMessage?.text ||
                        chat.lastMessage?.content ||
                        "No messages yet"}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {chat.lastMessage?.createdAt
                        ? formatTime(chat.lastMessage.createdAt)
                        : formatTime(chat.createdAt)}
                    </span>
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
            No conversations yet
          </div>
        )}
      </div>

      {/* Fixed bottom actions */}
      <div className="shrink-0 border-t border-slate-100 bg-white">
        {/* New Tutor Chat */}
        {user?.role === "STUDENT" && (
          <div className="p-3">
            <button
              onClick={() => onSelectConversation("tutor")}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-3 transition-colors ${
                selectedConversation === "tutor"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-foreground"
              }`}
            >
              <div className="relative flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full">
                <User className="w-4 h-4" />
                {adminChatUnread > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {adminChatUnread}
                  </span>
                )}
              </div>

              <div className="text-left flex-1">
                <div
                  className={`font-semibold text-sm ${adminChatUnread > 0 ? "font-bold" : ""}`}
                >
                  New Tutor Chat
                </div>
                <div className="text-xs opacity-75">
                  {hasAdminChat
                    ? "Chat with support team"
                    : "Get help from our team"}
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Support Chat */}
        {!isAdmin && (
          <div className="p-3 pt-0">
            <button
              onClick={() => onSelectConversation("support")}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-3 transition-colors ${
                selectedConversation === "support"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-foreground"
              }`}
            >
              <div className="relative flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full">
                <Headphones className="w-4 h-4" />
                {adminChatUnread > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {adminChatUnread}
                  </span>
                )}
              </div>

              <div className="text-left flex-1">
                <div
                  className={`font-semibold text-sm ${adminChatUnread > 0 ? "font-bold" : ""}`}
                >
                  Support Chat
                </div>
                <div className="text-xs opacity-75">
                  {hasAdminChat
                    ? "Chat with support team"
                    : "Get help from our team"}
                </div>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
