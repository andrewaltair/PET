import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileAPI } from '../services/api';
import { Profile, UpdateProfileRequest } from 'petservice-marketplace-shared-types';
import { toast } from '@/hooks/use-toast';

// Query keys
export const profileKeys = {
  all: ['profile'] as const,
  profile: (userId?: string) => [...profileKeys.all, 'me', userId] as const,
};

/**
 * Hook to get current user's profile
 */
export function useProfile() {
  return useQuery({
    queryKey: profileKeys.profile(),
    queryFn: profileAPI.getMyProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 (unauthorized) or 403 (forbidden)
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

/**
 * Hook to update current user's profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData: UpdateProfileRequest) => profileAPI.updateMyProfile(profileData),
    onSuccess: (updatedProfile) => {
      // Update the cached profile data
      queryClient.setQueryData(profileKeys.profile(), updatedProfile);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || 'Failed to update profile';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook to create current user's profile (for first-time setup)
 */
export function useCreateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData: UpdateProfileRequest) => profileAPI.createMyProfile(profileData),
    onSuccess: (newProfile) => {
      // Update the cached profile data
      queryClient.setQueryData(profileKeys.profile(), newProfile);
      toast({
        title: "Success",
        description: "Profile created successfully",
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || 'Failed to create profile';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook to get or create profile (combines get and create logic)
 */
export function useProfileOrCreate() {
  const queryClient = useQueryClient();
  const profileQuery = useProfile();
  const createMutation = useCreateProfile();

  const handleCreateIfNeeded = async (profileData: UpdateProfileRequest) => {
    if (!profileQuery.data) {
      // Profile doesn't exist, create it
      await createMutation.mutateAsync(profileData);
    } else {
      // Profile exists, just return it (no need to create)
      return profileQuery.data;
    }
  };

  return {
    profile: profileQuery.data,
    isPending: profileQuery.isPending || createMutation.isPending,
    error: profileQuery.error || createMutation.error,
    createIfNeeded: handleCreateIfNeeded,
  };
}
