"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationController = void 0;
const conversationService_1 = require("../services/conversationService");
class ConversationController {
    /**
     * GET /api/v1/conversations
     * Get all conversations for the authenticated user
     */
    static async getUserConversations(req, res) {
        try {
            const userId = req.user.id;
            const conversations = await conversationService_1.ConversationService.getUserConversations(userId);
            const response = {
                success: true,
                data: { conversations },
                message: 'Conversations retrieved successfully',
            };
            res.json(response);
        }
        catch (error) {
            console.error('Get conversations error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to retrieve conversations';
            const response = {
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
    static async createConversationWithProvider(req, res) {
        try {
            const currentUserId = req.user.id;
            const providerId = req.params.userId;
            // Validate that the target user is a provider
            // This could be enhanced with a database check, but for now we'll trust the route
            const conversation = await conversationService_1.ConversationService.findOrCreateConversation(currentUserId, providerId);
            const response = {
                success: true,
                data: { conversation },
                message: 'Conversation created or retrieved successfully',
            };
            res.status(201).json(response);
        }
        catch (error) {
            console.error('Create conversation error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to create conversation';
            const response = {
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
    static async getConversationMessages(req, res) {
        try {
            const userId = req.user.id;
            const conversationId = req.params.conversationId;
            const conversation = await conversationService_1.ConversationService.getConversationWithMessages(conversationId, userId);
            const response = {
                success: true,
                data: { messages: conversation.messages },
                message: 'Messages retrieved successfully',
            };
            res.json(response);
        }
        catch (error) {
            console.error('Get conversation messages error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to retrieve messages';
            const response = {
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
    static async sendMessage(req, res) {
        try {
            const userId = req.user.id;
            const conversationId = req.params.conversationId;
            const { content } = req.body;
            if (!content || typeof content !== 'string' || content.trim().length === 0) {
                const response = {
                    success: false,
                    error: 'Message content is required',
                };
                res.status(400).json(response);
                return;
            }
            if (content.length > 1000) {
                const response = {
                    success: false,
                    error: 'Message content cannot exceed 1000 characters',
                };
                res.status(400).json(response);
                return;
            }
            const message = await conversationService_1.ConversationService.createMessage(conversationId, userId, content.trim());
            const response = {
                success: true,
                data: { message },
                message: 'Message sent successfully',
            };
            res.status(201).json(response);
        }
        catch (error) {
            console.error('Send message error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
            const response = {
                success: false,
                error: errorMessage,
            };
            const statusCode = errorMessage.includes('not found') ? 404 : 500;
            res.status(statusCode).json(response);
        }
    }
}
exports.ConversationController = ConversationController;
