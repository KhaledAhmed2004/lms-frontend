'use client';

import React, { useState } from 'react';
import { Search, MoreVertical, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useUnifiedSessions,
  useSessionStats,
  SESSION_STATUS,
} from '@/hooks/api';
import type { UnifiedSession } from '@/hooks/api';

type TabFilter = 'all' | 'COMPLETED' | 'CANCELLED' | 'SCHEDULED';

const SessionManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [selectedSession, setSelectedSession] = useState<UnifiedSession | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

  // Build filters based on active tab
  const filters = {
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm || undefined,
    status: activeTab === 'all' ? undefined : activeTab,
  };

  // Fetch unified sessions (sessions + trial requests)
  const { data: sessionsData, isLoading, isFetching } = useUnifiedSessions(filters);

  // Fetch stats
  const { data: statsData } = useSessionStats();

  const sessions = sessionsData?.data || [];
  const pagination = sessionsData?.meta;
  const totalPages = pagination?.totalPage || 1;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as TabFilter);
    setCurrentPage(1);
  };

  const handleViewDetails = (session: UnifiedSession) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatScheduledTime = (startTime?: string, endTime?: string) => {
    if (!startTime) return 'Not scheduled yet';
    const start = new Date(startTime);
    const dateStr = start.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
    const startTimeStr = start.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    if (!endTime) return `${dateStr} - ${startTimeStr}`;
    const end = new Date(endTime);
    const endTimeStr = end.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${dateStr} - ${startTimeStr} - ${endTimeStr}`;
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'FREE_TRIAL':
        return 'bg-purple-100 text-purple-800';
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
      case 'REFUNDED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLessonStatusColor = (status: string) => {
    switch (status) {
      case SESSION_STATUS.COMPLETED:
        return 'bg-green-100 text-green-800';
      case SESSION_STATUS.SCHEDULED:
      case SESSION_STATUS.STARTING_SOON:
      case SESSION_STATUS.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800';
      case SESSION_STATUS.CANCELLED:
      case SESSION_STATUS.EXPIRED:
      case SESSION_STATUS.NO_SHOW:
        return 'bg-red-100 text-red-800';
      case SESSION_STATUS.AWAITING_RESPONSE:
      case SESSION_STATUS.RESCHEDULE_REQUESTED:
      case 'PENDING':
      case 'ACCEPTED':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatusLabel = (status: string) => {
    if (status === 'FREE_TRIAL') return 'Free Trial';
    return status
      .split('_')
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Stats cards data
  const stats = [
    {
      label: 'Total Sessions',
      value: statsData?.totalSessions?.toLocaleString() || '0',
      icon: <Clock className="text-blue-600" size={24} />,
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Pending Sessions',
      value: statsData?.pendingSessions?.toLocaleString() || '0',
      icon: <AlertCircle className="text-yellow-600" size={24} />,
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'Completed Sessions',
      value: statsData?.completedSessions?.toLocaleString() || '0',
      icon: <CheckCircle className="text-green-600" size={24} />,
      bgColor: 'bg-green-50',
    },
  ];

  // Skeleton rows for table loading
  const TableSkeleton = () => (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <tr key={index} className="border-b border-gray-100">
          <td className="py-3 px-4"><Skeleton className="h-4 w-28" /></td>
          <td className="py-3 px-4"><Skeleton className="h-4 w-20" /></td>
          <td className="py-3 px-4"><Skeleton className="h-4 w-20" /></td>
          <td className="py-3 px-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
          <td className="py-3 px-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
          <td className="py-3 px-4"><Skeleton className="h-8 w-8 rounded" /></td>
        </tr>
      ))}
    </>
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className={`${stat.bgColor} p-2 rounded-full w-fit mb-2`}>
                    {stat.icon}
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-1/3">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <Input
          placeholder="Search by name, subject..."
          value={searchTerm}
          onChange={handleSearch}
          className="pl-10 pr-4 h-11 border border-gray-300 rounded-xl focus:ring-0 focus:border-gray-400"
        />
      </div>

      {/* Table Section */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <Card>
          <CardHeader className="pb-4">
            <TabsList className="grid w-1/2 grid-cols-4 bg-transparent p-0 h-auto">
              <TabsTrigger
                value="all"
                className="bg-transparent border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-black"
              >
                All Session
              </TabsTrigger>
              <TabsTrigger
                value="COMPLETED"
                className="bg-transparent border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-black"
              >
                Completed
              </TabsTrigger>
              <TabsTrigger
                value="CANCELLED"
                className="bg-transparent border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-black"
              >
                Cancelled
              </TabsTrigger>
              <TabsTrigger
                value="SCHEDULED"
                className="bg-transparent border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-black"
              >
                Scheduled
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent>
            <TabsContent value={activeTab} className="space-y-4 mt-0">
              {/* Table */}
              <div className="overflow-x-auto">
                <div className="border border-gray-200 rounded-lg">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          Student Name
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          Subject
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          Booking Date
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          Payment Status
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          Lesson Status
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading || isFetching ? (
                        <TableSkeleton />
                      ) : sessions.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-gray-500">
                            No sessions found
                          </td>
                        </tr>
                      ) : (
                        sessions.map((session) => (
                          <tr
                            key={session._id}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-3 px-4 text-gray-900 font-medium text-sm">
                              <div className="flex items-center gap-2">
                                {session.studentName || 'N/A'}
                                {session.type === 'TRIAL_REQUEST' && (
                                  <Badge className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                                    Trial Request
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-600 text-sm">
                              {session.subject}
                            </td>
                            <td className="py-3 px-4 text-gray-600 text-sm">
                              {formatDate(session.createdAt)}
                            </td>
                            <td className="py-3 px-4">
                              <Badge className={`${getPaymentStatusColor(session.paymentStatus)} border-0`}>
                                {formatStatusLabel(session.paymentStatus)}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Badge className={`${getLessonStatusColor(session.status)} border-0`}>
                                {formatStatusLabel(session.status)}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreVertical size={16} />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleViewDetails(session)}>
                                    View Details
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {sessions.length > 0 && (
                <div className="flex items-center justify-between pt-6">
                  <p className="text-sm text-gray-500 whitespace-nowrap">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                    {Math.min(currentPage * itemsPerPage, pagination?.total || 0)} of{' '}
                    {pagination?.total || 0} results
                  </p>
                  <Pagination className="justify-end mx-0">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                          className={
                            currentPage === 1
                              ? 'pointer-events-none opacity-50'
                              : 'cursor-pointer'
                          }
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => setCurrentPage(page)}
                                isActive={page === currentPage}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        } else if (
                          (page === 2 && currentPage > 3) ||
                          (page === totalPages - 1 && currentPage < totalPages - 2)
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        return null;
                      })}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                          className={
                            currentPage === totalPages
                              ? 'pointer-events-none opacity-50'
                              : 'cursor-pointer'
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>

      {/* Session Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedSession?.type === 'TRIAL_REQUEST' ? 'Trial Request Details' : 'Session Details'}
              {selectedSession?.isTrial && (
                <Badge className="bg-purple-100 text-purple-800 border-0">
                  Free Trial
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedSession ? (
            <div className="space-y-6">
              {/* Booking Date & Time */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">
                    Booking Date & Time of Request
                  </p>
                  <p className="text-sm text-gray-900 font-medium">
                    {formatDateTime(selectedSession.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">
                    Scheduled Lesson Date & Time
                  </p>
                  <p className="text-sm text-gray-900 font-medium">
                    {formatScheduledTime(selectedSession.startTime, selectedSession.endTime)}
                  </p>
                </div>
              </div>

              {/* Student Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Student Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Student Name</p>
                    <p className="text-sm text-gray-900">
                      {selectedSession.studentName || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Student Email</p>
                    <p className="text-sm text-gray-900">
                      {selectedSession.studentEmail || 'N/A'}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-600 mb-1">Student Phone</p>
                    <p className="text-sm text-gray-900">
                      {selectedSession.studentPhone || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tutor Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Tutor Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Tutor Name</p>
                    <p className="text-sm text-gray-900">
                      {selectedSession.tutorName || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Tutor Email</p>
                    <p className="text-sm text-gray-900">
                      {selectedSession.tutorEmail || 'N/A'}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-600 mb-1">Tutor Phone</p>
                    <p className="text-sm text-gray-900">
                      {selectedSession.tutorPhone || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Session Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Session Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Subject</p>
                    <p className="text-sm text-gray-900">{selectedSession.subject}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Type</p>
                    <Badge className={selectedSession.isTrial ? 'bg-purple-100 text-purple-800 border-0' : 'bg-blue-100 text-blue-800 border-0'}>
                      {selectedSession.isTrial ? 'Trial Session' : 'Paid Session'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Payment Status</p>
                    <Badge
                      className={`${getPaymentStatusColor(selectedSession.paymentStatus)} border-0 w-fit`}
                    >
                      {formatStatusLabel(selectedSession.paymentStatus)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Lesson Status</p>
                    <Badge
                      className={`${getLessonStatusColor(selectedSession.status)} border-0 w-fit`}
                    >
                      {formatStatusLabel(selectedSession.status)}
                    </Badge>
                  </div>
                  {selectedSession.totalPrice !== undefined && selectedSession.totalPrice > 0 && (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-600 mb-1">Total Price</p>
                      <p className="text-sm text-gray-900 font-medium">
                        €{selectedSession.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  )}
                  {selectedSession.description && (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-600 mb-1">Description</p>
                      <p className="text-sm text-gray-900">{selectedSession.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SessionManagement;