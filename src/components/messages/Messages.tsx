"use client";

import ChatArea from "@/components/messages/chat-area";
import ConversationSidebar from "@/components/messages/conversation-sidebar";
import { useState, useEffect } from "react";
import { useChats } from "@/hooks/api/use-chats";

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const { data: chats } = useChats();

  // Auto-select first chat when chats load
  useEffect(() => {
    if (chats && chats.length > 0 && !selectedConversation) {
      setSelectedConversation(chats[0]._id);
    }
  }, [chats, selectedConversation]);

  return (
    <div className="flex h-full bg-white overflow-hidden border border-slate-200 rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.1)]">
      {/* Sidebar Container */}
      <div
        className={`
        h-full w-full md:w-[320px] shrink-0 border-r border-slate-200 bg-slate-50/50
        ${showMobileChat ? "hidden" : "block"}
        md:block
      `}
      >
        <ConversationSidebar
          selectedConversation={selectedConversation}
          onSelectConversation={(id) => {
            setSelectedConversation(id);
            setShowMobileChat(true); // Switch to chat view on mobile
          }}
        />
      </div>

      {/* Main Chat Area Container */}
      <div
        className={`
        flex-1 h-full w-full min-h-0
        ${showMobileChat ? "block" : "hidden"}
        md:block
      `}
      >
        <ChatArea
          conversationId={selectedConversation}
          onMenuClick={() => setShowMobileChat(false)} // Back button action
        />
      </div>
    </div>
  );
}