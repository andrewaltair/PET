'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message } from 'petservice-marketplace-shared-types';
import { useAuth } from '../contexts/AuthContext';

interface UseChatOptions {
  conversationId: string | null;
}

interface UseChatReturn {
  messages: Message[];
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  joinConversation: (conversationId: string) => void;
  leaveConversation: () => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useChat({ conversationId }: UseChatOptions): UseChatReturn {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentConversationIdRef = useRef<string | null>(null);

  // Initialize socket connection
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!token || !user) {
      return;
    }

    // Create socket connection
    socketRef.current = io(API_BASE_URL, {
      auth: {
        token: token,
      },
      transports: ['websocket', 'polling'],
      timeout: 10000,
    });

    const socket = socketRef.current;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('Connected to chat server');
      setIsConnected(true);
      setError(null);
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected from chat server:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setError('Failed to connect to chat server');
      setIsConnected(false);
    });

    // Chat event handlers
    socket.on('joined_room', (data) => {
      console.log('Joined conversation:', data.conversationId);
      currentConversationIdRef.current = data.conversationId;
    });

    socket.on('receive_message', (data) => {
      console.log('Received message:', data);
      setMessages(prevMessages => {
        // Avoid duplicates
        const exists = prevMessages.some(msg => msg.id === data.message.id);
        if (exists) return prevMessages;

        return [...prevMessages, data.message].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
    });

    socket.on('message_sent', (data) => {
      console.log('Message sent successfully:', data);
    });

    socket.on('error', (errorData) => {
      console.error('Socket error:', errorData);
      setError(errorData.message || 'An error occurred');
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  // Join conversation
  const joinConversation = useCallback((newConversationId: string) => {
    if (!socketRef.current || !isConnected) {
      setError('Not connected to chat server');
      return;
    }

    if (currentConversationIdRef.current === newConversationId) {
      return; // Already in this conversation
    }

    console.log('Joining conversation:', newConversationId);
    socketRef.current.emit('join_room', newConversationId);
  }, [isConnected]);

  // Leave current conversation
  const leaveConversation = useCallback(() => {
    currentConversationIdRef.current = null;
    // Socket.io handles room leaving automatically when joining a new room
  }, []);

  // Send message
  const sendMessage = useCallback(async (content: string): Promise<void> => {
    if (!socketRef.current || !isConnected) {
      throw new Error('Not connected to chat server');
    }

    if (!conversationId) {
      throw new Error('No conversation selected');
    }

    if (!content || content.trim().length === 0) {
      throw new Error('Message content cannot be empty');
    }

    if (content.length > 1000) {
      throw new Error('Message content cannot exceed 1000 characters');
    }

    setIsLoading(true);
    setError(null);

    try {
      socketRef.current.emit('send_message', {
        conversationId,
        content: content.trim(),
      });

      // The message will be received via the 'receive_message' event
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, isConnected]);

  // Auto-join conversation when conversationId changes
  useEffect(() => {
    if (conversationId && isConnected) {
      joinConversation(conversationId);
    }
  }, [conversationId, isConnected, joinConversation]);

  return {
    messages,
    isConnected,
    isLoading,
    error,
    sendMessage,
    joinConversation,
    leaveConversation,
  };
}
