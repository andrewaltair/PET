'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ConversationList } from '@/components/ConversationList';
import { ChatWindow } from '@/components/ChatWindow';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export default function MessagesPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  // Get conversation ID from URL params
  useEffect(() => {
    const conversationId = searchParams.get('conversationId');
    if (conversationId) {
      setSelectedConversationId(conversationId);
    }
  }, [searchParams]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && user === null) {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    // Update URL without causing a page reload
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('conversationId', conversationId);
    window.history.replaceState({}, '', newUrl.toString());
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-50">
      <div className="h-full p-4">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Messages</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="h-full bg-white rounded-lg shadow-sm border">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Conversations List Panel */}
            <ResizablePanel defaultSize={30} minSize={25} maxSize={40}>
              <div className="h-full border-r">
                <div className="p-4 border-b bg-gray-50">
                  <h1 className="text-lg font-semibold text-gray-900">
                    Messages
                  </h1>
                  <p className="text-sm text-gray-600">
                    Chat with service providers
                  </p>
                </div>
                <ConversationList
                  selectedConversationId={selectedConversationId || undefined}
                  onConversationSelect={handleConversationSelect}
                  className="h-[calc(100%-5rem)]"
                />
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Chat Window Panel */}
            <ResizablePanel defaultSize={70}>
              <ChatWindow
                conversationId={selectedConversationId}
                className="h-full"
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
}
