'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  MoreVertical,
  Ticket,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Eye,
  MessageSquare,
  MessageCircle,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import {
  useAdminTickets,
  useTicketStats,
  useUpdateTicketStatus,
  useUpdateTicketPriority,
  useAddAdminNotes,
  useCreateChat,
  useSendMessage,
  TICKET_STATUS,
  TICKET_PRIORITY,
  TICKET_CATEGORY_LABELS,
  TICKET_STATUS_LABELS,
  TICKET_PRIORITY_LABELS,
  TICKET_STATUS_COLORS,
  TICKET_PRIORITY_COLORS,
  type SupportTicket,
} from '@/hooks/api';

const SupportTicketManagement = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | TICKET_STATUS>('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [newStatus, setNewStatus] = useState<TICKET_STATUS | ''>('');
  const [adminNotes, setAdminNotes] = useState('');
  const itemsPerPage = 10;

  // Build filters
  const filters = {
    page: currentPage,
    limit: itemsPerPage,
    searchTerm: searchTerm || undefined,
    status: activeTab === 'all' ? undefined : activeTab,
  };

  // Fetch tickets
  const { data, isLoading, isFetching } = useAdminTickets(filters);

  // Fetch stats
  const { data: stats, isLoading: statsLoading } = useTicketStats();

  // Mutations
  const updateStatusMutation = useUpdateTicketStatus();
  const updatePriorityMutation = useUpdateTicketPriority();
  const addNotesMutation = useAddAdminNotes();
  const createChatMutation = useCreateChat();
  const sendMessageMutation = useSendMessage();

  const tickets = data?.data || [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPage || 1;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as 'all' | TICKET_STATUS);
    setCurrentPage(1);
  };

  const handleUpdateStatus = async () => {
    if (!selectedTicket || !newStatus) return;

    try {
      await updateStatusMutation.mutateAsync({
        ticketId: selectedTicket._id,
        status: newStatus,
        adminNotes: adminNotes || undefined,
      });
      toast.success('Ticket status updated successfully');
      setShowStatusModal(false);
      setSelectedTicket(null);
      setNewStatus('');
      setAdminNotes('');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update status');
    }
  };

  const handleAddNotes = async () => {
    if (!selectedTicket || !adminNotes.trim()) return;

    try {
      await addNotesMutation.mutateAsync({
        ticketId: selectedTicket._id,
        adminNotes: adminNotes.trim(),
      });
      toast.success('Notes added successfully');
      setShowNotesModal(false);
      setSelectedTicket(null);
      setAdminNotes('');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to add notes');
    }
  };

  const handleUpdatePriority = async (ticketId: string, priority: TICKET_PRIORITY) => {
    try {
      await updatePriorityMutation.mutateAsync({ ticketId, priority });
      toast.success('Priority updated');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update priority');
    }
  };

  const openStatusModal = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setNewStatus(ticket.status);
    setAdminNotes(ticket.adminNotes || '');
    setShowStatusModal(true);
  };

  const openNotesModal = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setAdminNotes(ticket.adminNotes || '');
    setShowNotesModal(true);
  };

  const handleStartChat = async (userId: string, ticketMessage?: string, ticketNumber?: string, category?: string) => {
    try {
      const chat = await createChatMutation.mutateAsync(userId);

      // Send the ticket message as the first message if provided
      if (ticketMessage) {
        const categoryLabel = category ? TICKET_CATEGORY_LABELS[category as keyof typeof TICKET_CATEGORY_LABELS] : '';
        const formattedMessage = `📩 Support Ticket ${ticketNumber ? `#${ticketNumber}` : ''}\n${categoryLabel ? `Category: ${categoryLabel}\n` : ''}\n${ticketMessage}`;

        await sendMessageMutation.mutateAsync({
          chatId: chat._id,
          content: formattedMessage,
        });
      }

      router.push(`/admin/messages?chatId=${chat._id}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to start chat');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Stats cards configuration
  const statsConfig = [
    {
      label: 'Total Tickets',
      value: stats?.total ?? 0,
      icon: Ticket,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Open',
      value: stats?.open ?? 0,
      icon: AlertCircle,
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
    {
      label: 'In Progress',
      value: stats?.inProgress ?? 0,
      icon: Clock,
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
    },
    {
      label: 'Resolved',
      value: stats?.resolved ?? 0,
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
  ];

  // Table skeleton
  const TableSkeleton = () => (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <tr key={index} className="border-b border-gray-100">
          <td className="py-3 px-4"><Skeleton className="h-4 w-24" /></td>
          <td className="py-3 px-4"><Skeleton className="h-4 w-32" /></td>
          <td className="py-3 px-4"><Skeleton className="h-4 w-20" /></td>
          <td className="py-3 px-4"><Skeleton className="h-4 w-40" /></td>
          <td className="py-3 px-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
          <td className="py-3 px-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
          <td className="py-3 px-4"><Skeleton className="h-4 w-20" /></td>
          <td className="py-3 px-4"><Skeleton className="h-8 w-8 rounded" /></td>
        </tr>
      ))}
    </>
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center h-20">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          statsConfig.map((stat, index) => (
            <Card key={index} className="border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className={`${stat.bgColor} p-2 rounded-full w-fit mb-2`}>
                  <stat.icon className={stat.iconColor} size={24} />
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Search */}
      <div className="relative w-1/3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Search by ticket number, message..."
          value={searchTerm}
          onChange={handleSearch}
          className="pl-10 pr-4 h-11 border border-gray-300 rounded-xl focus:ring-0 focus:border-gray-400"
        />
      </div>

      {/* Table Section */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <Card>
          <CardHeader className="pb-4">
            <TabsList className="grid w-full grid-cols-5 bg-transparent p-0 h-auto">
              <TabsTrigger
                value="all"
                className="bg-transparent border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-black"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value={TICKET_STATUS.OPEN}
                className="bg-transparent border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-black"
              >
                Open
              </TabsTrigger>
              <TabsTrigger
                value={TICKET_STATUS.IN_PROGRESS}
                className="bg-transparent border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-black"
              >
                In Progress
              </TabsTrigger>
              <TabsTrigger
                value={TICKET_STATUS.RESOLVED}
                className="bg-transparent border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-black"
              >
                Resolved
              </TabsTrigger>
              <TabsTrigger
                value={TICKET_STATUS.CLOSED}
                className="bg-transparent border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-black"
              >
                Closed
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
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Ticket #</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">User</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Category</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Message</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Priority</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Created</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading || isFetching ? (
                        <TableSkeleton />
                      ) : tickets.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-gray-500">
                            No support tickets found
                          </td>
                        </tr>
                      ) : (
                        tickets.map((ticket) => (
                          <tr
                            key={ticket._id}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-3 px-4 text-gray-900 font-medium text-sm">
                              {ticket.ticketNumber}
                            </td>
                            <td className="py-3 px-4">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{ticket.user?.name}</p>
                                <p className="text-xs text-gray-500">{ticket.user?.email}</p>
                                <Badge variant="outline" className="text-xs mt-1">
                                  {ticket.userRole}
                                </Badge>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant="outline" className="text-xs">
                                {TICKET_CATEGORY_LABELS[ticket.category]}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-gray-600 text-sm max-w-xs">
                              <p className="line-clamp-2">{ticket.message}</p>
                            </td>
                            <td className="py-3 px-4">
                              <Badge className={`${TICKET_STATUS_COLORS[ticket.status]} border-0`}>
                                {TICKET_STATUS_LABELS[ticket.status]}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-auto p-0">
                                    <Badge className={`${TICKET_PRIORITY_COLORS[ticket.priority]} border-0 cursor-pointer`}>
                                      {TICKET_PRIORITY_LABELS[ticket.priority]}
                                    </Badge>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                  {Object.values(TICKET_PRIORITY).map((priority) => (
                                    <DropdownMenuItem
                                      key={priority}
                                      onClick={() => handleUpdatePriority(ticket._id, priority)}
                                      disabled={updatePriorityMutation.isPending}
                                    >
                                      <Badge className={`${TICKET_PRIORITY_COLORS[priority]} border-0 mr-2`}>
                                        {TICKET_PRIORITY_LABELS[priority]}
                                      </Badge>
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                            <td className="py-3 px-4 text-gray-600 text-sm">
                              {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                            </td>
                            <td className="py-3 px-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical size={16} />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => setSelectedTicket(ticket)}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => openStatusModal(ticket)}>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Update Status
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleStartChat(ticket.user._id, ticket.message, ticket.ticketNumber, ticket.category)}
                                    disabled={createChatMutation.isPending || sendMessageMutation.isPending}
                                  >
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Chat with User
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
              {tickets.length > 0 && (
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
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
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
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
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

      {/* View Ticket Details Modal */}
      <Dialog open={!!selectedTicket && !showStatusModal && !showNotesModal} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Ticket Details
              {selectedTicket && (
                <Badge className={TICKET_STATUS_COLORS[selectedTicket.status]}>
                  {TICKET_STATUS_LABELS[selectedTicket.status]}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Ticket Number</p>
                  <p className="font-medium">{selectedTicket.ticketNumber}</p>
                </div>
                <div>
                  <p className="text-gray-500">Category</p>
                  <p className="font-medium">{TICKET_CATEGORY_LABELS[selectedTicket.category]}</p>
                </div>
                <div>
                  <p className="text-gray-500">Priority</p>
                  <Badge className={TICKET_PRIORITY_COLORS[selectedTicket.priority]}>
                    {TICKET_PRIORITY_LABELS[selectedTicket.priority]}
                  </Badge>
                </div>
                <div>
                  <p className="text-gray-500">User</p>
                  <p className="font-medium">{selectedTicket.user?.name}</p>
                  <p className="text-xs text-gray-400">{selectedTicket.user?.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">Role</p>
                  <Badge variant="outline">{selectedTicket.userRole}</Badge>
                </div>
                <div>
                  <p className="text-gray-500">Submitted</p>
                  <p className="font-medium">{formatDate(selectedTicket.createdAt)}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-500 text-sm mb-1">Message</p>
                <div className="bg-gray-50 rounded-lg p-4 text-sm">{selectedTicket.message}</div>
              </div>

              {selectedTicket.adminNotes && (
                <div>
                  <p className="text-gray-500 text-sm mb-1">Admin Response</p>
                  <div className="bg-blue-50 rounded-lg p-4 text-sm border border-blue-100">
                    {selectedTicket.adminNotes}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={() => selectedTicket && handleStartChat(selectedTicket.user._id, selectedTicket.message, selectedTicket.ticketNumber, selectedTicket.category)}
              disabled={createChatMutation.isPending || sendMessageMutation.isPending}
              className="gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Chat with User
            </Button>
            <Button onClick={() => selectedTicket && openStatusModal(selectedTicket)}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Modal */}
      <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Ticket Status</DialogTitle>
            <DialogDescription>
              Change the status of ticket {selectedTicket?.ticketNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={newStatus} onValueChange={(value) => setNewStatus(value as TICKET_STATUS)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TICKET_STATUS).map((status) => (
                    <SelectItem key={status} value={status}>
                      {TICKET_STATUS_LABELS[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Admin Notes (Optional)</Label>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add a response or note for the user..."
                className="min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={updateStatusMutation.isPending || !newStatus}
            >
              {updateStatusMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                'Update Status'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Notes Modal */}
      <Dialog open={showNotesModal} onOpenChange={setShowNotesModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Response</DialogTitle>
            <DialogDescription>
              Add a response to ticket {selectedTicket?.ticketNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Response</Label>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Write your response to the user..."
                className="min-h-[150px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNotesModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddNotes}
              disabled={addNotesMutation.isPending || !adminNotes.trim()}
            >
              {addNotesMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                'Save Response'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupportTicketManagement;
