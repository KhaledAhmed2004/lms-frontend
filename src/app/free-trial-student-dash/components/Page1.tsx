"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMyRequests, TRIAL_REQUEST_STATUS } from "@/hooks/api";
import { useTrialSession, SESSION_STATUS } from "@/hooks/api/use-sessions";
import { useAuthStore } from "@/store/auth-store";
import Page2 from "./Page2";
import Page3 from "./Page3";

const SCHOOL_TYPE_LABELS: Record<string, string> = {
  GRUNDSCHULE: "Grundschule",
  HAUPTSCHULE: "Hauptschule",
  REALSCHULE: "Realschule",
  GYMNASIUM: "Gymnasium",
  GESAMTSCHULE: "Gesamtschule",
  BERUFSSCHULE: "Berufsschule",
  UNIVERSITY: "University",
  OTHER: "Other",
};

const Page1 = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [progressWidth, setProgressWidth] = useState("0%");
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch trial requests (filtered by TRIAL type)
  const { data: requestsData, isLoading: isLoadingRequests } = useMyRequests({
    requestType: "TRIAL",
    limit: 1,
  });

  // Get the latest trial request
  const trialRequest = requestsData?.data?.[0];

  // Fetch trial session associated with this trial request
  const { data: trialSession, isLoading: isLoadingSession } = useTrialSession(
    trialRequest?._id
  );

  const isLoading = isLoadingRequests || isLoadingSession;

  // Determine step based on status
  const getStep = () => {
    if (!trialRequest) return 1;

    // If trial session is completed, show step 3
    if (trialSession?.status === SESSION_STATUS.COMPLETED) {
      return 3;
    }

    switch (trialRequest.status) {
      case TRIAL_REQUEST_STATUS.PENDING:
        return 1;
      case TRIAL_REQUEST_STATUS.ACCEPTED:
        return 2;
      default:
        return 1;
    }
  };

  const step = getStep();

  // Redirect to login if not authenticated (after hydration)
  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/login?redirect=/free-trial-student-dash");
    }
  }, [mounted, isAuthenticated, router]);

  useEffect(() => {
    const computeWidth = () => {
      const w = typeof window !== "undefined" ? window.innerWidth : 0;
      if (w <= 640) {
        return step === 1 ? "22%" : step === 2 ? "55%" : "88%";
      } else if (w <= 768) {
        return step === 1 ? "18%" : step === 2 ? "52%" : "86%";
      }
      return step === 1 ? "10%" : step === 2 ? "55%" : "95%";
    };
    const init = () => setProgressWidth(computeWidth());
    const timer = setTimeout(init, 0);

    const handleResize = () => setProgressWidth(computeWidth());
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [step]);

  // Loading state
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B31BD] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your request...</p>
        </div>
      </div>
    );
  }

  // No trial request found
  if (!trialRequest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            No Trial Request Found
          </h2>
          <p className="text-gray-600 mb-6">
            You haven&apos;t submitted a trial session request yet.
          </p>
          <button
            onClick={() => router.push("/free-trial-student")}
            className="bg-[#0B31BD] text-white px-6 py-3 rounded-lg hover:bg-[#062183] transition-colors"
          >
            Request Free Trial
          </button>
        </div>
      </div>
    );
  }

  // Show Page3 when trial session is completed
  if (trialSession?.status === SESSION_STATUS.COMPLETED) {
    return <Page3 />;
  }

  // Show Page2 with chat when request is accepted
  if (trialRequest.status === TRIAL_REQUEST_STATUS.ACCEPTED) {
    return <Page2 trialRequest={trialRequest} />;
  }

  // Status message based on request status
  const getStatusMessage = () => {
    switch (trialRequest.status) {
      case TRIAL_REQUEST_STATUS.PENDING:
        return {
          bg: "bg-[#FFF4E6]",
          border: "border-[#FF8A00]",
          title: "Your request has been sent and we are now looking for a fitting tutor.",
          subtitle: "You will be notified once we found your tutor",
        };
      case TRIAL_REQUEST_STATUS.ACCEPTED:
        return {
          bg: "bg-green-50",
          border: "border-green-500",
          title: "A tutor has accepted your request!",
          subtitle: "You can now chat with your tutor to schedule the trial session",
        };
      case TRIAL_REQUEST_STATUS.EXPIRED:
        return {
          bg: "bg-red-50",
          border: "border-red-500",
          title: "Your request has expired.",
          subtitle: "Please submit a new trial request",
        };
      case TRIAL_REQUEST_STATUS.CANCELLED:
        return {
          bg: "bg-gray-50",
          border: "border-gray-400",
          title: "Your request was cancelled.",
          subtitle: "You can submit a new trial request anytime",
        };
      default:
        return {
          bg: "bg-[#FFF4E6]",
          border: "border-[#FF8A00]",
          title: "Processing your request...",
          subtitle: "",
        };
    }
  };

  const statusMessage = getStatusMessage();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-3xl mx-auto py-12 px-4">
        {/* Trial Session Request Card */}
        <div className="rounded-lg shadow-sm border border-gray-200 p-6 mb-6 bg-white">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Trial Session Request
          </h2>

          {/* Progress Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-2.5 left-0 right-0 h-2 rounded-3xl bg-gray-300 z-0"></div>

              <div
                className="absolute top-2.5 left-0 h-2 rounded-3xl bg-[#0B31BD] z-10 transition-all duration-700 ease-in-out"
                style={{ width: progressWidth }}
              ></div>

              {/* Step 1 - Active if step >= 1 */}
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-semibold mb-2 transition-all duration-500 ${
                    step >= 1 ? "bg-[#0B31BD]" : "bg-gray-300"
                  }`}
                ></div>
                <span
                  className={`text-sm text-center transition-colors duration-500 ${
                    step >= 1 ? "text-gray-700" : "text-gray-600"
                  }`}
                >
                  Tutor Matching request
                </span>
              </div>

              {/* Step 2 - Active if step >= 2 */}
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-semibold mb-2 transition-all duration-500 ${
                    step >= 2 ? "bg-[#0B31BD]" : "bg-gray-300"
                  }`}
                ></div>
                <span
                  className={`text-sm text-center transition-colors duration-500 ${
                    step >= 2 ? "text-gray-700" : "text-gray-600"
                  }`}
                >
                  Trial Session
                </span>
              </div>

              {/* Step 3 - Active if step >= 3 */}
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-semibold mb-2 transition-all duration-500 ${
                    step >= 3 ? "bg-[#0B31BD]" : "bg-gray-300"
                  }`}
                ></div>
                <span
                  className={`text-sm text-center transition-colors duration-500 ${
                    step >= 3 ? "text-gray-700" : "text-gray-600"
                  }`}
                >
                  Start Learning
                </span>
              </div>
            </div>
          </div>

          {/* Status Message */}
          <div className={`border ${statusMessage.bg} ${statusMessage.border} rounded-lg p-4`}>
            <p className="font-normal">{statusMessage.title}</p>
            {statusMessage.subtitle && (
              <p className="text-sm text-[#666666]">{statusMessage.subtitle}</p>
            )}
          </div>
        </div>

        {/* Request Summary Card */}
        <div className="rounded-lg shadow-sm border border-gray-200 p-6 mb-6 bg-white">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Request Summary
          </h3>

          <div className="space-y-4">
            {/* Name and School Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Name</p>
                <p className="text-gray-800 font-medium">
                  {trialRequest.studentInfo?.name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">School Type</p>
                <p className="text-gray-800 font-medium">
                  {SCHOOL_TYPE_LABELS[trialRequest.schoolType] || trialRequest.schoolType}
                </p>
              </div>
            </div>

            {/* Subjects and Grade */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Subject</p>
                <p className="text-gray-800 font-medium">
                  {trialRequest.subject?.name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Grade</p>
                <p className="text-gray-800 font-medium">
                  {trialRequest.gradeLevel?.startsWith("SEMESTER_")
                    ? `Semester ${trialRequest.gradeLevel.replace("SEMESTER_", "").replace("_PLUS", "+")}`
                    : `Grade ${trialRequest.gradeLevel}`}
                </p>
              </div>
            </div>

            {/* Learning Goals */}
            <div>
              <p className="text-sm text-gray-600 mb-1">Learning goals</p>
              <p className="text-gray-800">
                {trialRequest.description || trialRequest.learningGoals || "N/A"}
              </p>
            </div>

            {/* Request Date */}
            <div>
              <p className="text-sm text-gray-600 mb-1">Submitted</p>
              <p className="text-gray-800">
                {new Date(trialRequest.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons for Accepted Status */}
        {trialRequest.status === TRIAL_REQUEST_STATUS.ACCEPTED && trialRequest.chatId && (
          <div className="mb-6">
            <button
              onClick={() => router.push(`/student/chat/${trialRequest.chatId}`)}
              className="w-full bg-[#0B31BD] text-white py-3 rounded-lg hover:bg-[#062183] transition-colors font-medium"
            >
              Chat with your Tutor
            </button>
          </div>
        )}

        {/* Info Message */}
        <div className="border bg-[#E2E6F5] border-[#0B31BD] rounded-lg p-4">
          <p className="text-[#0B31BD] text-sm">
            You can return to this page at any time to check the progress of
            your application by logging in.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page1;
