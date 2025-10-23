'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { ConversationWithLastMessage } from 'petservice-marketplace-shared-types';
import { conversationsAPI } from '../services/api';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { format } from 'date-fns';
import { MessageCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConversationListProps {
  selectedConversationId?: string;
  onConversationSelect: (conversationId: string) => void;
  className?: string;
}

export function ConversationList({
  selectedConversationId,
  onConversationSelect,
  className
}: ConversationListProps) {
  const t = useTranslations('conversations');
  const {
    data: conversationsResponse,
    isLoading,
    error
  } = useQuery({
    queryKey: ['conversations'],
    queryFn: conversationsAPI.getConversations,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const formatLastMessageTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

      if (diffInHours < 24) {
        return format(date, 'HH:mm');
      } else if (diffInHours < 168) { // 7 days
        return format(date, 'EEE');
      } else {
        return format(date, 'MMM d');
      }
    } catch {
      return '';
    }
  };

  const getOtherParticipant = (conversation: ConversationWithLastMessage) => {
    // For now, assume OWNER-PROVIDER conversations
    // In a more complex system, you'd need logic to determine the "other" participant
    return conversation.participants[0]; // Simplified - take first participant
  };

  if (isLoading) {
    return (
      <div className={cn('p-4', className)}>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('p-4', className)}>
        <div className="text-center text-red-500">
          {t('errorLoading')}
        </div>
      </div>
    );
  }

  const conversations = conversationsResponse?.conversations || [];

  if (conversations.length === 0) {
    return (
      <div className={cn('p-4 text-center', className)}>
        <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          {t('empty.title')}
        </h3>
        <p className="text-sm text-gray-500">
          {t('empty.description')}
        </p>
      </div>
    );
  }

  return (
    <div className={cn('divide-y divide-gray-200', className)}>
      {conversations.map((conversation) => {
        const otherParticipant = getOtherParticipant(conversation);
        const isSelected = selectedConversationId === conversation.id;

        return (
          <div
            key={conversation.id}
            className={cn(
              'p-4 cursor-pointer hover:bg-gray-50 transition-colors',
              isSelected && 'bg-blue-50 border-r-2 border-blue-500'
            )}
            onClick={() => onConversationSelect(conversation.id)}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {otherParticipant.email || t('user')}
                  </p>
                  {conversation.lastMessage && (
                    <p className="text-xs text-gray-500">
                      {formatLastMessageTime(conversation.lastMessage.createdAt)}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.lastMessage?.content || t('noMessagesYet')}
                  </p>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {otherParticipant.role.toLowerCase()}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
