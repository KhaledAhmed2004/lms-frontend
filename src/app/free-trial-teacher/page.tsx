/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { Upload, X, Loader2, CalendarIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSubmitApplication, useActiveSubjects, useMyApplication } from "@/hooks/api";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
  const [selectedSubjects, setSelectedSubjects] = useState<SelectedSubject[]>([]);
  const [showSubjectDropdown, setShowSubjectDropdown] =
    useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Check if user already has an application (only for APPLICANT role)
  // Only fetch if user is authenticated AND has APPLICANT role
  const shouldCheckApplication = isAuthenticated && user?.role === "APPLICANT";
  const { data: existingApplication, isLoading: isCheckingApplication } = useMyApplication({
    enabled: shouldCheckApplication,
  });

  // Redirect existing tutors/applicants
  useEffect(() => {
    // If user is already a TUTOR, redirect to teacher dashboard
    if (isAuthenticated && user?.role === "TUTOR") {
      router.replace("/teacher/dashboard");
      return;
    }

    // If user is APPLICANT and already has an application, redirect to application dashboard
    if (isAuthenticated && user?.role === "APPLICANT" && existingApplication) {
      router.replace("/free-trial-teacher-dash");
      return;
    }
  }, [isAuthenticated, user, existingApplication, router]);

  // Fetch subjects from API
  const { data: availableSubjects = [], isLoading: subjectsLoading } = useActiveSubjects();

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
    fieldName: "cv" | "abiturCertificate" | "officialId"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]:
        e.target.files && e.target.files[0] ? e.target.files[0] : null,
    }));
  };

  const handleSubjectToggle = (subjectId: string, subjectName: string) => {
    setSelectedSubjects((prev) => {
      const exists = prev.find((s) => s.id === subjectId);
      if (exists) {
        return prev.filter((s) => s.id !== subjectId);
      } else {
        return [...prev, { id: subjectId, name: subjectName }];
      }
    });
  };

  const handleRemoveSubject = (subjectId: string) => {
    setSelectedSubjects((prev) => prev.filter((s) => s.id !== subjectId));
  };

  const isSubjectSelected = (subjectId: string) => {
    return selectedSubjects.some((s) => s.id === subjectId);
  };

  const filteredSubjects = availableSubjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      !formData.password
    ) {
      toast.error("Please fill in all required fields to continue.");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && !validateStep1()) {
      return;
    }
    if (step === 2 && !validateStep2()) {
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = () => {
    if (!validateStep3()) {
      return;
    }

    if (!formData.agreeToPolicy) {
      toast.warning("Please agree to the Privacy Policy to continue.");
      return;
    }

    // Prepare data for API
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
      subjects: selectedSubjects.map((s) => s.id), // Send ObjectIds
      cv: formData.cv!,
      abiturCertificate: formData.abiturCertificate!,
      officialId: formData.officialId!,
    };

    submitApplication(applicationData, {
      onSuccess: () => {
        toast.success(
          "Your teacher application has been sent. We will get back to you shortly!"
        );
        router.push("/free-trial-teacher-dash");
      },
      onError: (error: any) => {
        // ApiError has getFullMessage() method for detailed errors
        const message = error?.getFullMessage?.() || error?.message || "Something went wrong. Please try again.";
        toast.error(message);
      },
    });
  };

  // Show loading while checking for existing application
  if (isAuthenticated && (user?.role === "TUTOR" || user?.role === "APPLICANT") && isCheckingApplication) {
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
        <nav className="bg-[#FBFCFC] h-20 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="flex items-center justify-center w-full">
              <h1 className="text-3xl font-bold text-[#0B31BD]">
                Schäfer Tutoring
              </h1>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="min-h-[calc(100vh-64px)] flex justify-center py-12 px-4">
          <div className="w-full max-w-2xl">
            {/* Form Container */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Teacher Application (Step {step}/3)
              </h2>

              {/* Progress Bar */}
              <div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#062183] transition-all duration-300"
                    style={{ width: `${(step / 3) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                {/* Step 1 - Subject Selection */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-base font-semibold text-[#0B31BD] mb-2">
                        What subjects you wanna teach?
                      </label>
                      <p className="text-sm text-gray-600 mb-3">
                        Select Subjects
                      </p>

                      {/* Selected Subjects Display */}
                      <div
                        className="flex h-auto min-h-[40px] w-full items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm cursor-pointer flex-wrap"
                        onClick={() =>
                          setShowSubjectDropdown(!showSubjectDropdown)
                        }
                      >
                        {selectedSubjects.length === 0 ? (
                          <span className="text-gray-400">Select subjects</span>
                        ) : (
                          selectedSubjects.map((subject) => (
                            <span
                              key={subject.id}
                              className="inline-flex items-center gap-1 bg-[#0B31BD] text-white px-2 py-1 rounded text-sm"
                            >
                              {subject.name}
                              <X
                                size={14}
                                className="cursor-pointer hover:text-gray-300"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveSubject(subject.id);
                                }}
                              />
                            </span>
                          ))
                        )}
                        <svg
                          className="ml-auto"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </div>

                      {/* Dropdown */}
                      {showSubjectDropdown && (
                        <div className="mt-2 border border-gray-300 rounded-md bg-white shadow-lg max-h-64 overflow-y-auto">
                          {/* Search Input */}
                          <div className="p-3 border-b border-gray-200">
                            <div className="flex items-center gap-2 px-3 border border-gray-300 rounded-md">
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                              </svg>
                              <Input
                                type="text"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="!border-none !shadow-none !outline-none !ring-0 !focus:ring-0 !focus:ring-offset-0 text-sm w-full"
                                style={{ boxShadow: "none" }}
                              />
                            </div>
                          </div>

                          {/* Subject List */}
                          <div className="p-2">
                            {subjectsLoading ? (
                              <div className="flex items-center justify-center py-4">
                                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                              </div>
                            ) : filteredSubjects.length === 0 ? (
                              <div className="text-center py-4 text-gray-500 text-sm">
                                No subjects found
                              </div>
                            ) : (
                              filteredSubjects.map((subject) => (
                                <div
                                  key={subject._id}
                                  className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer rounded"
                                  onClick={() => handleSubjectToggle(subject._id, subject.name)}
                                >
                                  <span className="text-sm text-gray-700">
                                    {subject.name}
                                  </span>
                                  <Checkbox
                                    checked={isSubjectSelected(subject._id)}
                                    onCheckedChange={() => handleSubjectToggle(subject._id, subject.name)}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={handlePrevStep}
                        disabled={step === 1}
                        className="w-full max-w-md mx-auto bg-gray-300 text-gray-700 py-3 rounded-md font-medium hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleNextStep}
                        className="w-full max-w-md mx-auto bg-[#0B31BD] text-white py-3 rounded-md font-medium hover:bg-[#062183] transition-colors flex items-center justify-center gap-2"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2 - Document Upload */}
                {step === 2 && (
                  <div className="space-y-6">
                    {/* CV Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CV <span className="text-red-500">*</span>
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors bg-white">
                        <input
                          type="file"
                          id="cv-upload"
                          onChange={(e) => handleFileChange(e, "cv")}
                          className="hidden"
                          accept=".png,.jpg,.jpeg,.pdf"
                        />
                        <label
                          htmlFor="cv-upload"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <div className="w-16 h-16 bg-[#D8E3FC] rounded-full flex items-center justify-center mb-4">
                            <Upload className="text-[#0B31BD]" size={32} />
                          </div>
                          <p className="text-gray-700 font-medium mb-1">
                            Drag & drop files here or click to browse
                          </p>
                          <p className="text-gray-500 text-sm">
                            png, jpg up to 10MB
                          </p>
                        </label>
                        {formData.cv && (
                          <p className="mt-4 text-sm text-green-600">
                            File selected: {formData.cv.name}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Abitur Certificate Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Abitur Certificate{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors bg-white">
                        <input
                          type="file"
                          id="abitur-upload"
                          onChange={(e) =>
                            handleFileChange(e, "abiturCertificate")
                          }
                          className="hidden"
                          accept=".png,.jpg,.jpeg,.pdf"
                        />
                        <label
                          htmlFor="abitur-upload"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <div className="w-16 h-16 bg-[#D8E3FC] rounded-full flex items-center justify-center mb-4">
                            <Upload className="text-[#0B31BD]" size={32} />
                          </div>
                          <p className="text-gray-700 font-medium mb-1">
                            Drag & drop files here or click to browse
                          </p>
                          <p className="text-gray-500 text-sm">
                            png, jpg up to 10MB
                          </p>
                        </label>
                        {formData.abiturCertificate && (
                          <p className="mt-4 text-sm text-green-600">
                            File selected: {formData.abiturCertificate.name}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Official ID Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Official ID-Document{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors bg-white">
                        <input
                          type="file"
                          id="id-upload"
                          onChange={(e) => handleFileChange(e, "officialId")}
                          className="hidden"
                          accept=".png,.jpg,.jpeg,.pdf"
                        />
                        <label
                          htmlFor="id-upload"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <div className="w-16 h-16 bg-[#D8E3FC] rounded-full flex items-center justify-center mb-4">
                            <Upload className="text-[#0B31BD]" size={32} />
                          </div>
                          <p className="text-gray-700 font-medium mb-1">
                            Drag & drop files here or click to browse
                          </p>
                          <p className="text-gray-500 text-sm">
                            png, jpg up to 10MB
                          </p>
                        </label>
                        {formData.officialId && (
                          <p className="mt-4 text-sm text-green-600">
                            File selected: {formData.officialId.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={handlePrevStep}
                        className="w-full max-w-md mx-auto bg-gray-300 text-gray-700 py-3 rounded-md font-medium hover:bg-gray-400 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleNextStep}
                        className="w-full max-w-md mx-auto bg-[#0B31BD] text-white py-3 rounded-md font-medium hover:bg-[#062183] transition-colors flex items-center justify-center gap-2"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3 - Personal Information */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="Enter your first name"
                          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Enter your last name"
                          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Birth Date <span className="text-red-500">*</span>
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "flex h-10 w-full justify-start rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-normal hover:bg-white",
                              !formData.birthDate && "text-gray-400"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.birthDate ? (
                              format(formData.birthDate, "dd-MM-yyyy")
                            ) : (
                              <span>Select your birth date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.birthDate}
                            onSelect={(date) =>
                              setFormData((prev) => ({ ...prev, birthDate: date }))
                            }
                            disabled={(date) =>
                              date > new Date() || date < new Date("1950-01-01")
                            }
                            captionLayout="dropdown"
                            fromYear={1950}
                            toYear={new Date().getFullYear()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Street <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          name="street"
                          value={formData.street}
                          onChange={handleInputChange}
                          placeholder="Enter street name"
                          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          House Number <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          name="houseNumber"
                          value={formData.houseNumber}
                          onChange={handleInputChange}
                          placeholder="Enter house number"
                          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          name="zip"
                          value={formData.zip}
                          onChange={handleInputChange}
                          placeholder="Enter ZIP"
                          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="Enter your city"
                          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your Password"
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="flex items-start">
                      <Checkbox
                        name="agreeToPolicy"
                        checked={formData.agreeToPolicy}
                        onCheckedChange={(value) =>
                          setFormData({
                            ...formData,
                            agreeToPolicy: Boolean(value),
                          })
                        }
                      />
                      <label className="ml-2 text-sm text-gray-700">
                        I have read and agree to the{" "}
                        <Link
                          href="/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          Privacy Policy
                        </Link>
                      </label>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={handlePrevStep}
                        disabled={isPending}
                        className="w-full max-w-md mx-auto bg-gray-300 text-gray-700 py-3 rounded-md font-medium hover:bg-gray-400 transition-colors disabled:opacity-50"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="w-full max-w-md mx-auto bg-[#0B31BD] text-white py-3 rounded-md font-medium hover:bg-[#062183] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isPending ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Send the request"
                        )}
                      </button>
                    </div>
                  </div>
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