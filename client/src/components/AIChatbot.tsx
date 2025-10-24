'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { aiChatService, ChatMessage } from '../services/aiChatService';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Send, Bot, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

interface AIChatbotProps {
  className?: string;
}

export function AIChatbot({ className }: AIChatbotProps) {
  const t = useTranslations('messages.aiChat');
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        role: 'assistant',
        content: t('welcomeMessage'),
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length, t]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageInput.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: messageInput.trim(),
      timestamp: new Date(),
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setMessageInput('');
    setIsLoading(true);

    try {
      // Send to AI service
      const userId = user?.id || 'anonymous';
      console.log('Sending message to AI:', userMessage.content);
      console.log('User ID:', userId);
      
      const aiResponse = await aiChatService.sendMessage(userId, userMessage.content);
      console.log('AI Response received:', aiResponse);

      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      console.error('Error sending message:', error);
      console.error('Error details:', error?.message, error?.response);
      toast.error(error?.message || t('errorSending'));
      
      // Add error message with actual error text
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: error?.message || t('errorMessage'),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (user?.id) {
      aiChatService.clearHistory(user.id);
    }
    setMessages([]);
    toast.success(t('chatCleared'));
  };

  return (
    <Card className={cn('flex flex-col h-full', className)}>
      {/* Chat Header */}
      <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-blue-50 p-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-medium flex items-center gap-2">
                {t('title')}
                <Sparkles className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-xs text-gray-500">
                {t('subtitle')}
              </div>
            </div>
          </div>
          {messages.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearChat}
              className="text-xs"
            >
              {t('clearChat')}
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4">
          <div className="space-y-2">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[80%] rounded-lg px-4 py-2',
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  )}
                >
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  <div className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600" />
                    <span className="text-sm text-gray-600">{t('typing')}</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          </div>
        </ScrollArea>
      </CardContent>

      {/* Message Input */}
      <div className="border-t p-4 bg-gray-50">
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
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (messageInput.trim() && !isLoading) {
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
              disabled={isLoading || !messageInput.trim()}
              className="px-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span className="sr-only">{t('send')}</span>
            </Button>
          </div>

          {/* Status */}
          <div className="flex justify-between items-center text-xs">
            {isLoading ? (
              <div className="text-purple-600 flex items-center gap-1">
                <div className="animate-spin rounded-full h-3 w-3 border-b border-purple-600" />
                {t('processing')}
              </div>
            ) : (
              <div className="text-gray-400">
                {t('hint')}
              </div>
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

