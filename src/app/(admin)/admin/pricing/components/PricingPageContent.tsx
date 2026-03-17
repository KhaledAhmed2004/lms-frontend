"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useAdminPricingConfig } from "@/hooks/api";
import PricingHeader from "./PricingHeader";
import PricingPlanCard from "./PricingPlanCard";

const PricingManagement = () => {
  const {
    data: pricingConfig,
    isLoading,
    error,
    refetch,
  } = useAdminPricingConfig();

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
        <p className="text-red-500">
          Error loading pricing config. Please try again.
        </p>
      </div>
    );
  }

  const plans = pricingConfig?.plans || [];

  return (
    <div className="space-y-6">
      <PricingHeader />

      {/* Pricing Cards - matches homepage grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-10">
        {plans
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((plan) => (
            <PricingPlanCard key={plan.tier} plan={plan} onUpdate={refetch} />
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
