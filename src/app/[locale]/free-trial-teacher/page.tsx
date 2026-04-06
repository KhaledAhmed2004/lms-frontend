"use client";
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useSubmitApplication,
  useMyApplication,
} from "@/hooks/api";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import { ProgressBar } from "@/components/form/ProgressBar";
import { SubjectSelectionStep } from "./components/SubjectSelectionStep";
import { DocumentUploadStep } from "./components/DocumentUploadStep";
import { PersonalInfoStep } from "./components/PersonalInfoStep";

interface FormData {
  subjects: string[];
  cv: File | null;
  abiturCertificate: File | null;
  officialId: File | null;
  firstName: string;
  lastName: string;
  birthDate: Date | undefined;
  street: string;
  houseNumber: string;
  zip: string;
  city: string;
  phoneNumber: string;
  email: string;
  password: string;
  repeatPassword: string;
  agreeToPolicy: boolean;
}

interface SelectedSubject {
  id: string;
  name: string;
}

const FreeTrialTeacher = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [step, setStep] = useState<number>(1);
  const [selectedSubjects, setSelectedSubjects] = useState<SelectedSubject[]>(
    [],
  );

  // Check if user already has an application (only for APPLICANT role)
  const shouldCheckApplication = isAuthenticated && user?.role === "APPLICANT";
  const { data: existingApplication, isLoading: isCheckingApplication } =
    useMyApplication({
      enabled: shouldCheckApplication,
    });

  // Browser back button → previous step instead of leaving page
  useEffect(() => {
    window.history.replaceState({ step: 1 }, "");

    const handlePopState = () => {
      setStep((prev) => (prev > 1 ? prev - 1 : prev));
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Redirect existing tutors/applicants
  useEffect(() => {
    if (isAuthenticated && user?.role === "TUTOR") {
      router.replace("/teacher/session");
      return;
    }

    if (isAuthenticated && user?.role === "APPLICANT" && existingApplication) {
      router.replace("/free-trial-teacher-dash");
      return;
    }
  }, [isAuthenticated, user, existingApplication, router]);

  const [formData, setFormData] = useState<FormData>({
    subjects: [],
    cv: null,
    abiturCertificate: null,
    officialId: null,
    firstName: "",
    lastName: "",
    birthDate: undefined,
    street: "",
    houseNumber: "",
    zip: "",
    city: "",
    phoneNumber: "",
    email: "",
    password: "",
    repeatPassword: "",
    agreeToPolicy: false,
  });

  const { mutate: submitApplication, isPending } = useSubmitApplication();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: "cv" | "abiturCertificate" | "officialId",
  ) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]:
        e.target.files && e.target.files[0] ? e.target.files[0] : null,
    }));
  };

  const validateStep1 = () => {
    if (selectedSubjects.length === 0) {
      toast.error("Please select at least one subject to teach.");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.cv || !formData.abiturCertificate || !formData.officialId) {
      toast.error("Please upload all required documents.");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.birthDate ||
      !formData.street ||
      !formData.houseNumber ||
      !formData.zip ||
      !formData.city ||
      !formData.phoneNumber ||
      !formData.email ||
      !formData.password ||
      !formData.repeatPassword
    ) {
      toast.error("Please fill in all required fields to continue.");
      return false;
    }

    if (formData.password !== formData.repeatPassword) {
      toast.error("Passwords do not match.");
      return false;
    }

    return true;
  };

  const isStepComplete = (): boolean => {
    if (step === 1) {
      return selectedSubjects.length > 0;
    }
    if (step === 2) {
      return !!(formData.cv && formData.abiturCertificate && formData.officialId);
    }
    if (step === 3) {
      return !!(
        formData.firstName &&
        formData.lastName &&
        formData.birthDate &&
        formData.street &&
        formData.houseNumber &&
        formData.zip &&
        formData.city &&
        formData.phoneNumber &&
        formData.email &&
        formData.password &&
        formData.repeatPassword &&
        formData.password === formData.repeatPassword &&
        formData.agreeToPolicy
      );
    }
    return true;
  };

  const stepComplete = isStepComplete();

  const handleNextStep = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    window.history.pushState({ step: step + 1 }, "");
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = () => {
    if (!validateStep3()) return;

    if (!formData.agreeToPolicy) {
      toast.warning("Please agree to the Privacy Policy to continue.");
      return;
    }

    const applicationData = {
      email: formData.email,
      password: formData.password,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      birthDate: formData.birthDate!.toISOString(),
      phoneNumber: formData.phoneNumber,
      street: formData.street,
      houseNumber: formData.houseNumber,
      zip: formData.zip,
      city: formData.city,
      subjects: selectedSubjects.map((s) => s.id),
      cv: formData.cv!,
      abiturCertificate: formData.abiturCertificate!,
      officialId: formData.officialId!,
    };

    submitApplication(applicationData, {
      onSuccess: () => {
        toast.success(
          "Your teacher application has been sent. We will get back to you shortly!",
        );
        router.push("/free-trial-teacher-dash");
      },
      onError: (error: unknown) => {
        const err = error as { getFullMessage?: () => string; message?: string };
        const message =
          err?.getFullMessage?.() ||
          err?.message ||
          "Something went wrong. Please try again.";
        toast.error(message);
      },
    });
  };

  // Show loading while checking for existing application
  if (
    isAuthenticated &&
    (user?.role === "TUTOR" || user?.role === "APPLICANT") &&
    isCheckingApplication
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-[#0B31BD]" />
          <p className="text-gray-600">Checking your application status...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen -mb-20">
        {/* Navbar */}
        <nav className="bg-[#FBFCFC] h-20 shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="flex items-center justify-center w-full">
              <Link href="/" className="text-3xl font-bold text-[#0B31BD]">
                Schäfer Tutoring
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="min-h-[calc(100vh-64px)] flex justify-center py-12 px-4">
          <div className="w-full max-w-2xl">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Teacher Application (Step {step}/3)
              </h2>

              <ProgressBar step={step} totalSteps={3} />

              <div>
                {step === 1 && (
                  <SubjectSelectionStep
                    selectedSubjects={selectedSubjects}
                    setSelectedSubjects={setSelectedSubjects}
                    stepComplete={stepComplete}
                    onNext={handleNextStep}
                  />
                )}

                {step === 2 && (
                  <DocumentUploadStep
                    formData={formData}
                    onFileChange={handleFileChange}
                    stepComplete={stepComplete}
                    onNext={handleNextStep}
                    onBack={handlePrevStep}
                  />
                )}

                {step === 3 && (
                  <PersonalInfoStep
                    formData={formData}
                    setFormData={setFormData}
                    handleInputChange={handleInputChange}
                    stepComplete={stepComplete}
                    isPending={isPending}
                    onBack={handlePrevStep}
                    onSubmit={handleSubmit}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FreeTrialTeacher;
