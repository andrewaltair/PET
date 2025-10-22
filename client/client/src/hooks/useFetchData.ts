import { useQuery, QueryKey, UseQueryResult } from '@tanstack/react-query';

/**
 * A reusable, type-safe custom React Query hook for fetching data from REST endpoints.
 *
 * @template TData - The type of data returned from the API call
 * @template TParams - The type of parameters passed to the API function
 *
 * @param queryKey - The React Query key for caching and invalidation
 * @param apiFn - The API function that takes params and returns a Promise of TData
 * @param params - The parameters to pass to the API function
 *
 * @returns UseQueryResult with properly typed data, error, and loading states
 */
export function useFetchData<TData, TParams>(
  queryKey: QueryKey,
  apiFn: (params: TParams) => Promise<TData>,
  params: TParams
): UseQueryResult<TData, Error> {
  return useQuery<TData, Error>({
    queryKey,
    queryFn: () => apiFn(params),
  });
}
