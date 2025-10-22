'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { usersAPI, UserProfile } from '@/api/users';
import { useFetchData } from '@/hooks/useFetchData';
import { AlertCircle } from 'lucide-react';

interface UserProfileDisplayProps {
  userId: string;
}

export function UserProfileDisplay({ userId }: UserProfileDisplayProps) {
  const {
    data: userProfile,
    isLoading,
    isError,
    error,
  } = useFetchData<UserProfile>(
    ['userProfile', userId],
    () => usersAPI.getUserProfile({ userId }),
    {
      enabled: !!userId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 401 (unauthorized) or 404 (not found)
        if (error?.response?.status === 401 || error?.response?.status === 404) {
          return false;
        }
        return failureCount < 3;
      },
    }
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center space-y-2">
            <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
            <p className="text-sm text-muted-foreground">
              {error?.message || 'Failed to load user profile'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userProfile) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-sm text-muted-foreground">No user profile found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Name</p>
          <p className="text-sm">{userProfile.name}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Email</p>
          <p className="text-sm">{userProfile.email}</p>
        </div>

        {userProfile.bio && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Bio</p>
            <p className="text-sm">{userProfile.bio}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
