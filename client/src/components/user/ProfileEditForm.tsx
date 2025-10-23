'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { usersAPI, UserProfile, UpdateUserProfileRequest } from '@/api/users';
import { useFetchData } from '@/hooks/useFetchData';
import { useMutateData } from '@/hooks/useMutateData';
import { AlertCircle, Save } from 'lucide-react';

// Zod schema for form validation
const profileEditSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional().or(z.literal('')),
  services: z.string().max(1000, 'Services list must be less than 1000 characters').optional().or(z.literal('')),
});

type ProfileEditFormData = z.infer<typeof profileEditSchema>;

interface ProfileEditFormProps {
  userId: string;
}

export function ProfileEditForm({ userId }: ProfileEditFormProps) {
  const queryClient = useQueryClient();

  // Fetch current user profile data
  const {
    data: userProfile,
    isLoading: isLoadingProfile,
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

  // Mutation for updating user profile
  const updateProfileMutation = useMutateData<UserProfile, Error, UpdateUserProfileRequest>(
    (updateData) => usersAPI.updateUserProfile({ userId, updateData }),
    {
      onSuccess: (updatedProfile) => {
        // Invalidate the user profile cache to ensure UserProfileDisplay is instantly updated
        queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
        // Also invalidate any other user-related queries that might be affected
        queryClient.invalidateQueries({ queryKey: ['user'], exact: false });
      },
    }
  );

  // Initialize form with fetched data as default values
  const form = useForm<ProfileEditFormData>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      name: userProfile?.name || '',
      bio: userProfile?.bio || '',
      services: userProfile?.services ? userProfile.services.join(', ') : '',
    },
    // Re-initialize form when userProfile data is loaded
    values: userProfile ? {
      name: userProfile.name,
      bio: userProfile.bio || '',
      services: userProfile.services ? userProfile.services.join(', ') : '',
    } : undefined,
  });

  // Handle form submission
  const onSubmit = (data: ProfileEditFormData) => {
    // Convert comma-separated services string back to string array
    const servicesArray = data.services
      ? data.services.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : null;

    const updateData: UpdateUserProfileRequest = {
      name: data.name,
      bio: data.bio || null,
      services: servicesArray,
    };

    updateProfileMutation.mutate(updateData);
  };

  // Loading state - show skeleton while fetching profile
  if (isLoadingProfile) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-20 w-full" />
          </div>
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>
    );
  }

  // Error state
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

  // No profile data
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
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bio Field */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about yourself..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional. Share a brief description about yourself and your services.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Services Field */}
            <FormField
              control={form.control}
              name="services"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Services</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Dog walking, Pet sitting, Grooming"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional. List your services separated by commas (e.g., "Dog walking, Pet sitting, Grooming").
                    These will be converted to a list for display.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="w-full sm:w-auto"
            >
              {updateProfileMutation.isPending ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>

            {/* Mutation Error Display */}
            {updateProfileMutation.isError && (
              <div className="text-sm text-destructive">
                Failed to update profile: {updateProfileMutation.error?.message}
              </div>
            )}

            {/* Success Message */}
            {updateProfileMutation.isSuccess && (
              <div className="text-sm text-blue-600">
                Profile updated successfully!
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
