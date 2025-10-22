'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { useMyServices, useDeleteService } from '../../../hooks/useServices';
import { UserRole } from 'petservice-marketplace-shared-types';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { ServiceManagementCardSkeleton } from '../../../components/ServiceManagementCardSkeleton';
import { Button } from '../../../components/ui/button';
import { ConfirmationDialog } from '../../../components/ui/confirmation-dialog';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../../../components/ui/breadcrumb';
import { ServiceType } from 'petservice-marketplace-shared-types';
import { Edit, Trash2 } from 'lucide-react';

function ServicesList() {
  const { user } = useAuth();
  const router = useRouter();
  const { data: services, isPending, error } = useMyServices();
  const deleteMutation = useDeleteService();
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    serviceId: string;
    serviceTitle: string;
  }>({
    open: false,
    serviceId: "",
    serviceTitle: "",
  });

  const handleDelete = (serviceId: string, serviceTitle: string) => {
    setConfirmDialog({
      open: true,
      serviceId,
      serviceTitle,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteMutation.mutateAsync(confirmDialog.serviceId);
      setConfirmDialog({ open: false, serviceId: "", serviceTitle: "" });
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  const handleEdit = (serviceId: string) => {
    router.push(`/dashboard/services/edit/${serviceId}`);
  };

  const getServiceTypeLabel = (serviceType: ServiceType): string => {
    const labels: Record<ServiceType, string> = {
      [ServiceType.WALKING]: 'Dog Walking',
      [ServiceType.SITTING]: 'Pet Sitting',
      [ServiceType.GROOMING]: 'Grooming',
      [ServiceType.VETERINARIAN_VISIT]: 'Vet Visit',
      [ServiceType.TAXI]: 'Pet Taxi',
      [ServiceType.TRAINING]: 'Training',
    };
    return labels[serviceType] || serviceType;
  };

  const formatAvailability = (availability: Record<string, string[]>): string => {
    const days = Object.keys(availability);
    if (days.length === 0) return 'No availability set';

    const sampleDay = days[0];
    const timeSlots = availability[sampleDay];
    return `${days.length} days available, ${timeSlots.length} time slots`;
  };

  if (user?.role !== UserRole.PROVIDER) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            Only service providers can manage services.
          </p>
          <Button asChild className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md">
            <Link href="/dashboard">
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header skeleton */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="h-8 bg-gray-300 rounded w-36 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-56 animate-pulse"></div>
            </div>
            <div className="h-10 bg-gray-300 rounded w-40 animate-pulse"></div>
          </div>

          {/* Services Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <ServiceManagementCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">
            Failed to load services
          </div>
          <p className="text-gray-600 mb-4">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
          <Button asChild variant="outline" className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md">
            <Link href="/dashboard">
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>My Services</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900">My Services</h1>
            <p className="text-gray-600 mt-2">
              Manage your pet service offerings
            </p>
          </div>
          <Button asChild className="shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 font-semibold">
            <Link href="/dashboard/services/new">
              + Add New Service
            </Link>
          </Button>
        </div>

        {/* Services List */}
        {!services || services.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏢</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No services yet
            </h2>
            <p className="text-gray-600 mb-6">
              Create your first service to start offering pet care services.
            </p>
            <Button asChild className="shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 font-semibold">
              <Link href="/dashboard/services/new">
                Create Your First Service
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  {/* Service Type Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {getServiceTypeLabel(service.serviceType)}
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      ${Number(service.price).toFixed(2)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {service.description}
                  </p>

                  {/* Availability */}
                  <div className="text-sm text-gray-500 mb-4">
                    {formatAvailability(service.availability)}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200 gap-2">
                    <Button
                      onClick={() => handleEdit(service.id)}
                      variant="outline"
                      size="sm"
                      disabled={deleteMutation.isPending}
                      className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(service.id, service.title)}
                      variant="destructive"
                      size="sm"
                      disabled={deleteMutation.isPending}
                      className="shadow-sm hover:shadow-md transform hover:scale-[1.02] transition-all duration-200 font-semibold"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {services && services.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{services.length}</div>
                <div className="text-sm text-gray-600">Total Services</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${services.reduce((sum, service) => sum + Number(service.price), 0).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Total Value</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(services.map(s => s.serviceType)).size}
                </div>
                <div className="text-sm text-gray-600">Service Types</div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Dialog */}
        <ConfirmationDialog
          open={confirmDialog.open}
          onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}
          title="Delete Service"
          description={`Are you sure you want to delete "${confirmDialog.serviceTitle}"? This action cannot be undone.`}
          confirmText="Delete"
          onConfirm={handleConfirmDelete}
          variant="destructive"
        />
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <ProtectedRoute>
      <ServicesList />
    </ProtectedRoute>
  );
}
