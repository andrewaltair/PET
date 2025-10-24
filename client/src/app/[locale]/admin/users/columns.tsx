'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Shield, Trash2 } from 'lucide-react';
import { UserRole } from 'petservice-marketplace-shared-types';

export type User = {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  };
  _count?: {
    services: number;
    bookings: number;
  };
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="font-medium">{user.email}</div>
      );
    },
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.getValue('role') as string;
      return (
        <Badge variant={role === 'ADMIN' ? 'destructive' : 'default'}>
          {role}
        </Badge>
      );
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
    accessorKey: 'createdAt',
    header: 'Joined',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: '_count',
    header: 'Activity',
    cell: ({ row }) => {
      const counts = row.getValue('_count') as { services?: number; bookings?: number };
      return (
        <div className="text-sm text-gray-600">
          {counts?.services || 0} services, {counts?.bookings || 0} bookings
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original;
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                // TODO: Implement role change
                console.log('Change role for:', user.id);
              }}
            >
              <Shield className="mr-2 h-4 w-4" />
              Change Role
            </DropdownMenuItem>
            {user.role !== 'ADMIN' && (
              <DropdownMenuItem
                onClick={() => {
                  // TODO: Implement delete
                  console.log('Delete user:', user.id);
                }}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete User
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

