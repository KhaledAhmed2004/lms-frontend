'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Edit, Star } from 'lucide-react';
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
import { useTranslations, useLocale } from 'next-intl';
import {
  useStudent,
  useBlockStudent,
  useUnblockStudent,
  useToggleSpecialStudent,
} from '@/hooks/api';

const StudentDetailsContent = () => {
  const t = useTranslations('studentDetails');
  const locale = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id') || '';

  // Fetch student details
  const { data: student, isLoading, error } = useStudent(id);

  // Mutations
  const { mutate: blockStudent, isPending: isBlocking } = useBlockStudent();
  const { mutate: unblockStudent, isPending: isUnblocking } = useUnblockStudent();
  const { mutate: toggleSpecial, isPending: isTogglingSpecial } = useToggleSpecialStudent();

  const isActionPending = isBlocking || isUnblocking || isTogglingSpecial;

  // Handlers
  const handleBlock = () => {
    blockStudent(id, {
      onSuccess: () => {
        toast.success(t('blockSuccess'));
      },
      onError: (error: any) => {
        toast.error(error?.getFullMessage?.() || error?.message || t('blockFailed'));
      },
    });
  };

  const handleUnblock = () => {
    unblockStudent(id, {
      onSuccess: () => {
        toast.success(t('unblockSuccess'));
      },
      onError: (error: any) => {
        toast.error(error?.getFullMessage?.() || error?.message || t('unblockFailed'));
      },
    });
  };

  const handleToggleSpecial = () => {
    toggleSpecial(id, {
      onSuccess: (data: any) => {
        toast.success(data?.message || t('specialStatusUpdated'));
      },
      onError: (error: any) => {
        toast.error(error?.getFullMessage?.() || error?.message || t('specialStatusFailed'));
      },
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString!);
    return date.toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-GB', {
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
    return status === 'ACTIVE' ? t('active') : t('blocked');
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
        <p className="text-red-500">{t('notFound')}</p>
        <Button variant="outline" onClick={() => router.push('/admin/student')}>
          <ArrowLeft className="mr-2" size={16} />
          {t('backToStudents')}
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
          {t('back')}
        </Button>
        <div className="flex items-center gap-3">
          <Badge className={`${getStatusColor(student.status)} border-0 text-sm px-3 py-1`}>
            {getStatusLabel(student.status)}
          </Badge>
          {student.studentProfile?.isSpecialStudent && (
            <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300 text-sm px-3 py-1">
              <Star className="w-3 h-3 mr-1 fill-yellow-500 text-yellow-500" />
              {t('specialStatus')}
            </Badge>
          )}
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/edit-student?id=${id}`)}
            className="gap-2"
          >
            <Edit size={16} />
            {t('edit')}
          </Button>
        </div>
      </div>

      {/* Personal Information Section */}
      <Card className="border-gray-200">
        <CardHeader>
          <div>
            <h1 className="text-xl font-bold text-gray-700">
              {t('informationOf', { name: student.name })}
            </h1>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">{t('fullName')}</p>
                <p className="text-gray-900 font-medium">{student.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">{t('phone')}</p>
                <p className="text-gray-900 font-medium">{student.phone || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">{t('location')}</p>
                <p className="text-gray-900 font-medium">
                  {student.location || '-'}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">{t('email')}</p>
                <p className="text-gray-900 font-medium">{student.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">{t('dateOfBirth')}</p>
                <p className="text-gray-900 font-medium">
                  {formatDate(student.dateOfBirth)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">{t('memberSince')}</p>
                <p className="text-gray-900 font-medium">{formatDate(student.createdAt)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Section */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>{t('statistics')}</CardTitle>
          <CardDescription>{t('activityOverview')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">
                {student.studentProfile?.trialRequestsCount || 0}
              </p>
              <p className="text-sm text-gray-600">{t('trialRequests')}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">
                {student.studentProfile?.sessionRequestsCount || 0}
              </p>
              <p className="text-sm text-gray-600">{t('sessionRequests')}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">
                {student.studentProfile?.hasCompletedTrial ? t('yes') : t('no')}
              </p>
              <p className="text-sm text-gray-600">{t('completedTrial')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions Section */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>{t('actions')}</CardTitle>
          <CardDescription>{t('actionsDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              onClick={() => router.push(`/admin/edit-student?id=${id}`)}
              className="gap-2"
            >
              <Edit size={16} />
              {t('editProfile')}
            </Button>

            <Button
              variant="outline"
              onClick={handleToggleSpecial}
              disabled={isActionPending}
              className={`gap-2 ${
                student.studentProfile?.isSpecialStudent
                  ? 'text-red-600 border-red-200 hover:bg-red-50'
                  : 'text-blue-600 border-blue-200 hover:bg-blue-50'
              }`}
            >
              {isTogglingSpecial ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Star
                  size={16}
                  className={
                    student.studentProfile?.isSpecialStudent ? 'fill-red-500' : ''
                  }
                />
              )}
              {student.studentProfile?.isSpecialStudent
                ? t('removeSpecial')
                : t('markAsSpecial')}
            </Button>

            {student.status === 'ACTIVE' ? (
              <Button
                variant="destructive"
                onClick={handleBlock}
                disabled={isActionPending}
                className="gap-2"
              >
                {isBlocking && <Loader2 size={16} className="animate-spin" />}
                {t('blockStudent')}
              </Button>
            ) : (
              <Button
                onClick={handleUnblock}
                disabled={isActionPending}
                className="bg-green-600 hover:bg-green-700 gap-2"
              >
                {isUnblocking && <Loader2 size={16} className="animate-spin" />}
                {t('unblockStudent')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
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
