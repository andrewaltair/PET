import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

/**
 * A reusable, type-safe custom React Query hook for data fetching operations.
 *
 * @template TData - The type of data returned from the API call on success
 * @template TError - The type of error returned from the API call on failure
 *
 * @param queryKey - The query key for caching and invalidation
 * @param queryFn - The query function that returns a Promise of TData
 * @param options - Optional query options including staleTime, retry, etc.
 *
 * @returns UseQueryResult with properly typed data, error, loading states
 *
 * @example
 * ```typescript
 * // Define your API types
 * interface UserProfile {
 *   id: string;
 *   name: string;
 *   email: string;
 * }
 *
 * // Use the hook in a component
 * const { data: userProfile, isLoading, isError } = useFetchData<UserProfile>(
 *   ['userProfile', userId],
 *   () => usersAPI.getUserProfile({ userId }),
 *   {
 *     enabled: !!userId,
 *     staleTime: 5 * 60 * 1000, // 5 minutes
 *   }
 * );
 * ```
 */
export function useFetchData<TData = unknown, TError = Error>(
  queryKey: any[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
): UseQueryResult<TData, TError> {
  return useQuery<TData, TError>({
    queryKey,
    queryFn,
    ...options,
  });
}
