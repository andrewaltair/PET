import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { servicesAPI } from '../services/api';
import { Service, ServiceWithProvider, CreateServiceRequest, UpdateServiceRequest, PaginatedServicesResponse } from 'petservice-marketplace-shared-types';
import { toast } from '@/hooks/use-toast';

// Query keys
export const serviceKeys = {
  all: ['services'] as const,
  lists: () => [...serviceKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...serviceKeys.lists(), filters] as const,
  myServices: () => [...serviceKeys.all, 'my'] as const,
  details: () => [...serviceKeys.all, 'detail'] as const,
  detail: (id: string) => [...serviceKeys.details(), id] as const,
};

/**
 * Hook to get services created by current provider user
 */
export function useMyServices() {
  return useQuery({
    queryKey: serviceKeys.myServices(),
    queryFn: servicesAPI.getMyServices,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401, 403 (not authorized to access provider services)
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

/**
 * Hook to create a new service
 */
export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serviceData: CreateServiceRequest) => servicesAPI.createService(serviceData),
    onSuccess: (newService) => {
      // Invalidate and refetch my services list
      queryClient.invalidateQueries({ queryKey: serviceKeys.myServices() });
      // Also invalidate public services list
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
      toast({
        title: "Success",
        description: "Service created successfully",
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || 'Failed to create service';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook to update an existing service
 */
export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ serviceId, serviceData }: { serviceId: string; serviceData: UpdateServiceRequest }) =>
      servicesAPI.updateService(serviceId, serviceData),
    onSuccess: (updatedService, { serviceId }) => {
      // Update the service in my services list
      queryClient.setQueryData(serviceKeys.myServices(), (oldData: Service[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.map(service =>
          service.id === serviceId ? updatedService : service
        );
      });

      // Update service detail cache
      queryClient.setQueryData(serviceKeys.detail(serviceId), updatedService);

      // Invalidate public services list
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });

      toast({
        title: "Success",
        description: "Service updated successfully",
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || 'Failed to update service';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook to delete a service
 */
export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serviceId: string) => servicesAPI.deleteService(serviceId),
    onSuccess: (_, serviceId) => {
      // Remove from my services list
      queryClient.setQueryData(serviceKeys.myServices(), (oldData: Service[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.filter(service => service.id !== serviceId);
      });

      // Remove from cache
      queryClient.removeQueries({ queryKey: serviceKeys.detail(serviceId) });

      // Invalidate public services list
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });

      toast({
        title: "Success",
        description: "Service deleted successfully",
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || 'Failed to delete service';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook to get paginated public services (for infinite scroll)
 */
export function useInfiniteServices(limit: number = 10) {
  return useInfiniteQuery({
    queryKey: serviceKeys.list({ limit }),
    queryFn: ({ pageParam = 1 }) => servicesAPI.getServices(pageParam as number, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage as PaginatedServicesResponse;
      return pagination.page < pagination.totalPages ? pagination.page + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get all services with pagination (non-infinite)
 */
export function useServices(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: serviceKeys.list({ page, limit }),
    queryFn: () => servicesAPI.getServices(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get a single service detail
 */
export function useService(serviceId: string) {
  return useQuery({
    queryKey: serviceKeys.detail(serviceId),
    queryFn: () => servicesAPI.getService(serviceId),
    enabled: !!serviceId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) {
        return false; // Don't retry on not found
      }
      return failureCount < 3;
    },
  });
}
