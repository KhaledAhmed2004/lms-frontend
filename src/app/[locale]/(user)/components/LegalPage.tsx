"use client";

import { usePublicLegalPolicy, POLICY_TYPE, POLICY_TYPE_LABELS } from "@/hooks/api";
import { Loader2 } from "lucide-react";

export const LegalPage = ({ type }: { type: POLICY_TYPE }) => {
  const { data: policy, isLoading } = usePublicLegalPolicy(type);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0B31BD]" />
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              {POLICY_TYPE_LABELS[type]}
            </h1>
            <p className="text-gray-500">
              This policy is not available yet. Please check back later.
            </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            {policy.title}
          </h1>
          <p className="text-sm text-gray-500 mb-8 text-center">
            Last updated:{" "}
            {new Date(policy.updatedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <div className="text-lg text-gray-700 whitespace-pre-wrap leading-relaxed">
            {policy.content}
          </div>
      </div>
    </div>
  );
};