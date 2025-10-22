import { useMutation, UseMutationResult, UseMutationOptions } from '@tanstack/react-query';

/**
 * A reusable, type-safe custom React Query hook for data mutation operations.
 *
 * @template TData - The type of data returned from the API call on success
 * @template TError - The type of error returned from the API call on failure
 * @template TVariables - The type of variables passed to the mutation function
 *
 * @param mutationFn - The mutation function that takes variables and returns a Promise of TData
 * @param options - Optional mutation options including onSuccess, onError, onMutate, etc.
 *
 * @returns UseMutationResult with properly typed data, error, loading states, and mutate function
 *
 * @example
 * ```typescript
 * // Define your API types
 * interface CreateUserRequest {
 *   name: string;
 *   email: string;
 * }
 *
 * interface User {
 *   id: string;
 *   name: string;
 *   email: string;
 * }
 *
 * // Use the hook in a component
 * const createUserMutation = useMutateData<User, Error, CreateUserRequest>(
 *   async (userData) => {
 *     const response = await api.post('/users', userData);
 *     return response.data;
 *   },
 *   {
 *     onSuccess: (data) => {
 *       console.log('User created:', data);
 *       queryClient.invalidateQueries(['users']);
 *     },
 *     onError: (error) => {
 *       console.error('Failed to create user:', error);
 *     },
 *   }
 * );
 *
 * // Use in component
 * const handleSubmit = (userData: CreateUserRequest) => {
 *   createUserMutation.mutate(userData);
 * };
 *
 * return (
 *   <button
 *     onClick={() => handleSubmit({ name: 'John', email: 'john@example.com' })}
 *     disabled={createUserMutation.isPending}
 *   >
 *     {createUserMutation.isPending ? 'Creating...' : 'Create User'}
 *   </button>
 * );
 * ```
 */
export function useMutateData<TData = unknown, TError = Error, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, TError, TVariables>
): UseMutationResult<TData, TError, TVariables> {
  return useMutation<TData, TError, TVariables>({
    mutationFn,
    ...options,
  });
}
