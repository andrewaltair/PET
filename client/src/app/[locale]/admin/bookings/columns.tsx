'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';

export type Booking = {
  id: string;
  bookingTime: string;
  status: string;
  owner: {
    id: string;
    email: string;
    profile?: {
      firstName?: string;
      lastName?: string;
    };
  };
  service: {
    id: string;
    title: string;
    serviceType: string;
    price: number;
  };
};

export const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: 'service.title',
    header: 'Service',
    cell: ({ row }) => {
      const service = row.original.service;
      return (
        <div>
          <div className="font-medium">{service.title}</div>
          <div className="text-sm text-gray-600">{service.serviceType}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'owner',
    header: 'Owner',
    cell: ({ row }) => {
      const owner = row.original.owner;
      const name = owner.profile
        ? `${owner.profile.firstName || ''} ${owner.profile.lastName || ''}`.trim()
        : owner.email;
      return <div className="text-sm">{name}</div>;
    },
  },
  {
    accessorKey: 'bookingTime',
    header: 'Booking Date',
    cell: ({ row }) => {
      const date = new Date(row.getValue('bookingTime'));
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: 'service.price',
    header: 'Price',
    cell: ({ row }) => {
      const price = row.original.service.price;
      return <div className="font-medium">${price}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const getStatusColor = (status: string) => {
        switch (status) {
          case 'CONFIRMED':
            return 'bg-green-100 text-green-800';
          case 'PENDING':
            return 'bg-yellow-100 text-yellow-800';
          case 'CANCELLED':
            return 'bg-red-100 text-red-800';
          case 'COMPLETED':
            return 'bg-blue-100 text-blue-800';
          default:
            return 'bg-gray-100 text-gray-800';
        }
      };
      return (
        <Badge className={getStatusColor(status)}>
          {status}
        </Badge>
      );
    },
  },
];

