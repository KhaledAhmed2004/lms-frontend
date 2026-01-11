'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useCreateSetupIntent } from '@/hooks/api/use-subscription';
import { StripeProvider } from '@/providers/stripe-provider';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useQueryClient } from '@tanstack/react-query';

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Inner form component that uses Stripe hooks
function AddPaymentMethodForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Confirm the SetupIntent - this automatically attaches the payment method to the customer
      const { error: setupError, setupIntent } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/student/subscription`,
        },
        redirect: 'if_required',
      });

      if (setupError) {
        setError(setupError.message || 'Failed to add payment method');
        return;
      }

      if (setupIntent && setupIntent.status === 'succeeded') {
        // Payment method is automatically attached to customer via SetupIntent
        // Invalidate payment methods query to refresh the list
        queryClient.invalidateQueries({ queryKey: ['payment-methods'] });

        setIsSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Payment Method Added!
        </h3>
        <p className="text-gray-600">
          Your card has been saved successfully.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Stripe Payment Element */}
      <div className="min-h-[200px]">
        <PaymentElement
          onReady={() => setIsReady(true)}
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || !elements || !isReady || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            'Add Card'
          )}
        </Button>
      </div>
    </form>
  );
}

export function AddPaymentMethodModal({ isOpen, onClose }: AddPaymentMethodModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  const createSetupIntent = useCreateSetupIntent();

  // Create setup intent when modal opens
  useEffect(() => {
    if (isOpen && !clientSecret) {
      setIsInitializing(true);
      setInitError(null);

      createSetupIntent.mutateAsync()
        .then((response) => {
          setClientSecret(response.clientSecret);
        })
        .catch((err) => {
          setInitError(err.message || 'Failed to initialize payment setup');
        })
        .finally(() => {
          setIsInitializing(false);
        });
    }
  }, [isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setClientSecret(null);
      setInitError(null);
    }
  }, [isOpen]);

  const handleSuccess = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>
          <DialogDescription>
            Add a new credit or debit card to your account.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Loading state */}
          {isInitializing && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#002AC8] mb-4" />
              <p className="text-sm text-gray-500">Initializing secure payment...</p>
            </div>
          )}

          {/* Error state */}
          {initError && (
            <div className="text-center py-8">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <p className="text-red-600 mb-4">{initError}</p>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          )}

          {/* Payment form */}
          {clientSecret && !isInitializing && !initError && (
            <StripeProvider clientSecret={clientSecret}>
              <AddPaymentMethodForm onSuccess={handleSuccess} onCancel={onClose} />
            </StripeProvider>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
