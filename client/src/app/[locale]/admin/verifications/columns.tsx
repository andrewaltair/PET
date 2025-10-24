'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

export type Verification = {
  id: string;
  email: string;
  role: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    location?: string;
    avatarUrl?: string;
  };
};

export const columns: ColumnDef<Verification>[] = [
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('email')}</div>;
    },
  },
  {
    accessorKey: 'profile',
    header: 'Name',
    cell: ({ row }) => {
      const profile = row.original.profile;
      if (profile?.firstName || profile?.lastName) {
        return `${profile.firstName || ''} ${profile.lastName || ''}`.trim();
      }
      return '-';
    },
  },
  {
    accessorKey: 'profile.bio',
    header: 'Bio',
    cell: ({ row }) => {
      const bio = row.original.profile?.bio;
      return (
        <div className="text-sm text-gray-600 truncate max-w-md">
          {bio || '-'}
        </div>
      );
    },
  },
  {
    accessorKey: 'profile.location',
    header: 'Location',
    cell: ({ row }) => {
      const location = row.original.profile?.location;
      return <div className="text-sm">{location || '-'}</div>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const provider = row.original;
      
      return (
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="default"
            onClick={() => {
              // TODO: Implement approve
              console.log('Approve provider:', provider.id);
            }}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              // TODO: Implement reject
              console.log('Reject provider:', provider.id);
            }}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Reject
          </Button>
        </div>
      );
    },
  },
];

