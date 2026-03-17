"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  useForfeitedFeedbacksList,
  useForfeitedPaymentsSummary,
} from "@/hooks/api/use-admin-forfeits";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import ForfeitHeader from "./ForfeitHeader";
import ForfeitMonthlyBreakdown from "./ForfeitMonthlyBreakdown";
import ForfeitStatsCards from "./ForfeitStatsCards";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const ForfeitDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: summary, isLoading: summaryLoading } =
    useForfeitedPaymentsSummary();
  const { data: forfeitedList, isLoading: listLoading } =
    useForfeitedFeedbacksList(currentPage, itemsPerPage);

  const forfeits = forfeitedList?.data || [];
  const meta = forfeitedList?.meta;
  const totalPages = meta?.totalPages || 1;

  const grandTotal = summary?.grandTotal || { total: 0, count: 0 };
  const monthlyData = summary?.monthly || [];

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("de-DE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const formatCurrency = (amount: number) => `€${amount.toFixed(2)}`;

  return (
    <div className="space-y-6">
      <ForfeitHeader />

      <ForfeitStatsCards
        summaryLoading={summaryLoading}
        grandTotalAmount={grandTotal.total}
        grandTotalCount={grandTotal.count}
        monthlyData={monthlyData}
        monthNames={MONTH_NAMES}
        formatCurrency={formatCurrency}
      />

      <ForfeitMonthlyBreakdown
        monthlyData={monthlyData}
        monthNames={MONTH_NAMES}
        formatCurrency={formatCurrency}
      />

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
                      <th className="text-left py-3 px-4 font-medium text-gray-500">
                        Tutor
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">
                        Student
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">
                        Subject
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">
                        Deadline
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">
                        Forfeited On
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500">
                        Amount
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {forfeits.map((forfeit) => (
                      <tr
                        key={forfeit._id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {forfeit.tutorId?.name || "N/A"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {forfeit.tutorId?.email || ""}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-gray-900">
                            {forfeit.studentId?.name || "N/A"}
                          </p>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {forfeit.sessionId?.subject || "N/A"}
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
                          onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                          }
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(
                          (p) =>
                            p === 1 ||
                            p === totalPages ||
                            Math.abs(p - currentPage) <= 1,
                        )
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
                          onClick={() =>
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                          }
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
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
