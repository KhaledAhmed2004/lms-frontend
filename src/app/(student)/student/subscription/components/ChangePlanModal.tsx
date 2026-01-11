'use client';

import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { PLAN_DISPLAY_NAMES, PLAN_DETAILS, SubscriptionTier } from '@/hooks/api/use-subscription';
import { cn } from '@/lib/utils';

interface ChangePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: SubscriptionTier | null;
}

export function ChangePlanModal({ isOpen, onClose, currentPlan }: ChangePlanModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionTier>(currentPlan || 'FLEXIBLE');
  const [isLoading, setIsLoading] = useState(false);

  const plans: SubscriptionTier[] = ['FLEXIBLE', 'REGULAR', 'LONG_TERM'];

  const handleChangePlan = async () => {
    if (selectedPlan === currentPlan) {
      onClose();
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement plan change API call
      // await changePlan.mutateAsync(selectedPlan);
      console.log('Changing plan to:', selectedPlan);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      onClose();
    } catch (error) {
      console.error('Failed to change plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Change Your Plan</DialogTitle>
          <DialogDescription>
            Select a plan that best fits your learning needs.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          {plans.map((plan) => {
            const details = PLAN_DETAILS[plan];
            const isSelected = selectedPlan === plan;
            const isCurrent = currentPlan === plan;

            return (
              <div
                key={plan}
                onClick={() => setSelectedPlan(plan)}
                className={cn(
                  'relative border rounded-lg p-4 cursor-pointer transition-all',
                  isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-gray-300',
                  isCurrent && 'bg-gray-50'
                )}
              >
                {isCurrent && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                    Current
                  </span>
                )}

                <h3 className="font-semibold text-lg">{PLAN_DISPLAY_NAMES[plan]}</h3>
                <div className="mt-1">
                  <span className="text-2xl font-bold">${details.pricePerHour}</span>
                  <span className="text-gray-500">/hour</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{details.commitment}</p>

                <ul className="mt-4 space-y-2">
                  {details.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleChangePlan}
            disabled={isLoading || selectedPlan === currentPlan}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {selectedPlan === currentPlan ? 'Current Plan' : 'Change Plan'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
