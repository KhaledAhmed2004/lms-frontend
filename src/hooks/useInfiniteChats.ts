import { useInfiniteQuery, useQueryClient, InfiniteData } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Message } from "@/hooks/api/use-chats";
import { useMemo, useCallback } from "react";

interface InfiniteMessagesResponse {
  messages: Message[];
  nextCursor: string | null;
}

/**
 * Custom hook for infinite scrolling chat messages.
 * Uses cursor-based pagination (backward in time) to load older messages.
 */
export function useInfiniteChats(chatId: string, limit: number = 20) {
  const query = useInfiniteQuery({
    queryKey: ["messages", "infinite", chatId],
    queryFn: async ({ pageParam }) => {
      // Fetch messages. Backend is expected to return newer messages first for a given chunk.
      const { data } = await apiClient.get(`/messages/chat/${chatId}`, {
        params: {
          cursor: pageParam,
          limit,
        },
      });

      return {
        messages: data.data || [],
        nextCursor: data.nextCursor || null,
      };
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!chatId,
    staleTime: 1000 * 60, // Consider data fresh for 1 minute
  });

  /**
   * Flatten and sort messages.
   * UX Requirement: Oldest at the top (index 0), Newest at the bottom (index length-1).
   */
  const messages = useMemo(() => {
    if (!query.data) return [];
    
    // Flatten all pages fetched so far
    const allMessages = query.data.pages.flatMap(page => page.messages);
    
    // Sort messages by createdAt ASC (oldest to newest) to ensure correct UI order
    // This fixed Issue 1 where newest messages appeared at the top.
    return [...allMessages].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [query.data]);

  return {
    ...query,
    messages,
  };
}

/**
 * Helper utility to append a new message to the infinite query cache.
 * Fixes Issue 2 by providing "instant" updates without full refetches.
 */
export const updateInfiniteChatCache = (
  queryClient: any, 
  chatId: string, 
  newMessage: Message
) => {
  queryClient.setQueryData(
    ["messages", "infinite", chatId],
    (oldData: InfiniteData<InfiniteMessagesResponse> | undefined) => {
      if (!oldData) return oldData;

      // Check if message already exists (prevent duplicates)
      const messageExists = oldData.pages.some(page => 
        page.messages.some(m => m._id === newMessage._id)
      );
      if (messageExists) return oldData;

      // We append the new message to the FIRST page.
      // Since our UI sorts based on createdAt, it will automatically appear at the bottom.
      const newPages = [...oldData.pages];
      newPages[0] = {
        ...newPages[0],
        messages: [newMessage, ...newPages[0].messages],
      };

      return {
        ...oldData,
        pages: newPages,
      };
    }
  );
};
