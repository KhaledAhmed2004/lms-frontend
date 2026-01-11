"use client";

import { useState } from "react";
import { CreditCard, Download, Plus, Trash2, Loader2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Image from "next/image";
import {
  usePlanUsage,
  usePaymentHistory,
  usePaymentMethods,
  useDeletePaymentMethod,
  useSetDefaultPaymentMethod,
  PLAN_DISPLAY_NAMES,
  PLAN_DETAILS,
} from "@/hooks/api/use-subscription";
import { Skeleton } from "@/components/ui/skeleton";
import { AddPaymentMethodModal } from "./components/AddPaymentMethodModal";
import { ChangePlanModal } from "./components/ChangePlanModal";

export default function StudentSubscriptionPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [isChangePlanModalOpen, setIsChangePlanModalOpen] = useState(false);
  const itemsPerPage = 5;

  // Fetch data
  const { data: planUsage, isLoading: isLoadingPlanUsage } = usePlanUsage();
  const { data: paymentHistoryData, isLoading: isLoadingPaymentHistory } = usePaymentHistory(currentPage, itemsPerPage);
  const { data: paymentMethods, isLoading: isLoadingPaymentMethods } = usePaymentMethods();

  // Mutations
  const deletePaymentMethod = useDeletePaymentMethod();
  const setDefaultPaymentMethod = useSetDefaultPaymentMethod();

  // Calculate usage percentage
  const usagePercentage = planUsage?.usage.hoursRemaining !== null && planUsage?.plan.minimumHours
    ? Math.min(100, Math.round(((planUsage.plan.minimumHours - (planUsage.usage.hoursRemaining || 0)) / planUsage.plan.minimumHours) * 100))
    : 0;

  // Get plan display name
  const planName = planUsage?.plan.name ? PLAN_DISPLAY_NAMES[planUsage.plan.name] : "No Plan";
  const planDetails = planUsage?.plan.name ? PLAN_DETAILS[planUsage.plan.name] : null;

  // Pagination
  const totalPages = paymentHistoryData?.pagination.totalPages || 1;

  const handleDeletePaymentMethod = async (paymentMethodId: string) => {
    if (confirm("Are you sure you want to delete this payment method?")) {
      deletePaymentMethod.mutate(paymentMethodId);
    }
  };

  const handleSetDefaultPaymentMethod = async (paymentMethodId: string) => {
    setDefaultPaymentMethod.mutate(paymentMethodId);
  };

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      {/* Subscription Usage Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-5 lg:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-5 lg:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Subscription Usage
          </h2>
          {isLoadingPlanUsage ? (
            <Skeleton className="h-10 w-32" />
          ) : planUsage?.plan.status === "ACTIVE" ? (
            <div className="flex items-center gap-1.5 sm:gap-2 bg-[#002AC8] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg w-fit">
              <Image width={20} height={20} src="/badge-wt.svg" alt="Badge" className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="font-semibold text-sm sm:text-base">{planName} Plan</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg w-fit">
              <span className="font-semibold text-sm sm:text-base">No Active Plan</span>
            </div>
          )}
        </div>

        {isLoadingPlanUsage ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : planUsage?.plan.status === "ACTIVE" ? (
          <div className="space-y-2 sm:space-y-3">
            {/* Show usage progress bar only for plans with hour limits (REGULAR, LONG_TERM) */}
            {planUsage?.usage.hoursRemaining !== null ? (
              <>
                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600">
                  <span>Usage {usagePercentage}%</span>
                  <span className="text-[#3052D2]">
                    {planUsage.usage.hoursRemaining} {planUsage.usage.hoursRemaining === 1 ? "Lesson" : "Lessons"} Left
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 sm:h-3">
                  <div
                    className="bg-[#002AC8] h-full rounded-full transition-all"
                    style={{ width: `${usagePercentage}%` }}
                  />
                </div>
              </>
            ) : (
              /* FLEXIBLE plan - no usage limits */
              <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600">
                <span>Sessions completed: {planUsage.usage.sessionsCompleted}</span>
                <span className="text-[#3052D2]">No minimum commitment</span>
              </div>
            )}
            <div className="bg-[#FFF4E6] border border-[#FFB256] rounded-lg p-2.5 sm:p-3 flex items-start gap-2 mt-3 sm:mt-5">
              <Image width={20} height={20} src="/badge-yl.svg" alt="Badge" className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              <p className="text-xs sm:text-sm text-amber-800">
                Your current usage amounts to{" "}
                <span className="font-semibold">{planUsage.spending.currentMonthSpending.toFixed(2)}€</span> this month
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No active subscription. Subscribe to a plan to start tracking your usage.</p>
          </div>
        )}
      </div>

      {/* Current Plan Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 lg:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-5 lg:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Current Plan</h2>
          <button
            onClick={() => setIsChangePlanModalOpen(true)}
            className="px-4 sm:px-6 py-2 sm:py-2.5 bg-[#FF8A00] hover:bg-[#ee8607] text-white font-semibold rounded-lg transition-colors text-sm sm:text-base"
          >
            Change Plan
          </button>
        </div>

        {isLoadingPlanUsage ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Plan Card */}
            <div className="bg-[#002AC8] text-white rounded-xl p-6">
              <p className="text-sm font-medium mb-2 opacity-90">Plan</p>
              <p className="text-xl font-bold">{planName}</p>
            </div>

            {/* Monthly Session Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <p className="text-sm font-medium text-gray-600 mb-2">Monthly Session</p>
              <p className="text-xl font-bold text-gray-900">
                {planDetails ? `At least ${planDetails.minimumHours}` : "-"}
              </p>
            </div>

            {/* Price/Session Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <p className="text-sm font-medium text-gray-600 mb-2">Price/Session</p>
              <p className="text-xl font-bold text-gray-900">
                {planUsage?.plan.pricePerHour ? `${planUsage.plan.pricePerHour}€` : "-"}
              </p>
            </div>

            {/* Period Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <p className="text-sm font-medium text-gray-600 mb-2">Period</p>
              <p className="text-xl font-bold text-gray-900">
                {planDetails?.commitment || "-"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Payment Method Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Payment Method</h2>
          <button
            onClick={() => setIsAddPaymentModalOpen(true)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New
          </button>
        </div>

        {isLoadingPaymentMethods ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
          </div>
        ) : paymentMethods && paymentMethods.length > 0 ? (
          <div className="space-y-4">
            {paymentMethods.map((pm) => (
              <div
                key={pm.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${pm.isDefault ? 'border-[#002AC8] bg-blue-50' : 'border-gray-200'}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 capitalize">
                      {pm.brand} ending in {pm.last4}
                      {pm.isDefault && <span className="ml-2 text-xs text-[#002AC8]">(Default)</span>}
                    </p>
                    <p className="text-sm text-gray-500">Expires {pm.expMonth}/{pm.expYear}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!pm.isDefault && (
                    <button
                      onClick={() => handleSetDefaultPaymentMethod(pm.id)}
                      disabled={setDefaultPaymentMethod.isPending}
                      className="px-3 py-1.5 text-xs font-medium text-[#002AC8] hover:bg-blue-50 rounded transition-colors disabled:opacity-50"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => handleDeletePaymentMethod(pm.id)}
                    disabled={deletePaymentMethod.isPending}
                    className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                  >
                    {deletePaymentMethod.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No payment methods saved yet.</p>
            <button
              onClick={() => setIsAddPaymentModalOpen(true)}
              className="mt-3 text-[#002AC8] font-medium hover:underline"
            >
              Add your first payment method
            </button>
          </div>
        )}
      </div>

      {/* Payment Overview Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 lg:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-5 lg:mb-6">Payment Overview</h2>

        {isLoadingPaymentHistory ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : paymentHistoryData && paymentHistoryData.data.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                      Period
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                      Sessions
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistoryData.data.map((record, index) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center border-gray-200 ${index !== paymentHistoryData.data.length - 1 ? 'border-b' : ''}`}>
                        {record.period}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center border-gray-200 ${index !== paymentHistoryData.data.length - 1 ? 'border-b' : ''}`}>
                        {record.sessions}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium text-center border-gray-200 ${index !== paymentHistoryData.data.length - 1 ? 'border-b' : ''}`}>
                        {record.amount.toFixed(2)} {record.currency}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${index !== paymentHistoryData.data.length - 1 ? 'border-b border-gray-200' : ''}`}>
                        <button className="bg-[#002AC8] text-white px-6 py-2 rounded-lg hover:bg-[#0024a8] transition-colors font-medium inline-flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {paymentHistoryData.data.map((record) => (
                <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Period</p>
                      <p className="text-sm font-semibold text-gray-900">{record.period}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Sessions</p>
                      <p className="text-sm font-semibold text-gray-900">{record.sessions}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500 font-medium">Amount</p>
                      <p className="text-base font-bold text-gray-900">{record.amount.toFixed(2)} {record.currency}</p>
                    </div>
                  </div>
                  <button className="w-full bg-[#002AC8] text-white px-4 py-2 rounded-lg hover:bg-[#0024a8] transition-colors font-medium inline-flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>

                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              onClick={() => setCurrentPage(pageNum)}
                              isActive={currentPage === pageNum}
                              className="cursor-pointer"
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No payment history yet.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddPaymentMethodModal
        isOpen={isAddPaymentModalOpen}
        onClose={() => setIsAddPaymentModalOpen(false)}
      />
      <ChangePlanModal
        isOpen={isChangePlanModalOpen}
        onClose={() => setIsChangePlanModalOpen(false)}
        currentPlan={planUsage?.plan.name || null}
      />
    </div>
  );
}