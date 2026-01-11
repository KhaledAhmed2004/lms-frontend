'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  useStudent,
  useBlockStudent,
  useUnblockStudent,
} from '@/hooks/api';

const StudentDetailsContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id') || '';

  // Fetch student details
  const { data: student, isLoading, error } = useStudent(id);

  // Mutations
  const { mutate: blockStudent, isPending: isBlocking } = useBlockStudent();
  const { mutate: unblockStudent, isPending: isUnblocking } = useUnblockStudent();

  const isActionPending = isBlocking || isUnblocking;

  // Handlers
  const handleBlock = () => {
    blockStudent(id, {
      onSuccess: () => {
        toast.success('Student blocked successfully');
      },
      onError: (error: any) => {
        toast.error(error?.getFullMessage?.() || error?.message || 'Failed to block student');
      },
    });
  };

  const handleUnblock = () => {
    unblockStudent(id, {
      onSuccess: () => {
        toast.success('Student unblocked successfully');
      },
      onError: (error: any) => {
        toast.error(error?.getFullMessage?.() || error?.message || 'Failed to unblock student');
      },
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    return status === 'ACTIVE'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  const getStatusLabel = (status: string) => {
    return status === 'ACTIVE' ? 'Active' : 'Blocked';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Card className="border-gray-200">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-5 w-40" />
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                {[1, 2].map((i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-5 w-40" />
                  </div>
                ))}
              </div>
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
      {/* Header with Back Button and Status */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push('/admin/student')}
          className="gap-2"
        >
          <ArrowLeft size={16} />
          Back
        </Button>
        <div className="flex items-center gap-3">
          <Badge className={`${getStatusColor(student.status)} border-0 text-sm px-3 py-1`}>
            {getStatusLabel(student.status)}
          </Badge>
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/edit-student?id=${id}`)}
            className="gap-2"
          >
            <Edit size={16} />
            Edit
          </Button>
        </div>
      </div>

      {/* Personal Information Section */}
      <Card className="border-gray-200">
        <CardHeader>
          <div>
            <h1 className="text-xl font-bold text-gray-700">
              Information of {student.name}
            </h1>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Full Name</p>
                <p className="text-gray-900 font-medium">{student.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Phone</p>
                <p className="text-gray-900 font-medium">{student.phone || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Location</p>
                <p className="text-gray-900 font-medium">
                  {student.location || '-'}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Email</p>
                <p className="text-gray-900 font-medium">{student.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Date of Birth</p>
                <p className="text-gray-900 font-medium">
                  {formatDate(student.dateOfBirth)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Member Since</p>
                <p className="text-gray-900 font-medium">{formatDate(student.createdAt)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Section */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
          <CardDescription>Student activity overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">
                {student.studentProfile?.trialRequestsCount || 0}
              </p>
              <p className="text-sm text-gray-600">Trial Requests</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">
                {student.studentProfile?.sessionRequestsCount || 0}
              </p>
              <p className="text-sm text-gray-600">Session Requests</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">
                {student.studentProfile?.hasCompletedTrial ? 'Yes' : 'No'}
              </p>
              <p className="text-sm text-gray-600">Completed Trial</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.push(`/admin/edit-student?id=${id}`)}
          className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8"
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
        {student.status === 'ACTIVE' ? (
          <Button
            onClick={handleBlock}
            disabled={isActionPending}
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-50 px-8"
          >
            {isBlocking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Block Student
          </Button>
        ) : (
          <Button
            onClick={handleUnblock}
            disabled={isActionPending}
            className="bg-green-600 hover:bg-green-700 text-white px-8"
          >
            {isUnblocking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Unblock Student
          </Button>
        )}
      </div>
    </div>
  );
};

export default function StudentDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>}>
      <StudentDetailsContent />
    </Suspense>
  );
}
