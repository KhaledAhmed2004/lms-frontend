"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useEarningsHistory,
  fetchEarningsDetail,
  PAYOUT_STATUS_COLORS,
  PAYOUT_STATUS_LABELS,
} from "@/hooks/api";
import { toast } from "sonner";
import { generateEarningsReceipt } from "@/lib/generate-earnings-receipt";
import { formatNumber } from "./utils";

import { useTranslations } from "next-intl";

const ITEMS_PER_PAGE = 5;

export default function EarningsHistory() {
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const t = useTranslations("earnings");

  const { data: earningsData, isLoading } = useEarningsHistory(
    currentPage,
    ITEMS_PER_PAGE,
  );

  const totalPages = earningsData?.pagination?.totalPages || 1;

  const handleDownloadReceipt = async (id: string) => {
    setDownloadingId(id);
    try {
      const detail = await fetchEarningsDetail(id);
      generateEarningsReceipt(detail);
    } catch {
      toast.error(t("errorLoadDetails"));
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <div className="flex items-center justify-between p-4 sm:p-5 lg:p-6 pb-0">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          {t("earningsHistory")}
        </h2>
      </div>

      <div className="overflow-x-auto p-4 sm:p-5 lg:p-6 pt-4">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-sm font-semibold text-gray-700 pb-3 px-3">
                {t("colPeriod")}
              </th>
              <th className="text-left text-sm font-semibold text-gray-700 pb-3 px-3">
                {t("colSessions")}
              </th>
              <th className="text-left text-sm font-semibold text-gray-700 pb-3 px-3">
                {t("colEarnings")}
              </th>
              <th className="text-left text-sm font-semibold text-gray-700 pb-3 px-3">
                {t("colStatus")}
              </th>
              <th className="text-right text-sm font-semibold text-gray-700 pb-3 px-3">
                {t("colAction")}
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-3">
                    <Skeleton className="h-5 w-16" />
                  </td>
                  <td className="py-3 px-3">
                    <Skeleton className="h-5 w-10" />
                  </td>
                  <td className="py-3 px-3">
                    <Skeleton className="h-5 w-20" />
                  </td>
                  <td className="py-3 px-3">
                    <Skeleton className="h-5 w-16" />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Skeleton className="h-8 w-20 ml-auto" />
                  </td>
                </tr>
              ))
            ) : earningsData?.data && earningsData.data.length > 0 ? (
              earningsData.data.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="text-sm text-gray-900 py-3 px-3 font-medium">
                    {item.period}
                  </td>
                  <td className="text-sm text-gray-700 py-3 px-3">
                    {item.sessions}
                  </td>
                  <td className="text-sm text-gray-700 py-3 px-3 font-medium">
                    {formatNumber(item.netEarnings)} €
                  </td>
                  <td className="text-sm py-3 px-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${PAYOUT_STATUS_COLORS[item.status]}`}
                    >
                      {PAYOUT_STATUS_LABELS[item.status]}
                    </span>
                  </td>
                  <td className="text-right py-3 px-3">
                    <Button
                      onClick={() => handleDownloadReceipt(item.id)}
                      disabled={downloadingId === item.id}
                      className="bg-[#002AC8] hover:bg-[#001F9C] text-white px-4 py-1 h-8 text-sm font-medium rounded-md"
                    >
                      {downloadingId === item.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5 mr-1.5" />
                          {t("download")}
                        </>
                      )}
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  {t("noHistory")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end gap-2 px-4 sm:px-5 lg:px-6 pb-4">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <span className="text-sm text-gray-600 min-w-12 text-center">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage(Math.min(totalPages, currentPage + 1))
          }
          disabled={currentPage === totalPages}
          className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
