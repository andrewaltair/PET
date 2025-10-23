import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { TopRatedProvider } from 'petservice-marketplace-shared-types';

export function useFeaturedProviders() {
  return useQuery({
    queryKey: ['featured-providers'],
    queryFn: async (): Promise<TopRatedProvider[]> => {
      const response = await api.get('/profiles/featured-providers');
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
