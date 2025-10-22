export enum UserRole {
  OWNER = 'OWNER',
  PROVIDER = 'PROVIDER',
}

export enum ServiceType {
  WALKING = 'WALKING',
  SITTING = 'SITTING',
  GROOMING = 'GROOMING',
  VETERINARIAN_VISIT = 'VETERINARIAN_VISIT',
  TAXI = 'TAXI',
  TRAINING = 'TRAINING',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

