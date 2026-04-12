'use client';

import React, { useState } from 'react';
import { Search, Eye, DollarSign, ArrowUpRight, ArrowDownLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTransactions, useTransactionStats, Transaction } from '@/hooks/api/use-admin-stats';
import { useTranslations } from 'next-intl';

const TransactionManagement = () => {
  const t = useTranslations('transactions');
  const ts = useTranslations('status');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'PAID' | 'PENDING'>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

  // Fetch transactions from API
  const { data: transactionsData, isLoading: isLoadingTransactions } = useTransactions({
    page: currentPage,
    limit: itemsPerPage,
    status: activeTab === 'all' ? undefined : activeTab,
    search: searchQuery || undefined,
    sortBy: 'date',
    sortOrder: 'desc',
  });

  // Fetch transaction stats
  const { data: stats, isLoading: isLoadingStats } = useTransactionStats();

  const transactions = transactionsData?.data || [];
  const meta = transactionsData?.meta;
  const totalPages = meta?.totalPage || 1;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as 'all' | 'PAID' | 'PENDING');
    setCurrentPage(1);
  };

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'REFUNDED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: Transaction['type']) => {
    if (type === 'STUDENT_PAYMENT') {
      return <ArrowDownLeft className="text-green-600" size={16} />;
    }
    return <ArrowUpRight className="text-blue-600" size={16} />;
  };

  const getTypeLabel = (type: Transaction['type']) => {
    return type === 'STUDENT_PAYMENT' ? t('typeStudentPayment') : t('typeTutorPayout');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  };

  const formatCurrency = (amount: number, showFreeLabel = false) => {
    if (showFreeLabel && amount === 0) {
      return ts('free');
    }
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Earnings */}
        <Card className="border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="bg-green-50 p-2 rounded-full w-fit mb-2">
                  <DollarSign className="text-green-600" size={24} />
                </div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  {t('totalAmount')}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {isLoadingStats ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    formatCurrency(stats?.totalAmount || 0)
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student Payments */}
        <Card className="border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="bg-blue-50 p-2 rounded-full w-fit mb-2">
                  <ArrowDownLeft className="text-blue-600" size={24} />
                </div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  {t('studentPayments')}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {isLoadingStats ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    formatCurrency(stats?.studentPayments?.total || 0)
                  )}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {stats?.studentPayments?.count || 0} {t('transactions')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tutor Payouts */}
        <Card className="border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="bg-purple-50 p-2 rounded-full w-fit mb-2">
                  <ArrowUpRight className="text-purple-600" size={24} />
                </div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  {t('tutorPayouts')}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {isLoadingStats ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    formatCurrency(stats?.tutorPayouts?.total || 0)
                  )}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {stats?.tutorPayouts?.count || 0} {t('transactions')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative w-1/3">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <Input
          placeholder={t('searchPlaceholder')}
          value={searchQuery}
          onChange={handleSearch}
          className="pl-10 pr-4 h-11 border border-gray-300 rounded-xl focus:ring-0 focus:border-gray-400"
        />
      </div>

      {/* Table Section */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <Card>
          <CardHeader className="pb-4">
            <TabsList className="grid w-1/3 grid-cols-3 bg-transparent p-0 h-auto">
              <TabsTrigger
                value="all"
                className="bg-transparent border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-black"
              >
                {t('tabAll')}
              </TabsTrigger>
              <TabsTrigger
                value="PAID"
                className="bg-transparent border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-black"
              >
                {t('tabPaid')}
              </TabsTrigger>
              <TabsTrigger
                value="PENDING"
                className="bg-transparent border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-black"
              >
                {t('tabPending')}
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
                          {t('colTransactionId')}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          {t('colType')}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          {t('colUser')}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          {t('colDescription')}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          {t('colAmount')}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          {t('colDate')}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          {t('colStatus')}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          {t('colAction')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoadingTransactions ? (
                        <tr>
                          <td colSpan={8} className="py-8 text-center">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                            <p className="text-gray-500 mt-2">{t('loadingTransactions')}</p>
                          </td>
                        </tr>
                      ) : transactions.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-gray-500">
                            {t('noTransactions')}
                          </td>
                        </tr>
                      ) : (
                        transactions.map((transaction) => (
                          <tr
                            key={transaction._id}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-3 px-4 text-gray-900 font-medium text-sm">
                              {transaction.transactionId}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                {getTypeIcon(transaction.type)}
                                <span className="text-sm text-gray-600">
                                  {getTypeLabel(transaction.type)}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {transaction.userName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {transaction.userEmail}
                                </p>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-600 text-sm max-w-[200px] truncate" title={transaction.description}>
                              {transaction.description}
                            </td>
                            <td className="py-3 px-4 text-gray-900 font-medium text-sm">
                              {formatCurrency(transaction.amount, true)}
                            </td>
                            <td className="py-3 px-4 text-gray-600 text-sm">
                              {formatDate(transaction.date)}
                            </td>
                            <td className="py-3 px-4">
                              <Badge className={`${getStatusColor(transaction.status)} border-0`}>
                                {ts(transaction.status.toLowerCase().replace(/_/g, ''))}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                onClick={() => handleViewDetails(transaction)}
                                title="View Details"
                              >
                                <Eye size={18} />
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-6">
                  <p className="text-sm text-gray-500">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, meta?.total || 0)} of {meta?.total || 0} {t('transactions')}
                  </p>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(1, prev - 1))
                          }
                          className={
                            currentPage === 1
                              ? 'pointer-events-none opacity-50'
                              : 'cursor-pointer'
                          }
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => {
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
                            (page === totalPages - 1 &&
                              currentPage < totalPages - 2)
                          ) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }
                          return null;
                        }
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(totalPages, prev + 1)
                            )
                          }
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
      {/* Transaction Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Transaction Details
            </DialogTitle>
          </DialogHeader>

          {selectedTransaction ? (
            <div className="space-y-6">
              {/* ID & Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    {t('colTransactionId')}
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {selectedTransaction.transactionId}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    {t('colDate')}
                  </p>
                  <p className="text-sm text-gray-900">
                    {formatDate(selectedTransaction.date)}
                  </p>
                </div>
              </div>

              {/* User Info */}
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">
                  User Information
                </p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedTransaction.userName}
                  </p>
                  <p className="text-xs text-gray-600">
                    {selectedTransaction.userEmail}
                  </p>
                  <Badge className="mt-2 bg-blue-50 text-blue-700 hover:bg-blue-50 border-0 uppercase text-[10px]">
                    {selectedTransaction.userType}
                  </Badge>
                </div>
              </div>

              {/* Transaction Info */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      {t('colType')}
                    </p>
                    <div className="flex items-center gap-1.5">
                      {getTypeIcon(selectedTransaction.type)}
                      <span className="text-sm text-gray-900">
                        {getTypeLabel(selectedTransaction.type)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      {t('colStatus')}
                    </p>
                    <Badge className={`${getStatusColor(selectedTransaction.status)} border-0 text-[10px]`}>
                      {ts(selectedTransaction.status.toLowerCase().replace(/_/g, ''))}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    {t('colAmount')}
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(selectedTransaction.amount)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    {t('colDescription')}
                  </p>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg min-h-[60px]">
                    {selectedTransaction.description || 'No description provided'}
                  </p>
                </div>

                {selectedTransaction.sessions !== undefined && (
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Sessions
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedTransaction.sessions}
                      </p>
                    </div>
                    {selectedTransaction.hours && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          Total Hours
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {selectedTransaction.hours}h
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionManagement;
