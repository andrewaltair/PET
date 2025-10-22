import { Request, Response } from 'express';
import { ConversationService } from '../services/conversationService';
import { ConversationsResponse, ConversationResponse, MessagesResponse, ApiResponse } from 'petservice-marketplace-shared-types';

export class ConversationController {
  /**
   * GET /api/v1/conversations
   * Get all conversations for the authenticated user
   */
  static async getUserConversations(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const conversations = await ConversationService.getUserConversations(userId);

      const response: ApiResponse<ConversationsResponse> = {
        success: true,
        data: { conversations },
        message: 'Conversations retrieved successfully',
      };

      res.json(response);
    } catch (error) {
      console.error('Get conversations error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Failed to retrieve conversations';

      const response: ApiResponse = {
        success: false,
        error: errorMessage,
      };

      res.status(500).json(response);
    }
  }

  /**
   * POST /api/v1/conversations/provider/:userId
   * Create or get existing conversation with a provider
   */
  static async createConversationWithProvider(req: Request, res: Response): Promise<void> {
    try {
      const currentUserId = req.user!.id;
      const providerId = req.params.userId;

      // Validate that the target user is a provider
      // This could be enhanced with a database check, but for now we'll trust the route

      const conversation = await ConversationService.findOrCreateConversation(currentUserId, providerId);

      const response: ApiResponse<ConversationResponse> = {
        success: true,
        data: { conversation },
        message: 'Conversation created or retrieved successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Create conversation error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Failed to create conversation';

      const response: ApiResponse = {
        success: false,
        error: errorMessage,
      };

      res.status(400).json(response);
    }
  }

  /**
   * GET /api/v1/conversations/:conversationId/messages
   * Get all messages for a specific conversation
   */
  static async getConversationMessages(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const conversationId = req.params.conversationId;

      const conversation = await ConversationService.getConversationWithMessages(conversationId, userId);

      const response: ApiResponse<MessagesResponse> = {
        success: true,
        data: { messages: conversation.messages },
        message: 'Messages retrieved successfully',
      };

      res.json(response);
    } catch (error) {
      console.error('Get conversation messages error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Failed to retrieve messages';

      const response: ApiResponse = {
        success: false,
        error: errorMessage,
      };

      const statusCode = errorMessage.includes('not found') ? 404 : 500;
      res.status(statusCode).json(response);
    }
  }

  /**
   * POST /api/v1/conversations/:conversationId/messages
   * Send a message to a conversation (used by REST API, Socket.io handles real-time)
   */
  static async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const conversationId = req.params.conversationId;
      const { content } = req.body;

      if (!content || typeof content !== 'string' || content.trim().length === 0) {
        const response: ApiResponse = {
          success: false,
          error: 'Message content is required',
        };
        res.status(400).json(response);
        return;
      }

      if (content.length > 1000) {
        const response: ApiResponse = {
          success: false,
          error: 'Message content cannot exceed 1000 characters',
        };
        res.status(400).json(response);
        return;
      }

      const message = await ConversationService.createMessage(conversationId, userId, content.trim());

      const response: ApiResponse = {
        success: true,
        data: { message },
        message: 'Message sent successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Send message error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';

      const response: ApiResponse = {
        success: false,
        error: errorMessage,
      };

      const statusCode = errorMessage.includes('not found') ? 404 : 500;
      res.status(statusCode).json(response);
    }
  }
}
