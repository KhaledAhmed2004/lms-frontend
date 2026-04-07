"use client";

import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { Message } from "@/hooks/api/use-chats";
import { Loader2, MessageSquareOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatListProps {
  messages: Message[];
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  renderMessage: (message: Message, index: number) => React.ReactNode;
  emptyState?: React.ReactNode;
}

/**
 * ChatList Component
 * Optimized for infinite scrolling with scroll position preservation.
 * Features:
 * - Prepending items without scroll jumping
 * - Intersection Observer for automatic loading
 * - Smooth entrance animations with Framer Motion
 * - Smart auto-scroll to bottom for new messages
 */
const ChatList: React.FC<ChatListProps> = ({
  messages,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  renderMessage,
  emptyState,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const scrollHeightRef = useRef<number>(0);
  const [shouldMaintainPosition, setShouldMaintainPosition] = useState(false);
  const isInitialLoad = useRef(true);

  // Setup Intersection Observer for the top sentinel
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const topEntry = entries[0];
        if (topEntry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          if (containerRef.current) {
            // Measure current scroll height before the prepended data arrives
            scrollHeightRef.current = containerRef.current.scrollHeight;
            setShouldMaintainPosition(true);
          }
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: "100px 0px 0px 0px" } // Pre-fetch slightly early
    );

    const sentinel = topSentinelRef.current;
    if (sentinel) observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Maintain scroll position after content is prepended
  useLayoutEffect(() => {
    if (shouldMaintainPosition && containerRef.current) {
      const container = containerRef.current;
      const newScrollHeight = container.scrollHeight;
      const heightDifference = newScrollHeight - scrollHeightRef.current;

      if (heightDifference > 0) {
        // Adjust scroll position to cancel out the jump caused by prepending
        container.scrollTop = container.scrollTop + heightDifference;
        setShouldMaintainPosition(false);
      }
    }
  }, [messages, shouldMaintainPosition]);

  // Initial scroll to bottom (only once per mount)
  useEffect(() => {
    if (messages.length > 0 && isInitialLoad.current && containerRef.current) {
      const container = containerRef.current;
      container.scrollTop = container.scrollHeight;
      isInitialLoad.current = false;
    }
  }, [messages]);

  // Auto-scroll to bottom for NEW incoming messages (if we are already at the bottom)
  const lastMessageId = messages.length > 0 ? messages[messages.length - 1]._id : null;
  useEffect(() => {
    if (!isInitialLoad.current && !shouldMaintainPosition && containerRef.current) {
      const container = containerRef.current;
      const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 200;
      if (isAtBottom) {
        container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
      }
    }
  }, [lastMessageId, shouldMaintainPosition]);

  if (!messages.length && !isFetchingNextPage) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
        {emptyState || (
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <div className="p-4 rounded-full bg-slate-50">
              <MessageSquareOff className="w-10 h-10 opacity-20" />
            </div>
            <div>
              <p className="font-medium text-slate-600">No messages yet</p>
              <p className="text-sm">Start a conversation to see it here.</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 pt-4 pb-8 md:px-6 relative scroll-smooth"
      style={{ 
        scrollbarWidth: 'thin', 
        display: 'flex', 
        flexDirection: 'column' 
      }}
    >
      {/* Top Sentinel & History Loading Indicator */}
      <div 
        ref={topSentinelRef} 
        className="w-full flex items-center justify-center py-4 min-h-[40px]"
      >
        <AnimatePresence>
          {isFetchingNextPage && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              className="px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-100 flex items-center gap-2 text-primary font-medium text-xs"
            >
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Loading history...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Messages Wrapper */}
      <div className="flex flex-col gap-6 mt-auto">
        {messages.map((msg, index) => (
          <motion.div 
            key={msg._id || `msg-${index}`}
            initial={isInitialLoad.current ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderMessage(msg, index)}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
