'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FileText, ArrowLeft, Loader2, Edit, Star } from 'lucide-react';
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
  useTutor,
  useBlockTutor,
  useUnblockTutor,
  useTutorReviews,
  useTutorReviewStats,
} from '@/hooks/api';

const TutorDetailsContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id') || '';

  // Fetch tutor details
  const { data: tutor, isLoading, error } = useTutor(id);
  const { data: reviewsData } = useTutorReviews(id, 1, 100);
  const { data: reviewStats } = useTutorReviewStats(id);

  // Mutations
  const { mutate: blockTutor, isPending: isBlocking } = useBlockTutor();
  const { mutate: unblockTutor, isPending: isUnblocking } = useUnblockTutor();

  const isActionPending = isBlocking || isUnblocking;

  // Handlers
  const handleBlock = () => {
    blockTutor(id, {
      onSuccess: () => {
        toast.success('Tutor blocked successfully');
      },
      onError: (error: any) => {
        toast.error(error?.getFullMessage?.() || error?.message || 'Failed to block tutor');
      },
    });
  };

  const handleUnblock = () => {
    unblockTutor(id, {
      onSuccess: () => {
        toast.success('Tutor unblocked successfully');
      },
      onError: (error: any) => {
        toast.error(error?.getFullMessage?.() || error?.message || 'Failed to unblock tutor');
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

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
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
  if (error || !tutor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-red-500">Tutor not found or error loading details.</p>
        <Button variant="outline" onClick={() => router.push('/admin/tutor')}>
          <ArrowLeft className="mr-2" size={16} />
          Back to Tutors
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
          onClick={() => router.push('/admin/tutor')}
          className="gap-2"
        >
          <ArrowLeft size={16} />
          Back
        </Button>
        <div className="flex items-center gap-3">
          <Badge className={`${getStatusColor(tutor.status)} border-0 text-sm px-3 py-1`}>
            {getStatusLabel(tutor.status)}
          </Badge>
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/edit-tutor?id=${id}`)}
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
              Information of {tutor.name}
            </h1>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Full Name</p>
                <p className="text-gray-900 font-medium">{tutor.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Phone</p>
                <p className="text-gray-900 font-medium">{tutor.phone || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Address</p>
                <p className="text-gray-900 font-medium">
                  {tutor.tutorProfile?.address || tutor.location || '-'}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Email</p>
                <p className="text-gray-900 font-medium">{tutor.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Date of Birth</p>
                <p className="text-gray-900 font-medium">
                  {formatDate(tutor.tutorProfile?.birthDate || tutor.dateOfBirth)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Member Since</p>
                <p className="text-gray-900 font-medium">{formatDate(tutor.createdAt)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Section */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
          <CardDescription>Tutor performance overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">
                {tutor.tutorProfile?.totalSessions || 0}
              </p>
              <p className="text-sm text-gray-600">Total Sessions</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">
                {tutor.tutorProfile?.completedSessions || 0}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">
                {tutor.tutorProfile?.totalStudents || 0}
              </p>
              <p className="text-sm text-gray-600">Students</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">
                {tutor.tutorProfile?.level || 'STARTER'}
              </p>
              <p className="text-sm text-gray-600">Level</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teaching Preferences Section */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Teaching Preferences</CardTitle>
          <CardDescription>Subjects this tutor teaches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tutor.tutorProfile?.subjects && tutor.tutorProfile.subjects.length > 0 ? (
              tutor.tutorProfile.subjects.map((subject, index) => (
                <Badge
                  key={subject._id || index}
                  className="bg-blue-100 text-blue-800 border-0 font-medium"
                >
                  {subject.name}
                </Badge>
              ))
            ) : (
              <p className="text-gray-500">No subjects assigned</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reviews Section */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
          <CardDescription>
            {reviewStats?.totalReviews || 0} reviews - Average: {reviewStats?.averageOverallRating?.toFixed(1) || '0.0'}/5
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reviewsData?.data && reviewsData.data.length > 0 ? (
            <div className="space-y-4">
              {reviewsData.data.map((review: any) => (
                <div key={review._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(review.overallRating)}
                    <span className="text-sm text-gray-600">
                      {review.overallRating}/5
                    </span>
                    {!review.isPublic && (
                      <Badge variant="outline" className="text-xs bg-yellow-50">Private</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    {review.comment || 'No comment provided'}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>
                      By: {typeof review.studentId === 'object' ? review.studentId?.name : 'Anonymous'}
                    </span>
                    <span>{formatDate(review.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No reviews yet</p>
          )}
        </CardContent>
      </Card>

      {/* Uploaded Files Section */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Uploaded Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* CV */}
            {tutor.tutorProfile?.cvUrl && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-200 rounded">
                    <FileText size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">CV / Resume</p>
                    <p className="text-xs text-gray-500">PDF</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  onClick={() => window.open(tutor.tutorProfile?.cvUrl, '_blank')}
                >
                  View File
                </Button>
              </div>
            )}

            {/* Abitur Certificate */}
            {tutor.tutorProfile?.abiturCertificateUrl && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-200 rounded">
                    <FileText size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Abitur Certificate</p>
                    <p className="text-xs text-gray-500">PDF</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  onClick={() => window.open(tutor.tutorProfile?.abiturCertificateUrl, '_blank')}
                >
                  View File
                </Button>
              </div>
            )}

            {/* No files */}
            {!tutor.tutorProfile?.cvUrl && !tutor.tutorProfile?.abiturCertificateUrl && (
              <p className="text-gray-500 text-center py-4">No files uploaded</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.push(`/admin/edit-tutor?id=${id}`)}
          className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8"
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
        {tutor.status === 'ACTIVE' ? (
          <Button
            onClick={handleBlock}
            disabled={isActionPending}
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-50 px-8"
          >
            {isBlocking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Block Tutor
          </Button>
        ) : (
          <Button
            onClick={handleUnblock}
            disabled={isActionPending}
            className="bg-green-600 hover:bg-green-700 text-white px-8"
          >
            {isUnblocking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Unblock Tutor
          </Button>
        )}
      </div>
    </div>
  );
};

export default function TutorDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>}>
      <TutorDetailsContent />
    </Suspense>
  );
}
