"use client";

import React, { useState, useEffect } from "react";
import { Euro, Loader2, Save, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  useAdminPricingConfig,
  useUpdateSinglePlan,
  PricingPlan,
} from "@/hooks/api";
import { useTranslations } from "next-intl";

// Individual Plan Card Component (matches homepage design)
const PlanCard = ({
  plan,
  onUpdate,
}: {
  plan: PricingPlan;
  onUpdate: () => void;
}) => {
  const t = useTranslations("pricing");
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlan, setEditedPlan] = useState<PricingPlan>(plan);
  const updateSinglePlan = useUpdateSinglePlan();

  useEffect(() => {
    setEditedPlan(plan);
  }, [plan]);

  const updateField = (
    field: keyof PricingPlan,
    value: string | number | boolean | string[]
  ) => {
    setEditedPlan((prev) => ({ ...prev, [field]: value }));
  };

  const updateInclusions = (value: string) => {
    const inclusions = value.split(",").map((s) => s.trim()).filter(Boolean);
    updateField("inclusions", inclusions);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedPlan(plan);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      await updateSinglePlan.mutateAsync({
        tier: editedPlan.tier,
        updates: editedPlan,
      });
      toast.success(t("updatedSuccess", { name: plan.name }));
      setIsEditing(false);
      onUpdate();
    } catch (error: any) {
      toast.error(error?.message || t("updateFailed"));
    }
  };

  return (
    <div className="bg-white border border-gray-200 p-6 rounded-[28px] overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col h-full relative">
      {/* Inactive overlay */}
      {!plan.isActive && !isEditing && (
        <div className="absolute inset-0 bg-gray-100/80 rounded-[28px] z-10 flex items-center justify-center">
          <Badge className="bg-gray-500 text-white text-sm px-4 py-2">{t("inactive")}</Badge>
        </div>
      )}

      {/* Header - matches homepage gradient */}
      <div className="bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#6366F1] text-white px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{plan.name}</h3>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-md text-sm font-medium transition"
          >
            <Pencil size={14} />
            {t("edit")}
          </button>
        ) : (
          <button
            onClick={handleCancel}
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-md text-sm font-medium transition"
          >
            <X size={14} />
            {t("cancel")}
          </button>
        )}
      </div>

      {/* View Mode - matches homepage exactly */}
      {!isEditing ? (
        <div className="space-y-4 flex-1">
          <div>
            <p className="text-xs text-gray-500 mb-1">{t("pricePerHour")}</p>
            <p className="text-2xl font-bold text-gray-900">{plan.pricePerHour}€</p>
          </div>
          <hr className="border-t border-[#F4F6F9]" />
          <div>
            <p className="text-xs text-gray-500 mb-1">{t("duration")}</p>
            <p className="text-sm font-semibold text-gray-900">{plan.courseDuration}</p>
          </div>
          <hr className="border-t border-[#F4F6F9]" />
          <div>
            <p className="text-xs text-gray-500 mb-1">{t("sessions")}</p>
            <p className="text-sm font-semibold text-gray-900">{plan.selectedHours}</p>
            <p className="text-sm text-gray-900 font-semibold mt-1">
              {plan.selectedHoursDetails}
            </p>
          </div>
          <hr className="border-t border-[#F4F6F9]" />
          <div>
            <p className="text-xs text-gray-500 mb-1">{t("scheduling")}</p>
            <p className="text-sm font-semibold text-gray-900">{plan.termType}</p>
          </div>
          <hr className="border-t border-[#F4F6F9]" />
          <div>
            <p className="text-xs text-gray-500 mb-2">{t("recommendedFor")}</p>
            <ul className="space-y-1">
              {plan.inclusions.map((inclusion, idx) => (
                <li key={idx} className="text-sm font-semibold text-gray-900">
                  {inclusion}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        /* Edit Mode */
        <div className="space-y-4 flex-1">
          {/* Display Name */}
          <div className="space-y-1.5">
            <Label htmlFor={`${editedPlan.tier}-name`} className="text-xs text-gray-500">
              {t("displayName")}
            </Label>
            <Input
              id={`${editedPlan.tier}-name`}
              value={editedPlan.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="h-9"
            />
          </div>

          <hr className="border-t border-[#F4F6F9]" />

          {/* Price per Hour */}
          <div className="space-y-1.5">
            <Label htmlFor={`${editedPlan.tier}-price`} className="text-xs text-gray-500">
              {t("pricePerHourEdit")}
            </Label>
            <div className="relative">
              <Euro
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <Input
                id={`${editedPlan.tier}-price`}
                type="number"
                min="0"
                step="0.01"
                value={editedPlan.pricePerHour}
                onChange={(e) =>
                  updateField("pricePerHour", parseFloat(e.target.value) || 0)
                }
                className="pl-8 h-9"
              />
            </div>
          </div>

          <hr className="border-t border-[#F4F6F9]" />

          {/* Duration */}
          <div className="space-y-1.5">
            <Label htmlFor={`${editedPlan.tier}-duration`} className="text-xs text-gray-500">
              {t("duration")}
            </Label>
            <Input
              id={`${editedPlan.tier}-duration`}
              value={editedPlan.courseDuration}
              onChange={(e) => updateField("courseDuration", e.target.value)}
              placeholder={t("durationPlaceholder")}
              className="h-9"
            />
          </div>

          <hr className="border-t border-[#F4F6F9]" />

          {/* Sessions */}
          <div className="space-y-1.5">
            <Label htmlFor={`${editedPlan.tier}-sessions`} className="text-xs text-gray-500">
              {t("sessions")}
            </Label>
            <Input
              id={`${editedPlan.tier}-sessions`}
              value={editedPlan.selectedHours}
              onChange={(e) => updateField("selectedHours", e.target.value)}
              className="h-9"
            />
            <Input
              id={`${editedPlan.tier}-details`}
              value={editedPlan.selectedHoursDetails}
              onChange={(e) => updateField("selectedHoursDetails", e.target.value)}
              className="h-9 mt-1.5"
            />
          </div>

          <hr className="border-t border-[#F4F6F9]" />

          {/* Scheduling */}
          <div className="space-y-1.5">
            <Label htmlFor={`${editedPlan.tier}-term`} className="text-xs text-gray-500">
              {t("scheduling")}
            </Label>
            <Input
              id={`${editedPlan.tier}-term`}
              value={editedPlan.termType}
              onChange={(e) => updateField("termType", e.target.value)}
              placeholder={t("schedulingPlaceholder")}
              className="h-9"
            />
          </div>

          <hr className="border-t border-[#F4F6F9]" />

          {/* Recommended for */}
          <div className="space-y-1.5">
            <Label htmlFor={`${editedPlan.tier}-inclusions`} className="text-xs text-gray-500">
              {t("recommendedForEdit")}
            </Label>
            <Textarea
              id={`${editedPlan.tier}-inclusions`}
              value={editedPlan.inclusions.join(", ")}
              onChange={(e) => updateInclusions(e.target.value)}
              placeholder={t("recommendedPlaceholder")}
              rows={2}
              className="resize-none text-sm"
            />
          </div>

          <hr className="border-t border-[#F4F6F9]" />

          {/* Advanced Settings */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor={`${editedPlan.tier}-minHours`} className="text-xs text-gray-500">
                {t("minHours")}
              </Label>
              <Input
                id={`${editedPlan.tier}-minHours`}
                type="number"
                min="0"
                value={editedPlan.minimumHours}
                onChange={(e) =>
                  updateField("minimumHours", parseInt(e.target.value) || 0)
                }
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`${editedPlan.tier}-commitment`} className="text-xs text-gray-500">
                {t("commitment")}
              </Label>
              <Input
                id={`${editedPlan.tier}-commitment`}
                type="number"
                min="0"
                value={editedPlan.commitmentMonths}
                onChange={(e) =>
                  updateField("commitmentMonths", parseInt(e.target.value) || 0)
                }
                className="h-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor={`${editedPlan.tier}-order`} className="text-xs text-gray-500">
                {t("displayOrder")}
              </Label>
              <Input
                id={`${editedPlan.tier}-order`}
                type="number"
                min="1"
                value={editedPlan.sortOrder}
                onChange={(e) =>
                  updateField("sortOrder", parseInt(e.target.value) || 1)
                }
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500">{t("status")}</Label>
              <div className="flex items-center gap-2 h-9">
                <Switch
                  id={`${editedPlan.tier}-active`}
                  checked={editedPlan.isActive}
                  onCheckedChange={(checked) => updateField("isActive", checked)}
                />
                <span className="text-sm text-gray-600">
                  {editedPlan.isActive ? t("active") : t("inactive")}
                </span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={updateSinglePlan.isPending}
            className="w-full bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#6366F1] hover:opacity-90 mt-2"
          >
            {updateSinglePlan.isPending ? (
               <Loader2 size={16} className="mr-2 animate-spin" />
            ) : (
               <Save size={16} className="mr-2" />
            )}
            {t("saveChanges")}
          </Button>
        </div>
      )}
    </div>
  );
};

const PricingManagement = () => {
  const t = useTranslations("pricing");
  const { data: pricingConfig, isLoading, error, refetch } = useAdminPricingConfig();

  // Loading skeleton - matches homepage
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-10">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 p-6 rounded-[28px] overflow-hidden shadow-sm animate-pulse"
            >
              <div className="h-12 bg-gray-200 rounded-lg mb-6" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-24" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">{t("errorLoading")}</p>
      </div>
    );
  }

  const plans = pricingConfig?.plans || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-gray-600 mt-1">
          {t("subtitle")}
        </p>
      </div>

      {/* Pricing Cards - matches homepage grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-10">
        {plans
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((plan) => (
            <PlanCard
              key={plan.tier}
              plan={plan}
              onUpdate={refetch}
            />
          ))}
      </div>

      {/* Last Updated Info */}
      {pricingConfig?.updatedAt && (
        <p className="text-sm text-gray-500 text-right">
          {t("lastUpdated")} {new Date(pricingConfig.updatedAt).toLocaleString()}
        </p>
      )}

    </div>
  );
};

export default PricingManagement;
