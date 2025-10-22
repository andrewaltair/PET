'use client';

import React from 'react';
import { Message } from 'petservice-marketplace-shared-types';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Check, CheckCheck, Clock, AlertCircle } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  className?: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
}

export function MessageBubble({ message, className, status = 'sent' }: MessageBubbleProps) {
  const { user } = useAuth();
  const isOwnMessage = message.senderId === user?.id;

  const formatMessageTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'HH:mm');
    } catch {
      return '';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'sending':
        return <Clock className="w-3 h-3 text-gray-400 animate-pulse" />;
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      case 'failed':
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        'flex mb-4',
        isOwnMessage ? 'justify-end' : 'justify-start',
        className
      )}
    >
      <div
        className={cn(
          'max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm',
          isOwnMessage
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-100 text-gray-900 rounded-bl-none'
        )}
      >
        {!isOwnMessage && (
          <div className="text-xs font-medium text-gray-600 mb-1">
            {message.sender.email}
          </div>
        )}
        <div className="text-sm break-words">{message.content}</div>
        <div
          className={cn(
            'text-xs mt-1 flex items-center gap-1',
            isOwnMessage ? 'text-blue-100 justify-end' : 'text-gray-500 justify-start'
          )}
        >
          <span>{formatMessageTime(message.createdAt)}</span>
          {isOwnMessage && (
            <span className="flex items-center" title={`Message ${status}`}>
              {getStatusIcon()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
