'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';

export type Service = {
  id: string;
  title: string;
  description: string;
  serviceType: string;
  price: number;
  provider: {
    id: string;
    email: string;
    profile?: {
      firstName?: string;
      lastName?: string;
    };
  };
  _count?: {
    bookings: number;
    reviews: number;
  };
};

export const columns: ColumnDef<Service>[] = [
  {
    accessorKey: 'title',
    header: 'Service',
    cell: ({ row }) => {
      const service = row.original;
      return (
        <div>
          <div className="font-medium">{service.title}</div>
          <div className="text-sm text-gray-600 truncate max-w-md">
            {service.description}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'serviceType',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('serviceType') as string;
      return (
        <Badge variant="outline">{type}</Badge>
      );
    },
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => {
      const price = row.getValue('price') as number;
      return <div className="font-medium">${price}</div>;
    },
  },
  {
    accessorKey: 'provider',
    header: 'Provider',
    cell: ({ row }) => {
      const provider = row.original.provider;
      const name = provider.profile
        ? `${provider.profile.firstName || ''} ${provider.profile.lastName || ''}`.trim()
        : provider.email;
      return <div className="text-sm">{name}</div>;
    },
  },
  {
    accessorKey: '_count',
    header: 'Activity',
    cell: ({ row }) => {
      const counts = row.getValue('_count') as { bookings?: number; reviews?: number };
      return (
        <div className="text-sm text-gray-600">
          {counts?.bookings || 0} bookings, {counts?.reviews || 0} reviews
        </div>
      );
    },
  },
];

