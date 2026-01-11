"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FileText, Check, Loader2, AlertCircle, XCircle, Upload, X } from "lucide-react";
import { useMyApplication, useUpdateMyApplication, useMyBookedInterview, type ApplicationStatus } from "@/hooks/api";
import { useStripeConnect } from "@/hooks/api/use-stripe";
import { toast } from "sonner";
import InterviewBookingSection from "./InterviewBookingSection";
import ProfileSetupSection from "./ProfileSetupSection";

// Helper functions
const getStepFromStatus = (status: ApplicationStatus): number => {
  switch (status) {
    case "SUBMITTED":
    case "REVISION":
    case "RESUBMITTED":
      return 1;
    case "SELECTED_FOR_INTERVIEW":
      return 2;
    case "APPROVED":
      return 3;
    case "REJECTED":
      return 0;
    default:
      return 1;
  }
};

const getStatusMessage = (
  status: ApplicationStatus,
  revisionNote?: string,
  rejectionReason?: string
) => {
  switch (status) {
    case "SUBMITTED":
      return {
        title: "Your Application has been sent and is under review.",
        subtitle: "You will be notified once the next step is unlocked",
        bgColor: "bg-[#FFF4E6]",
        borderColor: "border-[#FFB800]",
      };
    case "REVISION":
      return {
        title: "Revision Required",
        subtitle: revisionNote || "Please update your application and resubmit.",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-400",
      };
    case "RESUBMITTED":
      return {
        title: "Your revised application has been submitted!",
        subtitle: "We are reviewing your updated documents. You will be notified once the next step is unlocked.",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-400",
      };
    case "SELECTED_FOR_INTERVIEW":
      return {
        title: "Congratulations! You have been selected for an interview.",
        subtitle: "Please select an available interview slot below.",
        bgColor: "bg-green-50",
        borderColor: "border-green-500",
      };
    case "APPROVED":
      return {
        title: "You have been approved as a tutor on our platform.",
        subtitle: "Please complete the profile setup to start teaching.",
        bgColor: "bg-[#FFF9E6]",
        borderColor: "border-l-4 border-l-[#FFB800] border-t-0 border-r-0 border-b-0",
      };
    case "REJECTED":
      return {
        title: "Application Not Approved",
        subtitle: rejectionReason || "We appreciate your interest. Feel free to apply again in the future.",
        bgColor: "bg-red-50",
        borderColor: "border-red-400",
      };
    default:
      return {
        title: "Application Status Unknown",
        subtitle: "Please contact support for assistance.",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-300",
      };
  }
};

