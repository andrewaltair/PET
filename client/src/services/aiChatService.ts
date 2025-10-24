import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

class AIChatService {
  private chatHistory: Map<string, ChatMessage[]> = new Map();

  /**
   * Send a message to the AI assistant
   */
  async sendMessage(userId: string, message: string): Promise<string> {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.post(
        `${API_BASE_URL}/ai/chat`,
        { message },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success && response.data.data?.response) {
        const aiResponse = response.data.data.response;
        
        // Store in chat history
        this.addToHistory(userId, 'user', message);
        this.addToHistory(userId, 'assistant', aiResponse);
        
        return aiResponse;
      } else {
        throw new Error('Invalid response from AI service');
      }
    } catch (error: any) {
      console.error('Error sending message to AI:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please login again.');
      } else if (error.response?.status === 400) {
        throw new Error(error.response.data.error || 'Invalid request');
      } else if (error.response?.status === 500) {
        throw new Error('AI service is temporarily unavailable. Please try again later.');
      } else if (error.message) {
        throw error;
      } else {
        throw new Error('Failed to get AI response. Please try again later.');
      }
    }
  }

  /**
   * Add message to chat history
   */
  private addToHistory(userId: string, role: 'user' | 'assistant', content: string): void {
    if (!this.chatHistory.has(userId)) {
      this.chatHistory.set(userId, []);
    }

    const history = this.chatHistory.get(userId)!;
    history.push({
      role,
      content,
      timestamp: new Date(),
    });

    // Keep only last 50 messages to prevent memory issues
    if (history.length > 50) {
      history.shift();
    }
  }

  /**
   * Get chat history for a user
   */
  getHistory(userId: string): ChatMessage[] {
    return this.chatHistory.get(userId) || [];
  }

  /**
   * Clear chat history for a user
   */
  clearHistory(userId: string): void {
    this.chatHistory.delete(userId);
  }

  /**
   * Clear all chat history
   */
  clearAllHistory(): void {
    this.chatHistory.clear();
  }
}

export const aiChatService = new AIChatService();

