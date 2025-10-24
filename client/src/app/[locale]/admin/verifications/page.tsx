'use client';

import { useQuery } from '@tanstack/react-query';
import { adminAPI } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { columns, Verification } from './columns';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function AdminVerificationsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'verifications'],
    queryFn: () => adminAPI.getPendingVerifications(),
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
        <h1 className="text-3xl font-bold">Provider Verifications</h1>
        <p className="text-gray-600 mt-2">Review and approve provider accounts</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Verifications</CardTitle>
          <CardDescription>Providers needing verification</CardDescription>
        </CardHeader>
        <CardContent>
          {data && data.length > 0 ? (
            <DataTable 
              columns={columns} 
              data={data} 
              searchKey="email"
              searchPlaceholder="Search by email..."
            />
          ) : (
            <div className="text-center text-gray-500 py-8">
              No pending verifications
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
