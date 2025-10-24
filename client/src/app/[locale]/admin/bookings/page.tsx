'use client';

import { useQuery } from '@tanstack/react-query';
import { adminAPI } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { columns, Booking } from './columns';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function AdminBookingsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'bookings'],
    queryFn: () => adminAPI.getAllBookings(1, 100),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Booking Management</h1>
        <p className="text-gray-600 mt-2">View and manage all bookings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>Total bookings: {data?.pagination?.total || 0}</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={data?.data || []} 
            searchKey="service.title"
            searchPlaceholder="Search by service..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
