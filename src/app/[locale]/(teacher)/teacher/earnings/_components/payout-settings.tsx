"use client";
import { useState, useEffect } from "react";
import { Edit, Loader2 } from "lucide-react";
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
import {
  usePayoutSettings,
  useUpdatePayoutSettings,
} from "@/hooks/api";
import { toast } from "sonner";

import { useTranslations } from "next-intl";

export default function PayoutSettings() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    recipient: "",
    iban: "",
  });

  const { data: payoutSettings, isLoading } = usePayoutSettings();
  const updatePayoutMutation = useUpdatePayoutSettings();
  const t = useTranslations("earnings");

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
      toast.success(t("payoutUpdatedSuccess"));
      setIsEditDialogOpen(false);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : t("payoutUpdateFailed");
      toast.error(message);
    }
  };

  const handleInputChange = (
    field: keyof typeof editFormData,
    value: string,
  ) => {
    setEditFormData({ ...editFormData, [field]: value });
  };

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 lg:p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            {t("payoutSettings")}
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
          <div className="flex-1">
            <label className="text-xs font-medium text-gray-600 block mb-2">
              {t("recipient")}
            </label>
            {isLoading ? (
              <Skeleton className="h-6 w-32" />
            ) : (
              <p className="text-gray-900 font-medium">
                {payoutSettings?.recipient || t("notSet")}
              </p>
            )}
          </div>
          <div className="flex-1">
            <label className="text-xs font-medium text-gray-600 block mb-2">
              {t("iban")}
            </label>
            {isLoading ? (
              <Skeleton className="h-6 w-40" />
            ) : (
              <p className="text-gray-900 font-medium">
                {payoutSettings?.iban || t("notSet")}
              </p>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {t("editPayoutSettings")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                {t("recipient")}
              </label>
              <Input
                type="text"
                value={editFormData.recipient}
                onChange={(e) => handleInputChange("recipient", e.target.value)}
                className="h-10 border-gray-300 rounded-lg"
                placeholder={t("recipientPlaceholder")}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                {t("iban")}
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
              onClick={() => setIsEditDialogOpen(false)}
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
    </>
  );
}
