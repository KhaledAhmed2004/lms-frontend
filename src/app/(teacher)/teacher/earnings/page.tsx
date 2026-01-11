"use client";
import { useState, useEffect } from "react";
import { Edit, ChevronLeft, ChevronRight, BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import {
  useTutorStats,
  usePayoutSettings,
  useUpdatePayoutSettings,
  useEarningsHistory,
} from "@/hooks/api";
import { toast } from "sonner";

export default function EarningsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    recipient: "",
    iban: "",
  });

  const itemsPerPage = 5;

  // API Hooks
  const { data: stats, isLoading: statsLoading } = useTutorStats();
  const { data: payoutSettings, isLoading: payoutLoading } = usePayoutSettings();
  const { data: earningsData, isLoading: earningsLoading } = useEarningsHistory(currentPage, itemsPerPage);
  const updatePayoutMutation = useUpdatePayoutSettings();

  // Update edit form when payout settings load
  useEffect(() => {
    if (payoutSettings) {
      setEditFormData({
        recipient: payoutSettings.recipient || "",
        iban: payoutSettings.iban || "",
      });
    }
  }, [payoutSettings]);

  const handleEditClick = () => {
    setEditFormData({
      recipient: payoutSettings?.recipient || "",
      iban: payoutSettings?.iban || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveChanges = async () => {
    try {
      await updatePayoutMutation.mutateAsync(editFormData);
      toast.success("Payout settings updated successfully");
      setIsEditDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.message || "Failed to update payout settings");
    }
  };

  const handleCancel = () => {
    setIsEditDialogOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditFormData({ ...editFormData, [field]: value });
  };

  const totalPages = earningsData?.pagination?.totalPages || 1;

  // Format number with locale
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">

      {/* Level Progress */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Level Progress</h2>
          {statsLoading ? (
            <Skeleton className="h-10 w-24" />
          ) : (
            <div className="flex items-center gap-2 bg-[#002AC8] text-white px-4 py-2 rounded-lg">
              <Image width={24} height={24} src="/badge-wt.svg" alt="Badge" />
              <span className="font-semibold">Level {stats?.level?.current || 1}</span>
            </div>
          )}
        </div>
        <div className="space-y-3">
          {statsLoading ? (
            <>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-full" />
            </>
          ) : stats?.nextLevel ? (
            <>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Progress to Level {stats.nextLevel.level}</span>
                <span className="text-[#3052D2]">
                  {stats.nextLevel.sessionsNeeded} Lesson{stats.nextLevel.sessionsNeeded !== 1 ? 's' : ''} Left
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-[#002AC8] h-full rounded-full transition-all"
                  style={{ width: `${stats.nextLevel.progressPercent}%` }}
                />
              </div>
              <div className="bg-[#FFF4E6] border border-[#FFB256] rounded-lg p-3 flex items-start gap-2 mt-5">
                <Image width={24} height={24} src="/badge-yl.svg" alt="Badge" />
                <p className="text-sm text-amber-800">
                  Hourly earnings will grow to <span className="font-semibold">{stats.nextLevel.hourlyRate}€</span> on level {stats.nextLevel.level}.
                </p>
              </div>
            </>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
              <Image width={24} height={24} src="/badge-wt.svg" alt="Badge" />
              <p className="text-sm text-green-800">
                Congratulations! You have reached the maximum level.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {/* Sessions */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="mb-4 bg-blue-50 p-3 rounded-full w-fit">
            <Image src="/cap.svg" alt="" width={24} height={24} />
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Sessions</h3>
          {statsLoading ? (
            <Skeleton className="h-9 w-20" />
          ) : (
            <>
              <div className="text-3xl font-bold text-gray-900">
                {formatNumber(stats?.stats?.totalHours || 0)} <span className="text-lg text-gray-500">h</span>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                Total: {stats?.stats?.completedSessions || 0} sessions
              </p>
            </>
          )}
        </div>

        {/* Earnings */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="mb-4 bg-green-50 p-3 rounded-full w-fit">
            <Image src="/dollar.svg" alt="" width={24} height={24} />
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Earnings</h3>
          {statsLoading ? (
            <Skeleton className="h-9 w-24" />
          ) : (
            <>
              <div className="text-3xl font-bold text-gray-900">
                {formatNumber(stats?.earnings?.currentMonth || 0)} <span className="text-lg text-gray-500">€</span>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                Total: {formatNumber(stats?.earnings?.totalEarnings || 0)} €
              </p>
            </>
          )}
        </div>

        {/* Trial Sessions */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="mb-4 bg-orange-50 p-3 rounded-full w-fit">
            <BookOpen className="text-[#FF8A00]" size={24} />
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Trial Sessions</h3>
          {statsLoading ? (
            <Skeleton className="h-9 w-16" />
          ) : (
            <>
              <div className="text-3xl font-bold text-gray-900">
                {stats?.trialStats?.conversionRate || 0} <span className="text-lg text-gray-500">%</span>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                {stats?.trialStats?.convertedTrials || 0} / {stats?.trialStats?.totalTrials || 0} converted
              </p>
            </>
          )}
        </div>

        {/* Students */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="mb-4 bg-[#F3F3F3] p-3 rounded-full w-fit">
            <Image src="/users.svg" alt="" width={24} height={24} />
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">The Number of Students</h3>
          {statsLoading ? (
            <Skeleton className="h-9 w-16" />
          ) : (
            <>
              <div className="text-3xl font-bold text-gray-900">
                {stats?.stats?.totalStudents || 0}
              </div>
              <p className="text-sm text-gray-500 mt-3">
                Active students
              </p>
            </>
          )}
        </div>
      </div>

      {/* Payout Settings Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 lg:p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Payout Settings
          </h2>
          <Button
            onClick={handleEditClick}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 h-10 rounded-lg font-medium"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
        <hr className="my-6" />

        <div className="flex flex-col md:flex-row gap-8">
          {/* Recipient */}
          <div className="flex-1">
            <label className="text-xs font-medium text-gray-600 block mb-2">
              Recipient
            </label>
            {payoutLoading ? (
              <Skeleton className="h-6 w-32" />
            ) : (
              <p className="text-gray-900 font-medium">
                {payoutSettings?.recipient || "Not set"}
              </p>
            )}
          </div>
          {/* IBAN */}
          <div className="flex-1">
            <label className="text-xs font-medium text-gray-600 block mb-2">
              IBAN
            </label>
            {payoutLoading ? (
              <Skeleton className="h-6 w-40" />
            ) : (
              <p className="text-gray-900 font-medium">
                {payoutSettings?.iban || "Not set"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end gap-2">
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
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Earnings History Card */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="flex items-center justify-end mb-6"></div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-sm font-semibold text-gray-700 pb-3 px-3">
                  Period
                </th>
                <th className="text-left text-sm font-semibold text-gray-700 pb-3 px-3">
                  Sessions
                </th>
                <th className="text-left text-sm font-semibold text-gray-700 pb-3 px-3">
                  Earnings
                </th>
                <th className="text-left text-sm font-semibold text-gray-700 pb-3 px-3">
                  Status
                </th>
                <th className="text-right text-sm font-semibold text-gray-700 pb-3 px-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {earningsLoading ? (
                // Loading skeleton rows
                Array.from({ length: 3 }).map((_, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-3"><Skeleton className="h-5 w-16" /></td>
                    <td className="py-3 px-3"><Skeleton className="h-5 w-10" /></td>
                    <td className="py-3 px-3"><Skeleton className="h-5 w-20" /></td>
                    <td className="py-3 px-3"><Skeleton className="h-5 w-16" /></td>
                    <td className="py-3 px-3 text-right"><Skeleton className="h-8 w-20 ml-auto" /></td>
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
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'PAID' ? 'bg-green-100 text-green-800' :
                        item.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        item.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                        item.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="text-right py-3 px-3">
                      <Button className="bg-[#002AC8] hover:bg-[#001F9C] text-white px-4 py-1 h-8 text-sm font-medium rounded-md">
                        Download
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    No earnings history found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Payout Settings Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Edit Payout Settings
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Recipient Input */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Recipient
              </label>
              <Input
                type="text"
                value={editFormData.recipient}
                onChange={(e) => handleInputChange("recipient", e.target.value)}
                className="h-10 border-gray-300 rounded-lg"
                placeholder="Enter recipient name"
              />
            </div>
            {/* IBAN Input */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                IBAN
              </label>
              <Input
                type="text"
                value={editFormData.iban}
                onChange={(e) => handleInputChange("iban", e.target.value)}
                className="h-10 border-gray-300 rounded-lg"
                placeholder="DE89 3704 0044 0532 0130 00"
              />
            </div>
          </div>
          <DialogFooter className="gap-3 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="px-6 h-10 font-medium bg-transparent"
              disabled={updatePayoutMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveChanges}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-10 font-medium"
              disabled={updatePayoutMutation.isPending}
            >
              {updatePayoutMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
