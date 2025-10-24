'use client';

import { useQuery } from '@tanstack/react-query';
import { adminAPI } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Users, Briefcase, Calendar, Clock, TrendingUp, UserCheck } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboardPage() {
  const { data: analytics, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: () => adminAPI.getAnalytics(),
  });

  const { data: chartData, isLoading: isLoadingChart } = useQuery({
    queryKey: ['admin', 'chart-data'],
    queryFn: () => adminAPI.getChartData(30),
  });

  const { data: recentBookings, isLoading: isLoadingBookings } = useQuery({
    queryKey: ['admin', 'recent-bookings'],
    queryFn: () => adminAPI.getAllBookings(1, 5),
  });

  if (isLoadingAnalytics || isLoadingChart || isLoadingBookings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Users',
      value: analytics?.totalUsers || 0,
      icon: Users,
      description: `${analytics?.totalOwners || 0} owners, ${analytics?.totalProviders || 0} providers`,
      trend: '+12%',
    },
    {
      title: 'Total Services',
      value: analytics?.totalServices || 0,
      icon: Briefcase,
      description: 'Active service listings',
      trend: '+8%',
    },
    {
      title: 'Total Bookings',
      value: analytics?.totalBookings || 0,
      icon: Calendar,
      description: `${analytics?.pendingBookings || 0} pending`,
      trend: '+15%',
    },
    {
      title: 'Pending Verifications',
      value: analytics?.pendingVerificationsCount || 0,
      icon: UserCheck,
      description: 'Providers awaiting approval',
      trend: '-5%',
    },
  ];

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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Platform overview and statistics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-600 mt-1">{stat.description}</p>
                <div className="flex items-center text-xs text-green-600 mt-2">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.trend} from last month
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Bookings Over Time</CardTitle>
          <CardDescription>Booking trends over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData && chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => [value, 'Bookings']}
                />
                <Line 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[350px] text-gray-500">
              No chart data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Latest 5 bookings on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          {recentBookings?.data && recentBookings.data.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Booking Date</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBookings.data.map((booking: any) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.service?.title}</TableCell>
                    <TableCell>{booking.owner?.email}</TableCell>
                    <TableCell>{new Date(booking.bookingTime).toLocaleDateString()}</TableCell>
                    <TableCell>${booking.service?.price}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center text-gray-500 py-8">No recent bookings</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
