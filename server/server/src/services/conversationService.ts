import { prisma } from '../config/database';
import { Conversation, ConversationWithLastMessage, Message, User } from 'petservice-marketplace-shared-types';

export class ConversationService {
  /**
   * Get all conversations for a user
   */
  static async getUserConversations(userId: string): Promise<ConversationWithLastMessage[]> {
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            id: userId
          }
        }
      },
      include: {
        participants: {
          select: {
            id: true,
            email: true,
            role: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                avatarUrl: true
              }
            }
          }
        },
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                email: true,
                role: true,
                profile: {
                  select: {
                    firstName: true,
                    lastName: true,
                    avatarUrl: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return conversations.map(conversation => ({
      id: conversation.id,
      participants: conversation.participants.map(p => ({
        id: p.id,
        email: p.email,
        role: p.role,
        createdAt: '',
        updatedAt: '',
        profile: p.profile ? {
          id: '',
          userId: p.id,
          firstName: p.profile.firstName,
          lastName: p.profile.lastName,
          avatarUrl: p.profile.avatarUrl,
          bio: '',
          location: '',
          overallAverageRating: 0,
          createdAt: '',
          updatedAt: ''
        } : undefined
      })),
      lastMessage: conversation.messages[0] ? {
        id: conversation.messages[0].id,
        conversationId: conversation.messages[0].conversationId,
        senderId: conversation.messages[0].senderId,
        content: conversation.messages[0].content,
        createdAt: conversation.messages[0].createdAt.toISOString(),
        sender: {
          id: conversation.messages[0].sender.id,
          email: conversation.messages[0].sender.email,
          role: conversation.messages[0].sender.role,
          createdAt: '',
          updatedAt: '',
          profile: conversation.messages[0].sender.profile ? {
            id: '',
            userId: conversation.messages[0].sender.id,
            firstName: conversation.messages[0].sender.profile.firstName,
            lastName: conversation.messages[0].sender.profile.lastName,
            avatarUrl: conversation.messages[0].sender.profile.avatarUrl,
            bio: '',
            location: '',
            overallAverageRating: 0,
            createdAt: '',
            updatedAt: ''
          } : undefined
        }
      } : undefined,
      createdAt: conversation.createdAt.toISOString(),
      updatedAt: conversation.updatedAt.toISOString()
    }));
  }

  /**
   * Find or create a conversation between current user and another participant
   */
  static async findOrCreateConversation(currentUserId: string, participantId: string): Promise<Conversation> {
    // First, check if a conversation already exists between these two users
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { id: currentUserId } } },
          { participants: { some: { id: participantId } } },
          { participants: { every: { id: { in: [currentUserId, participantId] } } } }
        ]
      },
      include: {
        participants: {
          select: {
            id: true,
            email: true,
            role: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                avatarUrl: true
              }
            }
          }
        },
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                email: true,
                role: true,
                profile: {
                  select: {
                    firstName: true,
                    lastName: true,
                    avatarUrl: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (existingConversation) {
      return this.formatConversation(existingConversation);
    }

    // Create new conversation
    const newConversation = await prisma.conversation.create({
      data: {
        participants: {
          connect: [
            { id: currentUserId },
            { id: participantId }
          ]
        }
      },
      include: {
        participants: {
          select: {
            id: true,
            email: true,
            role: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                avatarUrl: true
              }
            }
          }
        },
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                email: true,
                role: true,
                profile: {
                  select: {
                    firstName: true,
                    lastName: true,
                    avatarUrl: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    return this.formatConversation(newConversation);
  }

  /**
   * Get conversation by ID with messages
   */
  static async getConversationWithMessages(conversationId: string, userId: string): Promise<Conversation> {
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        participants: {
          some: {
            id: userId
          }
        }
      },
      include: {
        participants: {
          select: {
            id: true,
            email: true,
            role: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                avatarUrl: true
              }
            }
          }
        },
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                email: true,
                role: true,
                profile: {
                  select: {
                    firstName: true,
                    lastName: true,
                    avatarUrl: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (!conversation) {
      throw new Error('Conversation not found or access denied');
    }

    return this.formatConversation(conversation);
  }

  /**
   * Create a new message
   */
  static async createMessage(conversationId: string, senderId: string, content: string): Promise<Message> {
    // First, verify the user is a participant in the conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        participants: {
          some: {
            id: senderId
          }
        }
      }
    });

    if (!conversation) {
      throw new Error('Conversation not found or access denied');
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId,
        content
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            role: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                avatarUrl: true
              }
            }
          }
        }
      }
    });

    // Update conversation updatedAt timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    });

    return {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
      sender: {
        id: message.sender.id,
        email: message.sender.email,
        role: message.sender.role,
        createdAt: '',
        updatedAt: '',
        profile: message.sender.profile ? {
          id: '',
          userId: message.sender.id,
          firstName: message.sender.profile.firstName,
          lastName: message.sender.profile.lastName,
          avatarUrl: message.sender.profile.avatarUrl,
          bio: '',
          location: '',
          overallAverageRating: 0,
          createdAt: '',
          updatedAt: ''
        } : undefined
      }
    };
  }

  /**
   * Format conversation for API response
   */
  private static formatConversation(conversation: any): Conversation {
    return {
      id: conversation.id,
      participants: conversation.participants.map((p: any) => ({
        id: p.id,
        email: p.email,
        role: p.role,
        createdAt: '',
        updatedAt: '',
        profile: p.profile ? {
          id: '',
          userId: p.id,
          firstName: p.profile.firstName,
          lastName: p.profile.lastName,
          avatarUrl: p.profile.avatarUrl,
          bio: '',
          location: '',
          overallAverageRating: 0,
          createdAt: '',
          updatedAt: ''
        } : undefined
      })),
      messages: conversation.messages.map((m: any) => ({
        id: m.id,
        conversationId: m.conversationId,
        senderId: m.senderId,
        content: m.content,
        createdAt: m.createdAt.toISOString(),
        sender: {
          id: m.sender.id,
          email: m.sender.email,
          role: m.sender.role,
          createdAt: '',
          updatedAt: '',
          profile: m.sender.profile ? {
            id: '',
            userId: m.sender.id,
            firstName: m.sender.profile.firstName,
            lastName: m.sender.profile.lastName,
            avatarUrl: m.sender.profile.avatarUrl,
            bio: '',
            location: '',
            overallAverageRating: 0,
            createdAt: '',
            updatedAt: ''
          } : undefined
        }
      })),
      createdAt: conversation.createdAt.toISOString(),
      updatedAt: conversation.updatedAt.toISOString()
    };
  }
}
