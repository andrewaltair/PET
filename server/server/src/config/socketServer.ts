import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { AuthService } from '../services/authService';
import { ConversationService } from '../services/conversationService';
import { appConfig } from './app';

export interface AuthenticatedSocket extends Socket {
  userId?: string;
  user?: any;
}

export class SocketServer {
  private io: SocketIOServer;

  constructor(httpServer: HttpServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: appConfig.corsOrigin,
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
  private setupMiddleware(): void {
    this.io.use(async (socket: AuthenticatedSocket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');

        if (!token) {
          return next(new Error('Authentication token required'));
        }

        // Verify JWT token
        const decoded = jwt.verify(token, appConfig.jwtSecret) as { userId: string };

        // Get user information
        const user = await AuthService.getUserById(decoded.userId);
        if (!user) {
          return next(new Error('User not found'));
        }

        socket.userId = user.id;
        socket.user = user;
        next();
      } catch (error) {
        console.error('Socket authentication error:', error);
        next(new Error('Authentication failed'));
      }
    });
  }

  /**
   * Setup Socket.io event handlers
   */
  private setupEventHandlers(): void {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      console.log(`User ${socket.userId} connected with socket ${socket.id}`);

      // Handle joining a conversation room
      socket.on('join_room', async (conversationId: string) => {
        try {
          // Verify user has access to this conversation
          const conversation = await ConversationService.getConversationWithMessages(conversationId, socket.userId!);

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

        } catch (error) {
          console.error('Join room error:', error);
          socket.emit('error', {
            event: 'join_room',
            message: error instanceof Error ? error.message : 'Failed to join room'
          });
        }
      });

      // Handle sending messages
      socket.on('send_message', async (data: { conversationId: string; content: string }) => {
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
          const message = await ConversationService.createMessage(
            conversationId,
            socket.userId!,
            content.trim()
          );

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

        } catch (error) {
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
  public getIO(): SocketIOServer {
    return this.io;
  }

  /**
   * Send message to specific conversation (utility method)
   */
  public sendToConversation(conversationId: string, event: string, data: any): void {
    this.io.to(conversationId).emit(event, data);
  }

  /**
   * Send message to specific user (utility method)
   */
  public sendToUser(userId: string, event: string, data: any): void {
    // Find all sockets for this user
    const sockets = this.getSocketsByUserId(userId);
    sockets.forEach(socket => {
      socket.emit(event, data);
    });
  }

  /**
   * Get all sockets for a specific user
   */
  private getSocketsByUserId(userId: string): AuthenticatedSocket[] {
    const sockets: AuthenticatedSocket[] = [];
    this.io.sockets.sockets.forEach(socket => {
      if ((socket as AuthenticatedSocket).userId === userId) {
        sockets.push(socket as AuthenticatedSocket);
      }
    });
    return sockets;
  }
}
