"use client";
import { useState, useEffect } from 'react';
import { Check, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { StripeProvider } from '@/providers/stripe-provider';
import { SubscriptionPaymentForm } from '@/components/subscription/SubscriptionPaymentForm';
import {
  useCreateSubscriptionPaymentIntent,
  useConfirmSubscriptionPayment,
  type SubscriptionTier,
} from '@/hooks/api/use-subscription-payment';

type PlanId = 'flexible' | 'regular' | 'longterm';

const PLAN_TO_TIER: Record<PlanId, SubscriptionTier> = {
  flexible: 'FLEXIBLE',
  regular: 'REGULAR',
  longterm: 'LONG_TERM',
};

const Page3 = () => {
  const router = useRouter();
  const [step] = useState(3);
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('flexible');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(30);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const createPaymentIntent = useCreateSubscriptionPaymentIntent();
  const confirmPayment = useConfirmSubscriptionPayment();

  const pricingPlans = [
    {
      id: 'flexible' as PlanId,
      name: 'Flexibel',
      pricePerHour: '30€',
      totalPrice: 30,
      courseDuration: 'Keine',
      selectedHours: 'Anzahl wählbar',
      selectedHoursDetails: 'Keine Mindestanzahl',
      termType: 'Flexibel',
      inclusions: ['Kurzfristige Unterstützung,', 'Prüfungsvorbereitung']
    },
    {
      id: 'regular' as PlanId,
      name: 'Regelmäßig',
      pricePerHour: '28€',
      totalPrice: 112,
      courseDuration: '1 Monat',
      selectedHours: 'Anzahl wählbar',
      selectedHoursDetails: 'Min. 4 Stunden pro Monat',
      termType: 'Flexibel oder regelmäßig',
      inclusions: ['Unterstützung bei Hausaufgaben,', 'Unterrichtsbegleitung']
    },
    {
      id: 'longterm' as PlanId,
      name: 'Langfristig',
      pricePerHour: '25€',
      totalPrice: 100,
      courseDuration: '3 Monate',
      selectedHours: 'Anzahl wählbar',
      selectedHoursDetails: 'Min. 4 Stunden pro Monat',
      termType: 'Flexibel oder regelmäßig',
      inclusions: ['Langfristige Unterstützung,', 'Grundlagenwiederholen']
    }
  ];

  // Update payment amount when plan changes
  useEffect(() => {
    const plan = pricingPlans.find(p => p.id === selectedPlan);
    if (plan) {
      setPaymentAmount(plan.totalPrice);
    }
    // Reset payment form when plan changes
    setClientSecret(null);
    setSubscriptionId(null);
    setShowPaymentForm(false);
  }, [selectedPlan]);

  // Handle proceed to payment
  const handleProceedToPayment = async () => {
    if (!agreedToTerms) {
      toast.error('Please agree to the Terms and Conditions');
      return;
    }

    try {
      const tier = PLAN_TO_TIER[selectedPlan];
      const result = await createPaymentIntent.mutateAsync(tier);

      setClientSecret(result.clientSecret);
      setSubscriptionId(result.subscriptionId);
      setPaymentAmount(result.amount);
      setShowPaymentForm(true);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to initialize payment');
    }
  };

  // Handle payment success
  const handlePaymentSuccess = async (paymentIntentId: string) => {
    if (!subscriptionId) {
      toast.error('Subscription ID not found');
      return;
    }

    try {
      await confirmPayment.mutateAsync({
        subscriptionId,
        paymentIntentId,
      });

      toast.success('Subscription activated successfully!');
      router.push('/student/subscription');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to activate subscription');
    }
  };

  // Handle cancel payment
  const handleCancelPayment = () => {
    setClientSecret(null);
    setSubscriptionId(null);
    setShowPaymentForm(false);
  };

  const selectedPlanDetails = pricingPlans.find(p => p.id === selectedPlan);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* Trial Session Card */}
        <div className="rounded-lg shadow-sm border border-gray-200 p-6 mb-8 bg-white">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Trial Session Request</h2>

          {/* Progress Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-2.5 left-0 right-0 h-2 rounded-3xl bg-gray-300 z-0"></div>
              <div
                className="absolute top-2.5 left-0 h-2 rounded-3xl bg-[#0B31BD] z-10 transition-all duration-700 ease-in-out"
                style={{ width: '95%' }}
              ></div>

              {/* Step 1 */}
              <div className="flex flex-col items-center relative z-10">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white font-semibold mb-2 bg-[#0B31BD]">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-sm text-center text-gray-700">Tutor Matching request</span>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center relative z-10">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white font-semibold mb-2 bg-[#0B31BD]">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-sm text-center text-gray-700">Trial Session</span>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center relative z-10">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-semibold mb-2 ${step >= 3 ? 'bg-[#0B31BD]' : 'bg-gray-300'}`}>
                </div>
                <span className="text-sm text-center text-gray-700">Start Learning</span>
              </div>
            </div>
          </div>

          {/* Status Message */}
          <div className="border bg-[#FFF4E6] border-[#FF8A00] rounded-lg p-4">
            <p className="font-normal text-gray-800">You have completed your trial session.</p>
            <p className="text-sm text-[#666666]">Choose a plan and insert your payment details to start learning.</p>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => !showPaymentForm && setSelectedPlan(plan.id)}
                className={`rounded-2xl border-2 p-6 transition-all bg-white ${
                  showPaymentForm ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                } ${
                  selectedPlan === plan.id
                    ? 'border-[#0B31BD] shadow-lg'
                    : 'border-gray-200 hover:shadow-md'
                }`}
              >
                {/* Header with Title and Radio Button */}
                <div className={`flex items-center justify-between mb-6 pb-4 rounded-lg px-4 py-2 ${
                  selectedPlan === plan.id
                    ? 'bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#6366F1] text-white'
                    : 'text-gray-900'
                }`}>
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedPlan === plan.id
                      ? 'border-white bg-white'
                      : 'border-gray-300 bg-white'
                  }`}>
                    {selectedPlan === plan.id && <Check className="w-4 h-4 text-[#3B82F6]" />}
                  </div>
                </div>

                {/* Price Section */}
                <div className="mb-5">
                  <p className="text-xs text-gray-600 mb-1">Preis pro Stunde</p>
                  <p className="text-3xl font-bold text-gray-900">{plan.pricePerHour}</p>
                </div>

                <hr className="border-gray-200 mb-5" />

                {/* Duration Section */}
                <div className="mb-5">
                  <p className="text-xs text-gray-600 mb-1">Laufzeit</p>
                  <p className="text-base font-semibold text-gray-900">{plan.courseDuration}</p>
                </div>

                <hr className="border-gray-200 mb-5" />

                {/* Units Section */}
                <div className="mb-5">
                  <p className="text-xs text-gray-600 mb-1">Einheiten</p>
                  <p className="text-base font-semibold text-gray-900">{plan.selectedHours}</p>
                  <p className="text-sm text-gray-800 font-medium mt-1">{plan.selectedHoursDetails}</p>
                </div>

                <hr className="border-gray-200 mb-5" />

                {/* Appointment Section */}
                <div className="mb-5">
                  <p className="text-xs text-gray-600 mb-1">Terminvereinbarung</p>
                  <p className="text-base font-semibold text-gray-900">{plan.termType}</p>
                </div>

                <hr className="border-gray-200 mb-5" />

                {/* Recommended For Section */}
                <div>
                  <p className="text-xs text-gray-600 mb-2">Empfohlen für</p>
                  <ul className="space-y-1">
                    {plan.inclusions.map((inclusion, idx) => (
                      <li key={idx} className="text-sm font-semibold text-gray-900">
                        {inclusion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Section */}
        {showPaymentForm && clientSecret ? (
          <StripeProvider clientSecret={clientSecret}>
            <SubscriptionPaymentForm
              amount={paymentAmount}
              currency="€"
              planName={selectedPlanDetails?.name || ''}
              onSuccess={handlePaymentSuccess}
              onCancel={handleCancelPayment}
              isConfirming={confirmPayment.isPending}
            />
          </StripeProvider>
        ) : (
          <>
            {/* Terms and Conditions */}
            <div className="flex items-center gap-3 mb-6">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-[#0B31BD]"
              />
              <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                I have read and agree to the <span className="text-[#0B31BD] font-medium"><Link href="/terms" className='underline'>Terms and Conditions</Link></span>
              </label>
            </div>

            {/* Payment Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Summary</h3>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Selected Plan</span>
                <span className="font-semibold text-gray-900">{selectedPlanDetails?.name}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Price per Hour</span>
                <span className="font-semibold text-gray-900">{selectedPlanDetails?.pricePerHour}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Duration</span>
                <span className="font-semibold text-gray-900">{selectedPlanDetails?.courseDuration}</span>
              </div>
              <div className="flex justify-between items-center py-3 mt-2">
                <span className="text-lg font-semibold text-gray-800">Total Amount</span>
                <span className="text-2xl font-bold text-[#0B31BD]">{paymentAmount}€</span>
              </div>
            </div>

            {/* Error Message */}
            {createPaymentIntent.isError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">
                  {(createPaymentIntent.error as any)?.response?.data?.message || 'Failed to initialize payment. Please try again.'}
                </p>
              </div>
            )}

            {/* Proceed to Payment Button */}
            <button
              onClick={handleProceedToPayment}
              disabled={!agreedToTerms || createPaymentIntent.isPending}
              className={`w-full px-6 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2 ${
                agreedToTerms && !createPaymentIntent.isPending
                  ? 'bg-[#0B31BD] text-white hover:bg-blue-800'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
            >
              {createPaymentIntent.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Initializing Payment...
                </>
              ) : (
                'Proceed to Payment'
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Page3;