const Page1 = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: application, isLoading, error } = useMyApplication();
  const { refetchStatus } = useStripeConnect();
  const { mutate: updateApplication, isPending: isUpdating } = useUpdateMyApplication();
  const { data: bookedInterview } = useMyBookedInterview();
  const [progressWidth, setProgressWidth] = useState("8%");
  const stripeToastShownRef = useRef(false);

  // Check if interview is already booked
  const hasBookedInterview = !!bookedInterview;

  // State for editing documents
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<{
    cv?: File;
    abiturCertificate?: File;
    officialId?: File;
  }>({});

  // Refs for file inputs
  const cvInputRef = useRef<HTMLInputElement>(null);
  const abiturInputRef = useRef<HTMLInputElement>(null);
  const officialIdInputRef = useRef<HTMLInputElement>(null);

  const step = application ? getStepFromStatus(application.status) : 1;

  const handleFileSelect = (type: 'cv' | 'abiturCertificate' | 'officialId', file: File | null) => {
    if (file) {
      setSelectedFiles(prev => ({ ...prev, [type]: file }));
    }
  };

  const handleRemoveFile = (type: 'cv' | 'abiturCertificate' | 'officialId') => {
    setSelectedFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[type];
      return newFiles;
    });
  };

  const handleSubmitRevision = () => {
    if (Object.keys(selectedFiles).length === 0) {
      toast.error("Please select at least one document to update");
      return;
    }

    updateApplication(selectedFiles, {
      onSuccess: () => {
        toast.success("Your revision has been submitted successfully! We will review it shortly.");
        setIsEditing(false);
        setSelectedFiles({});
      },
      onError: (error: unknown) => {
        const err = error as { message?: string };
        toast.error(err?.message || "Failed to update application");
      },
    });
  };

  // Handle Stripe onboarding callback
  useEffect(() => {
    const stripeOnboarding = searchParams.get("stripe_onboarding");

    // Prevent duplicate toasts
    if (stripeToastShownRef.current) return;

    if (stripeOnboarding === "success") {
      stripeToastShownRef.current = true;
      toast.success("Stripe account connected successfully!");
      refetchStatus();
      // Clean URL by removing query params
      router.replace("/free-trial-teacher-dash", { scroll: false });
    } else if (stripeOnboarding === "refresh") {
      stripeToastShownRef.current = true;
      toast.info("Please complete your Stripe onboarding to continue.");
      router.replace("/free-trial-teacher-dash", { scroll: false });
    }
  }, [searchParams, refetchStatus, router]);

  // Calculate progress width based on step and screen size
  useEffect(() => {
    const calculateWidth = () => {
      const isMobile = window.innerWidth <= 640;
      const isTablet = window.innerWidth <= 768;

      if (isMobile) {
        setProgressWidth(step === 1 ? "15%" : step === 2 ? "55%" : step >= 3 ? "95%" : "0%");
      } else if (isTablet) {
        setProgressWidth(step === 1 ? "12%" : step === 2 ? "52%" : step >= 3 ? "92%" : "0%");
      } else {
        setProgressWidth(step === 1 ? "8%" : step === 2 ? "55%" : step >= 3 ? "95%" : "0%");
      }
    };

    calculateWidth();
    window.addEventListener("resize", calculateWidth);
    return () => window.removeEventListener("resize", calculateWidth);
  }, [step]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-[#0B31BD]" />
          <p className="text-gray-600">Loading your application...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center px-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-800">Application Not Found</h2>
          <p className="text-gray-600">
            We couldn&apos;t find your application. Please make sure you&apos;re logged in with the correct account.
          </p>
        </div>
      </div>
    );
  }

  const statusMessage = getStatusMessage(
    application.status,
    application.revisionNote,
    application.rejectionReason
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-3xl mx-auto py-12 px-4">
        {/* Application Card */}
        <div className="rounded-lg shadow-sm border border-gray-200 p-6 mb-6 bg-white">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            Teacher Application Progress
          </h2>

          {/* Progress Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-2.5 left-0 right-0 h-2 rounded-3xl bg-gray-300 z-0"></div>

              <div
                className="absolute top-2.5 left-0 h-2 rounded-3xl bg-[#0B31BD] z-10 transition-all duration-700 ease-in-out"
                style={{ width: progressWidth }}
              ></div>

              {/* Step 1 - Application Review */}
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold mb-2 transition-all duration-500 ${
                    step >= 1 ? "bg-[#0B31BD]" : "bg-gray-300"
                  }`}
                >
                  {step > 1 ? <Check className="w-5 h-5" /> : ""}
                </div>
                <span
                  className={`text-sm text-center transition-colors duration-500 ${
                    step >= 1 ? "text-gray-700" : "text-gray-600"
                  }`}
                >
                  Application Review
                </span>
              </div>

              {/* Step 2 - Interview */}
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold mb-2 transition-all duration-500 ${
                    step >= 2 ? "bg-[#0B31BD]" : "bg-gray-300"
                  }`}
                >
                  {step > 2 ? <Check className="w-5 h-5" /> : ""}
                </div>
                <span
                  className={`text-sm text-center transition-colors duration-500 ${
                    step >= 2 ? "text-gray-700" : "text-gray-600"
                  }`}
                >
                  Interview
                </span>
              </div>

              {/* Step 3 - Profile Setup */}
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold mb-2 transition-all duration-500 ${
                    step >= 3 ? "bg-[#0B31BD]" : "bg-gray-300"
                  }`}
                >
                  {step > 3 ? <Check className="w-5 h-5" /> : ""}
                </div>
                <span
                  className={`text-sm text-center transition-colors duration-500 ${
                    step >= 3 ? "text-gray-700" : "text-gray-600"
                  }`}
                >
                  Profile Setup
                </span>
              </div>
            </div>
          </div>

          {/* Status Message */}
          {application.status === "SELECTED_FOR_INTERVIEW" && hasBookedInterview && bookedInterview?.status === "BOOKED" ? (
            // Show interview scheduled success message inside the progress card
            <div className="border-2 border-[#FFB800] bg-[#FFF9E6] rounded-lg p-4 flex items-start gap-3">
              <Check className="w-5 h-5 text-[#FFB800] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-800">
                  Your interview appointment has been scheduled successfully.
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  You will receive an E-Mail with the meeting link.
                </p>
              </div>
            </div>
          ) : application.status === "SELECTED_FOR_INTERVIEW" && hasBookedInterview && bookedInterview?.status === "COMPLETED" ? (
            // Show interview completed success message inside the progress card
            <div className="border-2 border-green-500 bg-green-50 rounded-lg p-4 flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-800">
                  Your interview has been completed successfully.
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Please wait for the admin to review and approve your application.
                </p>
              </div>
            </div>
          ) : application.status === "SELECTED_FOR_INTERVIEW" && !hasBookedInterview && application.interviewCancelledReason ? (
            // Show interview cancelled by admin message with reason
            <div className="border-2 border-orange-400 bg-orange-50 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-800">
                  Your interview has been cancelled by the admin.
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Reason:</span> {application.interviewCancelledReason}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Please select a new interview slot below to reschedule.
                </p>
              </div>
            </div>
          ) : application.status === "REJECTED" ? (
            <div className={`border ${statusMessage.borderColor} ${statusMessage.bgColor} rounded-lg p-4 flex items-start gap-3`}>
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-800">{statusMessage.title}</p>
                <p className="text-sm text-gray-600 mt-1">{statusMessage.subtitle}</p>
              </div>
            </div>
          ) : (
            <div className={`border ${statusMessage.borderColor} ${statusMessage.bgColor} rounded-lg p-4`}>
              <p className="font-semibold text-gray-800">{statusMessage.title}</p>
              <p className="text-sm text-gray-600 mt-1">{statusMessage.subtitle}</p>
            </div>
          )}
        </div>

        {/* Interview Booking Section - Only show when selected for interview */}
        {application.status === "SELECTED_FOR_INTERVIEW" && (
          <div className="mb-6">
            <InterviewBookingSection applicationId={application._id} />
          </div>
        )}

        {/* Profile Setup Section - Only show when approved */}
        {application.status === "APPROVED" && (
          <div className="mb-6">
            <ProfileSetupSection
              userEmail={application.email}
            />
          </div>
        )}

        {/* Application Summary Card - Hide when SELECTED_FOR_INTERVIEW or APPROVED */}
        {application.status !== "SELECTED_FOR_INTERVIEW" && application.status !== "APPROVED" && (
          <div className="rounded-lg shadow-sm border border-gray-200 p-6 mb-6 bg-white">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Application Summary
            </h3>

            <div className="space-y-6">
              {/* Name */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Name</p>
                <p className="text-gray-800 font-medium">{application.name}</p>
              </div>

              {/* Subjects */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Subjects</p>
                <p className="text-gray-800 font-medium">
                  {application.subjects.map((s) => s.name).join(", ") || "No subjects selected"}
                </p>
              </div>

              {/* Email and Phone */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">E-Mail</p>
                  <p className="text-gray-800 font-medium">{application.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <p className="text-gray-800 font-medium">{application.phoneNumber}</p>
                </div>
              </div>

              {/* Documents Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-600 font-semibold">Documents</p>
                  {application.status === "REVISION" && !isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-sm text-[#0B31BD] hover:underline font-medium"
                    >
                      Edit Documents
                    </button>
                  )}
                  {isEditing && (
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setSelectedFiles({});
                      }}
                      className="text-sm text-gray-500 hover:underline"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {/* Hidden file inputs */}
                <input
                  type="file"
                  ref={cvInputRef}
                  className="hidden"
                  accept=".pdf,.doc,.docx,image/*"
                  onChange={(e) => handleFileSelect('cv', e.target.files?.[0] || null)}
                />
                <input
                  type="file"
                  ref={abiturInputRef}
                  className="hidden"
                  accept=".pdf,.doc,.docx,image/*"
                  onChange={(e) => handleFileSelect('abiturCertificate', e.target.files?.[0] || null)}
                />
                <input
                  type="file"
                  ref={officialIdInputRef}
                  className="hidden"
                  accept=".pdf,.doc,.docx,image/*"
                  onChange={(e) => handleFileSelect('officialId', e.target.files?.[0] || null)}
                />

                <div className="grid grid-cols-3 gap-4">
                  {/* CV */}
                  {isEditing ? (
                    <div
                      onClick={() => cvInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                        selectedFiles.cv
                          ? "border-green-400 bg-green-50"
                          : "border-gray-300 bg-gray-50 hover:border-[#0B31BD] hover:bg-blue-50"
                      }`}
                    >
                      {selectedFiles.cv ? (
                        <>
                          <div className="relative w-full">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFile('cv');
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            <Check className="w-8 h-8 text-green-500 mb-2 mx-auto" />
                          </div>
                          <p className="text-xs text-gray-600 text-center truncate w-full">
                            {selectedFiles.cv.name}
                          </p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mb-3" />
                          <p className="text-sm font-medium text-gray-700">CV</p>
                          <p className="text-xs text-gray-500 mt-1">Click to upload</p>
                        </>
                      )}
                    </div>
                  ) : (
                    <a
                      href={application.cv}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <FileText className="w-8 h-8 text-gray-400 mb-3" />
                      <p className="text-sm font-medium text-gray-700">CV</p>
                    </a>
                  )}

                  {/* Abitur Certificate */}
                  {isEditing ? (
                    <div
                      onClick={() => abiturInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                        selectedFiles.abiturCertificate
                          ? "border-green-400 bg-green-50"
                          : "border-gray-300 bg-gray-50 hover:border-[#0B31BD] hover:bg-blue-50"
                      }`}
                    >
                      {selectedFiles.abiturCertificate ? (
                        <>
                          <div className="relative w-full">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFile('abiturCertificate');
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            <Check className="w-8 h-8 text-green-500 mb-2 mx-auto" />
                          </div>
                          <p className="text-xs text-gray-600 text-center truncate w-full">
                            {selectedFiles.abiturCertificate.name}
                          </p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mb-3" />
                          <p className="text-sm font-medium text-gray-700">Abitur Certificate</p>
                          <p className="text-xs text-gray-500 mt-1">Click to upload</p>
                        </>
                      )}
                    </div>
                  ) : (
                    <a
                      href={application.abiturCertificate}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <FileText className="w-8 h-8 text-gray-400 mb-3" />
                      <p className="text-sm font-medium text-gray-700">Abitur Certificate</p>
                    </a>
                  )}

                  {/* ID Document */}
                  {isEditing ? (
                    <div
                      onClick={() => officialIdInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                        selectedFiles.officialId
                          ? "border-green-400 bg-green-50"
                          : "border-gray-300 bg-gray-50 hover:border-[#0B31BD] hover:bg-blue-50"
                      }`}
                    >
                      {selectedFiles.officialId ? (
                        <>
                          <div className="relative w-full">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFile('officialId');
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            <Check className="w-8 h-8 text-green-500 mb-2 mx-auto" />
                          </div>
                          <p className="text-xs text-gray-600 text-center truncate w-full">
                            {selectedFiles.officialId.name}
                          </p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mb-3" />
                          <p className="text-sm font-medium text-gray-700">ID-Document</p>
                          <p className="text-xs text-gray-500 mt-1">Click to upload</p>
                        </>
                      )}
                    </div>
                  ) : (
                    <a
                      href={application.officialId}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <FileText className="w-8 h-8 text-gray-400 mb-3" />
                      <p className="text-sm font-medium text-gray-700">ID-Document</p>
                    </a>
                  )}
                </div>

                {/* Submit button when editing */}
                {isEditing && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleSubmitRevision}
                      disabled={isUpdating || Object.keys(selectedFiles).length === 0}
                      className="bg-[#0B31BD] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#0929a0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Resubmit Application"
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Info Message - Hide when APPROVED */}
        {application.status !== "APPROVED" && (
          <div className="border bg-[#E2E6F5] border-[#0B31BD] rounded-lg p-4">
            <p className="text-[#0B31BD] text-sm">
              You can return to this page at any time to check the progress of
              your application by login.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page1;
