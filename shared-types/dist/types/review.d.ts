export interface Review {
    id: string;
    bookingId: string;
    serviceId: string;
    ownerId: string;
    providerId: string;
    rating: number;
    comment?: string;
    createdAt: Date;
}
export interface CreateReviewRequest {
    bookingId: string;
    rating: number;
    comment?: string;
}
export interface ReviewWithDetails extends Review {
    owner: {
        id: string;
        firstName?: string;
        lastName?: string;
    };
    service: {
        id: string;
        title: string;
    };
    provider: {
        id: string;
        firstName?: string;
        lastName?: string;
    };
}
export interface ServiceWithRating {
    id: string;
    title: string;
    description: string;
    price: number;
    availability: Record<string, string[]>;
    averageRating: number;
    providerId: string;
    provider: {
        id: string;
        firstName?: string;
        lastName?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
export interface ProfileWithRating {
    id: string;
    userId: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    bio?: string;
    location?: string;
    overallAverageRating: number;
    createdAt: Date;
    updatedAt: Date;
}
