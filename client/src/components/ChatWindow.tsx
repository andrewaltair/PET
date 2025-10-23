'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Conversation, Message } from 'petservice-marketplace-shared-types';
import { conversationsAPI } from '../services/api';
import { useChat } from '../hooks/useChat';
import { MessageBubble } from './MessageBubble';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Send, User, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

interface ChatWindowProps {
  conversationId: string | null;
  className?: string;
}

export function ChatWindow({ conversationId, className }: ChatWindowProps) {
  const t = useTranslations('messages.chat');
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    data: conversationResponse,
    isLoading: isLoadingConversation,
    error: conversationError
  } = useQuery({
    queryKey: ['conversation', conversationId, 'messages'],
    queryFn: () => conversationsAPI.getConversationMessages(conversationId!),
    enabled: !!conversationId,
  });

  const {
    messages: realtimeMessages,
    isConnected,
    isLoading: isSendingMessage,
    error: chatError,
    sendMessage
  } = useChat({ conversationId });

  // Combine loaded messages with real-time messages
  const allMessages = React.useMemo(() => {
    const loadedMessages = conversationResponse?.messages || [];
    const combined = [...loadedMessages];

    // Add real-time messages that aren't already in the loaded messages
    realtimeMessages.forEach(rtMsg => {
      if (!combined.some(msg => msg.id === rtMsg.id)) {
        combined.push(rtMsg);
      }
    });

    // Sort by creation time
    return combined.sort((a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [conversationResponse?.messages, realtimeMessages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allMessages]);

  // Focus input when conversation changes
  useEffect(() => {
    if (conversationId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [conversationId]);

  // Show chat errors
  useEffect(() => {
    if (chatError) {
      toast.error(chatError);
    }
  }, [chatError]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageInput.trim() || !conversationId) return;

    try {
      await sendMessage(messageInput.trim());
      setMessageInput('');
    } catch (error) {
      // Error is already handled by useChat hook
    }
  };

  const getOtherParticipant = (conversation: Conversation) => {
    // For now, assume OWNER-PROVIDER conversations
    // In a more complex system, you'd need logic to determine the "other" participant
    return conversation.participants[0]; // Simplified - take first participant
  };

  if (!conversationId) {
    return (
      <div className={cn('flex items-center justify-center h-full', className)}>
        <div className="text-center max-w-sm mx-auto px-4">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('noConversation.title')}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            {t('noConversation.description')}
          </p>
          <div className="mt-4 text-xs text-gray-400">
            💡 {t('noConversation.tip')}
          </div>
        </div>
      </div>
    );
  }

  if (isLoadingConversation) {
    return (
      <div className={cn('flex items-center justify-center h-full', className)}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (conversationError) {
    return (
      <div className={cn('flex items-center justify-center h-full', className)}>
        <div className="text-center text-red-500">
          {t('failedToLoad')}
        </div>
      </div>
    );
  }

  const otherParticipant = null; // TODO: Get conversation info separately

  return (
    <Card className={cn('flex flex-col h-full', className)}>
      {/* Chat Header */}
      <CardHeader className="border-b">
        <CardTitle className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <div className="text-sm font-medium">
              {t('chatWith')}
            </div>
            <div className="text-xs text-gray-500">
              {isConnected ? t('online') : t('offline')}
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full p-4">
          {allMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center px-4">
              <div className="max-w-sm">
                <div className="text-4xl mb-3">👋</div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  {t('emptyTitle')}
                </h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {t('emptyDescription')}
                </p>
                <div className="mt-3 text-xs text-gray-400">
                  💡 {t('emptyTip')}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {allMessages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>
      </CardContent>

      {/* Message Input */}
      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="space-y-2">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                type="text"
                placeholder={t('placeholder')}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="pr-12"
                maxLength={1000}
                disabled={isSendingMessage || !isConnected}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (messageInput.trim() && !isSendingMessage && isConnected) {
                      handleSendMessage(e as any);
                    }
                  }
                }}
              />
              {messageInput.length > 800 && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <span className={`text-xs ${messageInput.length > 950 ? 'text-red-500' : 'text-gray-400'}`}>
                    {messageInput.length}/1000
                  </span>
                </div>
              )}
            </div>
            <Button
              type="submit"
              size="sm"
              disabled={isSendingMessage || !messageInput.trim() || !isConnected}
              className="px-3"
            >
              {isSendingMessage ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span className="sr-only">
                {isSendingMessage ? t('sending') : t('send')}
              </span>
            </Button>
          </div>

          {/* Status and hints */}
          <div className="flex justify-between items-center text-xs">
            {!isConnected ? (
              <p className="text-red-500 flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                {t('disconnected')}
              </p>
            ) : isSendingMessage ? (
              <p className="text-blue-600 flex items-center gap-1">
                <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600" />
                {t('sendingMessage')}
              </p>
            ) : (
              <p className="text-gray-400">
                {t('hint')}
              </p>
            )}

            {messageInput.length > 0 && messageInput.length <= 800 && (
              <span className="text-gray-400">
                {messageInput.length}/1000
              </span>
            )}
          </div>
        </form>
      </div>
    </Card>
  );
}
