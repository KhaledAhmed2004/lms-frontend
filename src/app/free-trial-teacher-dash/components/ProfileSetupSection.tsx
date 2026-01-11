'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Camera,
  CheckCircle,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useStripeConnect } from '@/hooks/api/use-stripe';
import { useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';

interface ProfileSetupSectionProps {
  userEmail: string;
}

export function ProfileSetupSection({ userEmail }: ProfileSetupSectionProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);
  const currentUser = useAuthStore((state) => state.user);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToTax, setAgreedToTax] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const {
    status: stripeStatus,
    statusLoading,
    startOnboarding,
    isCreatingAccount,
    isGettingLink,
  } = useStripeConnect();

  const handleStripeSetup = async () => {
    setIsRedirecting(true);
    try {
      const onboardingUrl = await startOnboarding();
      if (onboardingUrl) {
        window.location.href = onboardingUrl;
      } else {
        toast.success('Stripe account is already set up!');
        setIsRedirecting(false);
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to start Stripe onboarding');
      setIsRedirecting(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    // Preview image
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // TODO: Upload to server
    setIsUploadingImage(true);
    try {
      // Add your image upload logic here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated delay
      toast.success('Profile picture updated');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDisconnectStripe = async () => {
    // TODO: Implement disconnect logic
    toast.info('Disconnect functionality coming soon');
  };

  const handleManageAccount = () => {
    // Open Stripe dashboard
    window.open('https://dashboard.stripe.com/', '_blank');
  };

  const handleStartTutoring = async () => {
    if (!agreedToTerms || !agreedToTax) {
      toast.error('Please agree to all terms and conditions');
      return;
    }

    if (!profileImage) {
      toast.error('Please upload a profile picture');
      return;
    }

    if (!isStripeComplete) {
      toast.error('Please complete your Stripe setup');
      return;
    }

    setIsStarting(true);
    try {
      // Fetch application to get new token with TUTOR role
      const response = await apiClient.get('/applications/my-application');
      const { accessToken } = response.data;

      // If new token is provided, update auth store with TUTOR role
      if (accessToken && currentUser) {
        setAuth({ ...currentUser, role: 'TUTOR' }, accessToken);
      }

      // Invalidate all queries to refetch with new role
      await queryClient.invalidateQueries();

      toast.success('Welcome! You can now start tutoring.');
      router.push('/teacher/overview');
    } catch (error) {
      toast.error('Failed to complete setup');
    } finally {
      setIsStarting(false);
    }
  };

  const isStripeComplete = stripeStatus?.isOnboardingComplete ?? false;
  const hasStripeAccount = stripeStatus?.hasStripeAccount ?? false;
  const isStripeLoading = isCreatingAccount || isGettingLink || isRedirecting;
  const stripeAccountId = stripeStatus?.accountId || '';

  const canStartTutoring = agreedToTerms && agreedToTax && profileImage && isStripeComplete;

  return (
    <div className="space-y-6">
      {/* Profile Setup Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Profile Setup</h2>

        {/* Profile Picture Upload */}
        <div className="flex items-center gap-8">
          <div className="relative">
            <div
              onClick={handleImageClick}
              className="w-28 h-28 rounded-full bg-gray-100 border-4 border-gray-200 overflow-hidden cursor-pointer hover:border-gray-300 transition-colors"
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-200 to-gray-300">
                  <svg
                    className="w-16 h-16 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}
              {isUploadingImage && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </div>
            {/* Camera button at bottom center */}
            <button
              onClick={handleImageClick}
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-9 h-9 bg-[#0B31BD] rounded-full flex items-center justify-center text-white hover:bg-[#0926a0] transition-colors shadow-lg"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div>
            <p className="text-gray-900 font-medium text-base">
              Upload a new profile picture <span className="text-red-500">*</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              JPG, PNG or GIF. Max size of 5MB
            </p>
          </div>
        </div>
      </div>

      {/* Payment Account Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Account</h2>

        {statusLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : isStripeComplete ? (
          // Connected State
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Stripe account connected</p>
                <p className="text-sm text-gray-500">Your account is ready to receive payments</p>
              </div>
            </div>

            {/* Account Info Card */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[#635BFF] font-bold text-xl">S</span>
                <span className="font-medium text-gray-900">{stripeAccountId || 'acct_1234567890'}</span>
              </div>
              <p className="text-sm text-gray-500 ml-7">{userEmail}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-1">
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-full border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
                onClick={handleManageAccount}
              >
                Manage Account
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-full border-red-200 text-red-500 font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                onClick={handleDisconnectStripe}
              >
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          // Not Connected State
          <div className="space-y-4">
            {hasStripeAccount && !isStripeComplete ? (
              <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-yellow-800 text-xs font-bold">!</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Complete Your Stripe Setup
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Your account needs additional information before you can receive payments.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 p-5 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#635BFF] font-bold text-xl">S</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Connect with Stripe</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Set up your payment account to receive earnings from tutoring sessions.
                  </p>
                </div>
              </div>
            )}

            <Button
              onClick={handleStripeSetup}
              disabled={isStripeLoading}
              className="w-full h-12 rounded-full bg-[#0B31BD] hover:bg-[#0926a0] font-medium"
            >
              {isStripeLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : hasStripeAccount && !isStripeComplete ? (
                <>
                  Complete Setup
                  <ExternalLink className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Connect Stripe Account
                  <ExternalLink className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Terms and Conditions */}
      <div className="space-y-4 px-1">
        <div className="flex items-start gap-3">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
            className="mt-0.5 h-5 w-5 rounded border-gray-300 data-[state=checked]:bg-[#0B31BD] data-[state=checked]:border-[#0B31BD]"
          />
          <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
            I have read and agree to the{' '}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 underline hover:text-[#0B31BD]"
            >
              Terms and Conditions
            </a>
          </label>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="tax"
            checked={agreedToTax}
            onCheckedChange={(checked) => setAgreedToTax(checked as boolean)}
            className="mt-0.5 h-5 w-5 rounded border-gray-300 data-[state=checked]:bg-[#0B31BD] data-[state=checked]:border-[#0B31BD]"
          />
          <label htmlFor="tax" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
            I confirm that I am self-employed and responsible for all tax and business requirements in my country of residence{' '}
            <span className="text-red-500">*</span>
          </label>
        </div>
      </div>

      {/* Start Tutoring Button */}
      <Button
        onClick={handleStartTutoring}
        disabled={!canStartTutoring || isStarting}
        className="w-full h-14 rounded-xl bg-[#0B31BD] hover:bg-[#0926a0] font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isStarting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Starting...
          </>
        ) : (
          'Start Tutoring'
        )}
      </Button>
    </div>
  );
}

export default ProfileSetupSection;
