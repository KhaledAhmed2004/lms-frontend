"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useActiveSubjects,
  useAdminUpdateTutorProfile,
  useTutor,
} from "@/hooks/api";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import EditTutorActions from "./EditTutorActions";
import EditTutorFilesSection from "./EditTutorFilesSection";
import EditTutorHeader from "./EditTutorHeader";
import EditTutorPersonalForm from "./EditTutorPersonalForm";
import EditTutorSubjectsSection, {
  SubjectItem,
} from "./EditTutorSubjectsSection";

const TutorEditContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id") || "";

  // Fetch tutor details
  const { data: tutor, isLoading, error } = useTutor(id);
  const { data: availableSubjects } = useActiveSubjects();
  const { mutate: updateTutor, isPending: isUpdating } =
    useAdminUpdateTutorProfile();

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectItem[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  // Initialize form with tutor data
  useEffect(() => {
    if (tutor) {
      setFullName(tutor.name || "");
      setEmail(tutor.email || "");
      setPhone(tutor.phone || "");
      setBirthDate(tutor.tutorProfile?.birthDate || tutor.dateOfBirth || "");
      setAddress(tutor.tutorProfile?.address || tutor.location || "");
      setSelectedSubjects(tutor.tutorProfile?.subjects || []);
    }
  }, [tutor]);

  // Get subjects that are not yet selected
  const unselectedSubjects =
    availableSubjects?.filter(
      (sub) => !selectedSubjects.some((sel) => sel._id === sub._id),
    ) || [];

  const handleAddSubject = () => {
    if (selectedSubjectId) {
      const subjectToAdd = availableSubjects?.find(
        (s) => s._id === selectedSubjectId,
      );
      if (
        subjectToAdd &&
        !selectedSubjects.some((s) => s._id === subjectToAdd._id)
      ) {
        setSelectedSubjects([
          ...selectedSubjects,
          { _id: subjectToAdd._id, name: subjectToAdd.name },
        ]);
        setSelectedSubjectId("");
      }
    }
  };

  const handleRemoveSubject = (subjectId: string) => {
    setSelectedSubjects(selectedSubjects.filter((s) => s._id !== subjectId));
  };

  const handleSave = () => {
    updateTutor(
      {
        tutorId: id,
        payload: {
          name: fullName,
          email: email,
          phone: phone || undefined,
          tutorProfile: {
            birthDate: birthDate || undefined,
            address: address || undefined,
            subjects: selectedSubjects.map((s) => s._id),
          },
        },
      },
      {
        onSuccess: () => {
          toast.success("Tutor profile updated successfully");
          router.push(`/admin/tutor-details?id=${id}`);
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to update tutor profile");
        },
      },
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-6 w-48" />
        </div>
        <Card className="border-gray-200">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="grid grid-cols-2 gap-6">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error || !tutor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-red-500">
          Tutor not found or error loading details.
        </p>
        <Button variant="outline" onClick={() => router.push("/admin/tutor")}>
          <ArrowLeft className="mr-2" size={16} />
          Back to Tutors
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EditTutorHeader
        tutorName={tutor.name}
        onBack={() => router.push(`/admin/tutor-details?id=${id}`)}
      />

      <EditTutorPersonalForm
        fullName={fullName}
        email={email}
        phone={phone}
        birthDate={birthDate}
        address={address}
        onFullNameChange={setFullName}
        onEmailChange={setEmail}
        onPhoneChange={setPhone}
        onBirthDateChange={setBirthDate}
        onAddressChange={setAddress}
      />

      <EditTutorSubjectsSection
        selectedSubjects={selectedSubjects}
        unselectedSubjects={unselectedSubjects}
        selectedSubjectId={selectedSubjectId}
        onSelectSubject={setSelectedSubjectId}
        onAddSubject={handleAddSubject}
        onRemoveSubject={handleRemoveSubject}
      />

      <EditTutorFilesSection
        cvUrl={tutor.tutorProfile?.cvUrl}
        abiturCertificateUrl={tutor.tutorProfile?.abiturCertificateUrl}
      />

      <EditTutorActions
        isUpdating={isUpdating}
        onSave={handleSave}
        onCancel={() => router.push(`/admin/tutor-details?id=${id}`)}
      />
    </div>
  );
};

export default function TutorEditPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <TutorEditContent />
    </Suspense>
  );
}
