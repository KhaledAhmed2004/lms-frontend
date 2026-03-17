'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useLegalPolicy,
  useUpsertLegalPolicy,
  POLICY_TYPE,
  POLICY_TYPE_LABELS,
} from '@/hooks/api';

const LegalPoliciesPage = () => {
  const [selectedPolicyType, setSelectedPolicyType] = useState<POLICY_TYPE>(POLICY_TYPE.PRIVACY_POLICY);
  const [policyContent, setPolicyContent] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Fetch selected policy
  const { data: selectedPolicy, isLoading: policyLoading } = useLegalPolicy(selectedPolicyType);

  // Mutation for saving
  const upsertMutation = useUpsertLegalPolicy();

  // Update form when selected policy changes
  useEffect(() => {
    if (selectedPolicy) {
      setPolicyContent(selectedPolicy.content || '');
    } else {
      setPolicyContent('');
    }
  }, [selectedPolicy, selectedPolicyType]);

  const handleSave = async () => {
    try {
      await upsertMutation.mutateAsync({
        type: selectedPolicyType,
        payload: {
          title: POLICY_TYPE_LABELS[selectedPolicyType],
          content: policyContent,
          isActive: true,
        },
      });

      setShowSuccessMessage(true);

      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    } catch (error) {
      console.error('Failed to save policy:', error);
    }
  };

  const policyOptions = Object.values(POLICY_TYPE).map((type) => ({
    value: type,
    label: POLICY_TYPE_LABELS[type],
  }));

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Legal Policy Management
        </h1>
        <p className="text-gray-600 text-sm">
          Manage all legal policies from one place. Select a policy type from the dropdown to edit its content.
          These policies will be displayed to users on the website.
        </p>
      </div>

      {/* Success Alert */}
      {showSuccessMessage && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 ml-2">
            {POLICY_TYPE_LABELS[selectedPolicyType]} has been successfully updated and will now appear on the website.
          </AlertDescription>
        </Alert>
      )}

      {/* Policy Selector */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Select Policy Type</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedPolicyType}
            onValueChange={(value) => setSelectedPolicyType(value as POLICY_TYPE)}
          >
            <SelectTrigger className="w-full md:w-80">
              <SelectValue placeholder="Select a policy type" />
            </SelectTrigger>
            <SelectContent>
              {policyOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Editor Section */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {POLICY_TYPE_LABELS[selectedPolicyType]} Editor
            {policyLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Content Text Area */}
          <textarea
              id="policyContent"
              value={policyContent}
              onChange={(e) => setPolicyContent(e.target.value)}
              placeholder={`Write or paste your ${POLICY_TYPE_LABELS[selectedPolicyType]} content here...`}
              className="w-full h-80 p-4 border border-gray-200 rounded-lg focus:border-gray-300 focus:ring-0 focus:outline-none resize-none bg-white text-gray-900 placeholder-gray-400"
              disabled={policyLoading}
            />

          {/* Last Updated Info */}
          {selectedPolicy?.updatedAt && (
            <p className="text-sm text-gray-500">
              Last updated: {new Date(selectedPolicy.updatedAt).toLocaleString()}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={upsertMutation.isPending || !policyContent.trim()}
        className="w-full md:w-1/3 bg-[#002AC8] text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {upsertMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Save {POLICY_TYPE_LABELS[selectedPolicyType]}
      </button>
    </div>
  );
};

export default LegalPoliciesPage;
