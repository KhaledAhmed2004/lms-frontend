'use client';

import { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface SubscriptionPaymentFormProps {
  amount: number;
  currency?: string;
  planName: string;
  onSuccess?: (paymentIntentId: string) => void;
  onCancel?: () => void;
  onError?: (error: string) => void;
  isConfirming?: boolean;
}

export function SubscriptionPaymentForm({
  amount,
  currency = '€',
  planName,
  onSuccess,
  onCancel,
  onError,
  isConfirming = false,
}: SubscriptionPaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Confirm the payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/student/subscription?payment=success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'Payment failed');
        onError?.(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment successful - call onSuccess with paymentIntentId
        setIsSuccess(true);
        onSuccess?.(paymentIntent.id);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred');
      onError?.(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Payment Successful!
        </h3>
        <p className="text-gray-600">
          Your {planName} subscription is now active.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Plan Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">{planName} Plan</h4>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-900">
            {currency}{amount}
          </span>
        </div>
      </div>

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
      {errorMessage && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onCancel}
            disabled={isLoading || isConfirming}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          className={`bg-black hover:bg-gray-800 ${onCancel ? 'flex-1' : 'w-full'}`}
          disabled={!stripe || !elements || !isReady || isLoading || isConfirming}
        >
          {isLoading || isConfirming ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isConfirming ? 'Confirming...' : 'Processing...'}
            </>
          ) : (
            `Pay ${currency}${amount}`
          )}
        </Button>
      </div>

      <p className="text-xs text-center text-gray-500">
        Your payment is secured by Stripe. By subscribing, you agree to our terms of service.
      </p>
    </form>
  );
}

export default SubscriptionPaymentForm;
