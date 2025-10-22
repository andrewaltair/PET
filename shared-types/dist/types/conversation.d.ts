import { User } from './user';
import { Message } from './message';
export interface Conversation {
    id: string;
    participants: User[];
    messages: Message[];
    createdAt: string;
    updatedAt: string;
}
export interface ConversationWithLastMessage {
    id: string;
    participants: User[];
    lastMessage?: Message;
    createdAt: string;
    updatedAt: string;
}
export interface CreateConversationRequest {
    participantId: string;
}
export interface ConversationResponse {
    conversation: Conversation;
}
export interface ConversationsResponse {
    conversations: ConversationWithLastMessage[];
}
