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

// Individual Plan Card Component (matches homepage design)
const PlanCard = ({
  plan,
  onUpdate,
}: {
  plan: PricingPlan;
  onUpdate: () => void;
}) => {
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
      toast.success(`${plan.name} plan updated successfully`);
      setIsEditing(false);
      onUpdate();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update plan");
    }
  };

  return (
    <div className="bg-white border border-gray-200 p-6 rounded-[28px] overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col h-full relative">
      {/* Inactive overlay */}
      {!plan.isActive && !isEditing && (
        <div className="absolute inset-0 bg-gray-100/80 rounded-[28px] z-10 flex items-center justify-center">
          <Badge className="bg-gray-500 text-white text-sm px-4 py-2">Inactive</Badge>
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
            Edit
          </button>
        ) : (
          <button
            onClick={handleCancel}
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-md text-sm font-medium transition"
          >
            <X size={14} />
            Cancel
          </button>
        )}
      </div>

      {/* View Mode - matches homepage exactly */}
      {!isEditing ? (
        <div className="space-y-4 flex-1">
          <div>
            <p className="text-xs text-gray-500 mb-1">Price per hour</p>
            <p className="text-2xl font-bold text-gray-900">{plan.pricePerHour}€</p>
          </div>
          <hr className="border-t border-[#F4F6F9]" />
          <div>
            <p className="text-xs text-gray-500 mb-1">Duration</p>
            <p className="text-sm font-semibold text-gray-900">{plan.courseDuration}</p>
          </div>
          <hr className="border-t border-[#F4F6F9]" />
          <div>
            <p className="text-xs text-gray-500 mb-1">Sessions</p>
            <p className="text-sm font-semibold text-gray-900">{plan.selectedHours}</p>
            <p className="text-sm text-gray-900 font-semibold mt-1">
              {plan.selectedHoursDetails}
            </p>
          </div>
          <hr className="border-t border-[#F4F6F9]" />
          <div>
            <p className="text-xs text-gray-500 mb-1">Scheduling</p>
            <p className="text-sm font-semibold text-gray-900">{plan.termType}</p>
          </div>
          <hr className="border-t border-[#F4F6F9]" />
          <div>
            <p className="text-xs text-gray-500 mb-2">Recommended for</p>
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
              Display Name
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
              Price per hour (€)
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
              Duration
            </Label>
            <Input
              id={`${editedPlan.tier}-duration`}
              value={editedPlan.courseDuration}
              onChange={(e) => updateField("courseDuration", e.target.value)}
              placeholder="e.g., None, 1 Month, 3 Months"
              className="h-9"
            />
          </div>

          <hr className="border-t border-[#F4F6F9]" />

          {/* Sessions */}
          <div className="space-y-1.5">
            <Label htmlFor={`${editedPlan.tier}-sessions`} className="text-xs text-gray-500">
              Sessions
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
              Scheduling
            </Label>
            <Input
              id={`${editedPlan.tier}-term`}
              value={editedPlan.termType}
              onChange={(e) => updateField("termType", e.target.value)}
              placeholder="e.g., Flexible, Flexible or recurring"
              className="h-9"
            />
          </div>

          <hr className="border-t border-[#F4F6F9]" />

          {/* Recommended for */}
          <div className="space-y-1.5">
            <Label htmlFor={`${editedPlan.tier}-inclusions`} className="text-xs text-gray-500">
              Recommended for (comma-separated)
            </Label>
            <Textarea
              id={`${editedPlan.tier}-inclusions`}
              value={editedPlan.inclusions.join(", ")}
              onChange={(e) => updateInclusions(e.target.value)}
              placeholder="e.g., Shortterm support, Exam preparation"
              rows={2}
              className="resize-none text-sm"
            />
          </div>

          <hr className="border-t border-[#F4F6F9]" />

          {/* Advanced Settings */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor={`${editedPlan.tier}-minHours`} className="text-xs text-gray-500">
                Min. Hours
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
                Commitment (Months)
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
                Display Order
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
              <Label className="text-xs text-gray-500">Status</Label>
              <div className="flex items-center gap-2 h-9">
                <Switch
                  id={`${editedPlan.tier}-active`}
                  checked={editedPlan.isActive}
                  onCheckedChange={(checked) => updateField("isActive", checked)}
                />
                <span className="text-sm text-gray-600">
                  {editedPlan.isActive ? "Active" : "Inactive"}
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
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};

const PricingManagement = () => {
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
        <p className="text-red-500">Error loading pricing config. Please try again.</p>
      </div>
    );
  }

  const plans = pricingConfig?.plans || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pricing Management</h1>
        <p className="text-gray-600 mt-1">
          Manage subscription plans displayed on the homepage
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
          Last updated: {new Date(pricingConfig.updatedAt).toLocaleString()}
        </p>
      )}

    </div>
  );
};

export default PricingManagement;
