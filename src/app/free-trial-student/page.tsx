
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import Link from "next/link";
import { ProgressBar } from "./components/ProgressBar";
import { Step1SubjectInfo } from "./components/Step1SubjectInfo";
import { Step2GoalsDocuments } from "./components/Step2GoalsDocuments";
import { Step3PersonalInfo } from "./components/Step3PersonalInfo";
import { FormNavigationButtons } from "./components/FormNavigationButtons";
import { useCreateTrialRequest, useActiveSubjects, type CreateTrialRequestData } from "@/hooks/api";

/* =========================
   Types
========================= */

interface FreeTrialFormData {
  subject: string;
  grade: string;
  schoolType: string;
  learningGoals: string;
  documents: File | null;

  studentFirstName: string;
  studentLastName: string;
  isUnder18: boolean;

  guardianFirstName: string;
  guardianLastName: string;
  guardianPhone: string;

  email: string;
  password: string;
  repeatPassword: string;
  agreeToPolicy: boolean;
}

/* =========================
   Component
========================= */

export default function FreeTrialStudentPage() {
  return (
    <Suspense>
      <FreeTrialStudent />
    </Suspense>
  );
}

function FreeTrialStudent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subjectFromUrl = searchParams.get("subject");
  const [step, setStep] = useState<number>(1);

  // Trial request mutation - isPending is synchronously true after mutate(), prevents double-submit
  const { mutate: createTrialRequest, isPending: isSubmitting } = useCreateTrialRequest();
  const { data: subjects = [] } = useActiveSubjects();

  const [formData, setFormData] = useState<FreeTrialFormData>({
    subject: "",
    grade: "",
    schoolType: "",
    learningGoals: "",
    documents: null,

    studentFirstName: "",
    studentLastName: "",
    isUnder18: false,

    guardianFirstName: "",
    guardianLastName: "",
    guardianPhone: "",

    email: "",
    password: "",
    repeatPassword: "",
    agreeToPolicy: false,
  });

  // Auto-fill subject from URL query param (landing page hero selection)
  useEffect(() => {
    if (subjectFromUrl && subjects.length > 0 && !formData.subject) {
      const match = subjects.find(
        (s) => s.name.toLowerCase() === subjectFromUrl.toLowerCase()
      );
      if (match) {
        setFormData((prev) => ({ ...prev, subject: match._id }));
      }
    }
  }, [subjectFromUrl, subjects]);

  /* =========================
     Helpers
  ========================= */

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData((prev) => ({
        ...prev,
        documents: e.target.files![0],
      }));
    }
  };



  /* =========================
     Validation
  ========================= */

  const validateStep1 = () => {
    if (!formData.subject || !formData.grade || !formData.schoolType) {
      toast.error("Please fill in all required fields.");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (
      !formData.studentFirstName ||
      !formData.studentLastName ||
      !formData.email ||
      !formData.password ||
      !formData.repeatPassword
    ) {
      toast.error("Please fill in all required personal information.");
      return false;
    }

    if (formData.password !== formData.repeatPassword) {
      toast.error("Passwords do not match.");
      return false;
    }

    if (
      formData.isUnder18 &&
      (!formData.guardianFirstName ||
        !formData.guardianLastName ||
        !formData.guardianPhone)
    ) {
      toast.error("Please fill in all guardian information.");
      return false;
    }

    return true;
  };

  /* =========================
     Step completeness check (for button disabled state)
  ========================= */

  const isStepComplete = (): boolean => {
    if (step === 1) {
      return !!(formData.subject && formData.grade && formData.schoolType);
    }
    if (step === 2) {
      return true; // step 2 has no required fields
    }
    if (step === 3) {
      const baseFields =
        !!formData.studentFirstName &&
        !!formData.studentLastName &&
        !!formData.email &&
        !!formData.password &&
        !!formData.repeatPassword &&
        formData.password === formData.repeatPassword &&
        formData.agreeToPolicy;

      if (formData.isUnder18) {
        return (
          baseFields &&
          !!formData.guardianFirstName &&
          !!formData.guardianLastName &&
          !!formData.guardianPhone
        );
      }
      return baseFields;
    }
    return true;
  };

  /* =========================
     Navigation
  ========================= */

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 3 && !validateStep3()) return;

    if (step === 3 && !formData.agreeToPolicy) {
      toast.warning("Please agree to the Privacy Policy.");
      return;
    }

    if (step === 3) {
      // Build the payload for the API
      const payload: CreateTrialRequestData = {
        studentInfo: {
          name: `${formData.studentFirstName} ${formData.studentLastName}`,
          isUnder18: formData.isUnder18,
          // If 18+, student has their own email/password
          ...(!formData.isUnder18 && {
            email: formData.email,
            password: formData.password,
          }),
          // If under 18, include guardian info
          ...(formData.isUnder18 && {
            guardianInfo: {
              name: `${formData.guardianFirstName} ${formData.guardianLastName}`,
              email: formData.email,
              password: formData.password,
              phone: formData.guardianPhone,
            },
          }),
        },
        subject: formData.subject,
        gradeLevel: formData.grade,
        schoolType: formData.schoolType,
        description:
          formData.learningGoals && formData.learningGoals.length >= 10
            ? formData.learningGoals
            : "Free trial session request",
        preferredLanguage: "GERMAN",
        ...(formData.documents ? { documents: [formData.documents] } : {}),
      };

      createTrialRequest(payload, {
        onSuccess: () => {
          toast.success("Your request has been sent successfully!");
          router.push("/free-trial-student-dash");
        },
        onError: (error: any) => {
          const message =
            error?.getFullMessage?.() ||
            error?.message ||
            "Failed to submit trial request. Please try again.";
          toast.error(message);
        },
      });
    } else {
      setStep((prev) => prev + 1);
    }
  };

  /* =========================
     JSX
  ========================= */

  return (
    <div className="min-h-screen">
        <nav className="bg-[#FBFCFC] h-20 shadow-sm flex items-center justify-center">
          <Link href="/" className="text-3xl font-bold text-[#0B31BD]">
            Schäfer Tutoring
          </Link>
        </nav>

        <div className="min-h-[calc(100vh-80px)] flex justify-center py-12 px-4">
          <div className="w-full max-w-2xl space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Free Trial Session (Step {step}/3)
            </h2>

            <ProgressBar step={step} totalSteps={3} />
             <label className="block text-base font-semibold text-[#0B31BD] mb-2">
              What do you want to learn?
            </label>
            {step === 1 && (
              <Step1SubjectInfo formData={formData} setFormData={setFormData} />
            )}

            {step === 2 && (
              <Step2GoalsDocuments
                formData={formData}
                setFormData={setFormData}
                handleFileChange={handleFileChange}
              />
            )}

            {step === 3 && (
              <Step3PersonalInfo
                formData={formData}
                setFormData={setFormData}
              />
            )}

            <FormNavigationButtons
              step={step}
              totalSteps={3}
              onNext={handleNext}
              onBack={handleBack}
              isLastStep={step === 3}
              isLoading={isSubmitting}
              isDisabled={!isStepComplete()}
            />
          </div>
        </div>
    </div>
  );
}
