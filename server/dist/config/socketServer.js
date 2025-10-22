"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketServer = void 0;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authService_1 = require("../services/authService");
const conversationService_1 = require("../services/conversationService");
const app_1 = require("./app");
class SocketServer {
    io;
    constructor(httpServer) {
        this.io = new socket_io_1.Server(httpServer, {
            cors: {
                origin: app_1.appConfig.corsOrigin,
                methods: ['GET', 'POST'],
                credentials: true,
            },
            pingTimeout: 60000,
            pingInterval: 25000,
        });
        this.setupMiddleware();
        this.setupEventHandlers();
    }
    /**
     * Setup Socket.io middleware for authentication
     */
    setupMiddleware() {
        this.io.use(async (socket, next) => {
            try {
                const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
                if (!token) {
                    return next(new Error('Authentication token required'));
                }
                // Verify JWT token
                const decoded = jsonwebtoken_1.default.verify(token, app_1.appConfig.jwtSecret);
                // Get user information
                const user = await authService_1.AuthService.getUserById(decoded.userId);
                if (!user) {
                    return next(new Error('User not found'));
                }
                socket.userId = user.id;
                socket.user = user;
                next();
            }
            catch (error) {
                console.error('Socket authentication error:', error);
                next(new Error('Authentication failed'));
            }
        });
    }
    /**
     * Setup Socket.io event handlers
     */
    setupEventHandlers() {
        this.io.on('connection', (socket) => {
            console.log(`User ${socket.userId} connected with socket ${socket.id}`);
            // Handle joining a conversation room
            socket.on('join_room', async (conversationId) => {
                try {
                    // Verify user has access to this conversation
                    const conversation = await conversationService_1.ConversationService.getConversationWithMessages(conversationId, socket.userId);
                    // Leave any previous rooms
                    socket.rooms.forEach(room => {
                        if (room !== socket.id) {
                            socket.leave(room);
                        }
                    });
                    // Join the conversation room
                    socket.join(conversationId);
                    console.log(`User ${socket.userId} joined conversation ${conversationId}`);
                    // Confirm successful join
                    socket.emit('joined_room', { conversationId });
                }
                catch (error) {
                    console.error('Join room error:', error);
                    socket.emit('error', {
                        event: 'join_room',
                        message: error instanceof Error ? error.message : 'Failed to join room'
                    });
                }
            });
            // Handle sending messages
            socket.on('send_message', async (data) => {
                try {
                    const { conversationId, content } = data;
                    // Validate input
                    if (!conversationId || !content || typeof content !== 'string' || content.trim().length === 0) {
                        socket.emit('error', {
                            event: 'send_message',
                            message: 'Invalid message data'
                        });
                        return;
                    }
                    if (content.length > 1000) {
                        socket.emit('error', {
                            event: 'send_message',
                            message: 'Message content cannot exceed 1000 characters'
                        });
                        return;
                    }
                    // Create message in database
                    const message = await conversationService_1.ConversationService.createMessage(conversationId, socket.userId, content.trim());
                    // Broadcast message to all users in the conversation room
                    this.io.to(conversationId).emit('receive_message', {
                        message,
                        conversationId
                    });
                    // Confirm message sent to sender
                    socket.emit('message_sent', {
                        messageId: message.id,
                        conversationId
                    });
                }
                catch (error) {
                    console.error('Send message error:', error);
                    socket.emit('error', {
                        event: 'send_message',
                        message: error instanceof Error ? error.message : 'Failed to send message'
                    });
                }
            });
            // Handle disconnect
            socket.on('disconnect', (reason) => {
                console.log(`User ${socket.userId} disconnected (${reason})`);
            });
            // Handle connection errors
            socket.on('error', (error) => {
                console.error(`Socket error for user ${socket.userId}:`, error);
            });
        });
    }
    /**
     * Get the Socket.io server instance
     */
    getIO() {
        return this.io;
    }
    /**
     * Send message to specific conversation (utility method)
     */
    sendToConversation(conversationId, event, data) {
        this.io.to(conversationId).emit(event, data);
    }
    /**
     * Send message to specific user (utility method)
     */
    sendToUser(userId, event, data) {
        // Find all sockets for this user
        const sockets = this.getSocketsByUserId(userId);
        sockets.forEach(socket => {
            socket.emit(event, data);
        });
    }
    /**
     * Get all sockets for a specific user
     */
    getSocketsByUserId(userId) {
        const sockets = [];
        this.io.sockets.sockets.forEach(socket => {
            if (socket.userId === userId) {
                sockets.push(socket);
            }
        });
        return sockets;
    }
}
exports.SocketServer = SocketServer;
