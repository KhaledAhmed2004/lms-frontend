"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminUpdateStudentProfile, useStudent } from "@/hooks/api";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import EditStudentActions from "./EditStudentActions";
import EditStudentForm from "./EditStudentForm";
import EditStudentHeader from "./EditStudentHeader";

const StudentEditContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id") || "";

  // Fetch student details
  const { data: student, isLoading, error } = useStudent(id);
  const { mutate: updateStudent, isPending: isUpdating } =
    useAdminUpdateStudentProfile();

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [location, setLocation] = useState("");

  // Initialize form with student data
  useEffect(() => {
    if (student) {
      setFullName(student.name || "");
      setEmail(student.email || "");
      setPhone(student.phone || "");
      setDateOfBirth(student.dateOfBirth || "");
      setLocation(student.location || "");
    }
  }, [student]);

  const handleSave = () => {
    updateStudent(
      {
        studentId: id,
        payload: {
          name: fullName,
          email: email,
          phone: phone || undefined,
          dateOfBirth: dateOfBirth || undefined,
          location: location || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Student profile updated successfully");
          router.push(`/admin/student-details?id=${id}`);
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to update student profile");
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
  if (error || !student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-red-500">
          Student not found or error loading details.
        </p>
        <Button variant="outline" onClick={() => router.push("/admin/student")}>
          <ArrowLeft className="mr-2" size={16} />
          Back to Students
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EditStudentHeader
        studentName={student.name}
        onBack={() => router.push(`/admin/student-details?id=${id}`)}
      />
      <EditStudentForm
        fullName={fullName}
        email={email}
        phone={phone}
        dateOfBirth={dateOfBirth}
        location={location}
        onFullNameChange={setFullName}
        onEmailChange={setEmail}
        onPhoneChange={setPhone}
        onDateOfBirthChange={setDateOfBirth}
        onLocationChange={setLocation}
      />
      <EditStudentActions
        isUpdating={isUpdating}
        onSave={handleSave}
        onCancel={() => router.push(`/admin/student-details?id=${id}`)}
      />
    </div>
  );
};

export default function StudentEditPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <StudentEditContent />
    </Suspense>
  );
}
