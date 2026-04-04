'use client';

import React, { useState } from 'react';
import { AlertTriangle, DollarSign, Users, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import {
  useForfeitedPaymentsSummary,
  useForfeitedFeedbacksList,
} from '@/hooks/api/use-admin-forfeits';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const ForfeitDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: summary, isLoading: summaryLoading } = useForfeitedPaymentsSummary();
  const { data: forfeitedList, isLoading: listLoading } = useForfeitedFeedbacksList(currentPage, itemsPerPage);

  const forfeits = forfeitedList?.data || [];
  const meta = forfeitedList?.meta;
  const totalPages = meta?.totalPages || 1;

  const grandTotal = summary?.grandTotal || { total: 0, count: 0 };
  const monthlyData = summary?.monthly || [];

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('de-DE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const formatCurrency = (amount: number) => `€${amount.toFixed(2)}`;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Forfeited Payments</h1>
        <p className="text-sm text-gray-500 mt-1">
          Payments forfeited by tutors who missed their feedback deadline
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <p className="text-sm font-medium text-gray-500">Total Forfeited</p>
            <DollarSign className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            ) : (
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(grandTotal.total)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <p className="text-sm font-medium text-gray-500">Total Forfeits</p>
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            ) : (
              <p className="text-2xl font-bold text-gray-900">{grandTotal.count}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <p className="text-sm font-medium text-gray-500">Recent Month</p>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            ) : monthlyData.length > 0 ? (
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(monthlyData[0].totalAmount)}
                </p>
                <p className="text-xs text-gray-500">
                  {MONTH_NAMES[monthlyData[0]._id.month - 1]} {monthlyData[0]._id.year} ({monthlyData[0].count} forfeits)
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">No data</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Breakdown */}
      {monthlyData.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Monthly Breakdown</h3>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Period</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Forfeits</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((item) => (
                    <tr key={`${item._id.year}-${item._id.month}`} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {MONTH_NAMES[item._id.month - 1]} {item._id.year}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600">{item.count}</td>
                      <td className="py-3 px-4 text-right font-semibold text-red-600">
                        {formatCurrency(item.totalAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Forfeited List */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Forfeited Feedbacks</h3>
        </CardHeader>
        <CardContent>
          {listLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : forfeits.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No forfeited payments found
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Tutor</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Student</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Subject</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Deadline</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Forfeited On</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500">Amount</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {forfeits.map((forfeit) => (
                      <tr key={forfeit._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{forfeit.tutorId?.name || 'N/A'}</p>
                            <p className="text-xs text-gray-500">{forfeit.tutorId?.email || ''}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-gray-900">{forfeit.studentId?.name || 'N/A'}</p>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {forfeit.sessionId?.subject || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {formatDate(forfeit.dueDate)}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {formatDate(forfeit.forfeitedAt)}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-red-600">
                          {formatCurrency(forfeit.forfeitedAmount)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="destructive" className="text-xs">
                            Forfeited
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                        .map((page, idx, arr) => (
                          <React.Fragment key={page}>
                            {idx > 0 && arr[idx - 1] !== page - 1 && (
                              <PaginationItem>
                                <span className="px-2 text-gray-400">...</span>
                              </PaginationItem>
                            )}
                            <PaginationItem>
                              <PaginationLink
                                onClick={() => setCurrentPage(page)}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          </React.Fragment>
                        ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForfeitDashboard;
