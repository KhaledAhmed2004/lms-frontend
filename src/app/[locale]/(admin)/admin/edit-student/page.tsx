'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useStudent, useAdminUpdateStudentProfile } from '@/hooks/api';

const StudentEditContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id') || '';

  // Fetch student details
  const { data: student, isLoading, error } = useStudent(id);
  const { mutate: updateStudent, isPending: isUpdating } = useAdminUpdateStudentProfile();

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [location, setLocation] = useState('');

  // Initialize form with student data
  useEffect(() => {
    if (student) {
      setFullName(student.name || '');
      setEmail(student.email || '');
      setPhone(student.phone || '');
      setDateOfBirth(student.dateOfBirth || '');
      setLocation(student.location || '');
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
          toast.success('Student profile updated successfully');
          router.push(`/admin/student-details?id=${id}`);
        },
        onError: (error: any) => {
          toast.error(error?.message || 'Failed to update student profile');
        },
      }
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
        <p className="text-red-500">Student not found or error loading details.</p>
        <Button variant="outline" onClick={() => router.push('/admin/student')}>
          <ArrowLeft className="mr-2" size={16} />
          Back to Students
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.push(`/admin/student-details?id=${id}`)}
          className="gap-2"
        >
          <ArrowLeft size={16} />
          Back
        </Button>
        <h1 className="text-xl font-bold text-gray-700">
          Edit Student: {student.name}
        </h1>
      </div>

      {/* Personal Information Section */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Full Name and Email */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Full Name
              </label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-0"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Email
              </label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-0"
              />
            </div>
          </div>

          {/* Phone and Date of Birth */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Phone
              </label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-0"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Date of Birth
              </label>
              <Input
                type="date"
                value={dateOfBirth ? dateOfBirth.split('T')[0] : ''}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-0"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Location
            </label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-0"
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={handleSave}
          disabled={isUpdating}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8"
        >
          {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push(`/admin/student-details?id=${id}`)}
          className="px-8"
        >
          Cancel
        </Button>
      </div>
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
