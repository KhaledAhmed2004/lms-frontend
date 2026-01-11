'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FileText, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  useAdminApplication,
  useSelectForInterview,
  useApproveApplication,
  useRejectApplication,
  useSendForRevision,
  type AdminApplicationStatus,
} from '@/hooks/api';

const ApplicationDetails = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id') || '';

  // Revision modal state
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [revisionNote, setRevisionNote] = useState('');

  // Fetch application details
  const { data: application, isLoading, error } = useAdminApplication(id);

  // Mutations
  const { mutate: selectForInterview, isPending: isSelecting } = useSelectForInterview();
  const { mutate: approveApplication, isPending: isApproving } = useApproveApplication();
  const { mutate: rejectApplication, isPending: isRejecting } = useRejectApplication();
  const { mutate: sendForRevision, isPending: isSendingRevision } = useSendForRevision();

  const isActionPending = isSelecting || isApproving || isRejecting || isSendingRevision;

  // Handlers
  const handleSelectForInterview = () => {
    selectForInterview(
      { id },
      {
        onSuccess: () => {
          toast.success('Application selected for interview');
        },
        onError: (error: any) => {
          toast.error(error?.getFullMessage?.() || error?.message || 'Failed to select for interview');
        },
      }
    );
  };

  const handleApprove = () => {
    approveApplication(
      { id },
      {
        onSuccess: () => {
          toast.success('Application approved - User is now a Tutor');
          router.push('/admin/application');
        },
        onError: (error: any) => {
          toast.error(error?.getFullMessage?.() || error?.message || 'Failed to approve application');
        },
      }
    );
  };

  const handleReject = () => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    rejectApplication(
      { id, rejectionReason: reason },
      {
        onSuccess: () => {
          toast.success('Application rejected');
          router.push('/admin/application');
        },
        onError: (error: any) => {
          toast.error(error?.getFullMessage?.() || error?.message || 'Failed to reject application');
        },
      }
    );
  };

  const handleOpenRevisionModal = () => {
    setRevisionNote('');
    setIsRevisionModalOpen(true);
  };

  const handleSubmitRevision = () => {
    if (revisionNote.trim().length < 10) {
      toast.error('Revision note must be at least 10 characters');
      return;
    }

    sendForRevision(
      { id, revisionNote: revisionNote.trim() },
      {
        onSuccess: () => {
          toast.success('Application sent for revision');
          setIsRevisionModalOpen(false);
          setRevisionNote('');
        },
        onError: (error: any) => {
          toast.error(error?.getFullMessage?.() || error?.message || 'Failed to send for revision');
        },
      }
    );
  };

  const getStatusColor = (status: AdminApplicationStatus) => {
    switch (status) {
      case 'SUBMITTED':
        return 'bg-yellow-100 text-yellow-800';
      case 'SELECTED_FOR_INTERVIEW':
        return 'bg-blue-100 text-blue-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'REVISION':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: AdminApplicationStatus) => {
    switch (status) {
      case 'SUBMITTED':
        return 'Pending Review';
      case 'SELECTED_FOR_INTERVIEW':
        return 'Selected for Interview';
      case 'APPROVED':
        return 'Approved';
      case 'REJECTED':
        return 'Rejected';
      case 'REVISION':
        return 'Revision Required';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatAddress = () => {
    if (!application) return '-';
    const { street, houseNumber, zip, city } = application;
    return `${street} ${houseNumber}, ${zip} ${city}`;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
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
  if (error || !application) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-red-500">Application not found or error loading details.</p>
        <Button variant="outline" onClick={() => router.push('/admin/application')}>
          <ArrowLeft className="mr-2" size={16} />
          Back to Applications
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
          onClick={() => router.push('/admin/application')}
          className="gap-2"
        >
          <ArrowLeft size={16} />
          Back
        </Button>
        <Badge className={`${getStatusColor(application.status)} border-0 text-sm px-3 py-1`}>
          {getStatusLabel(application.status)}
        </Badge>
      </div>

      {/* Personal Information Section */}
      <Card className="border-gray-200">
        <CardHeader>
          <div>
            <h1 className="text-xl font-bold text-gray-700">
              Information of {application.name}
            </h1>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Full Name</p>
                <p className="text-gray-900 font-medium">{application.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Phone</p>
                <p className="text-gray-900 font-medium">{application.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Address</p>
                <p className="text-gray-900 font-medium">{formatAddress()}</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Email</p>
                <p className="text-gray-900 font-medium">{application.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Date of Birth</p>
                <p className="text-gray-900 font-medium">{formatDate(application.birthDate)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Submitted At</p>
                <p className="text-gray-900 font-medium">{formatDate(application.submittedAt)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teaching Preferences Section */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Teaching Preferences</CardTitle>
          <CardDescription>Subjects this tutor wants to teach</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {application.subjects.length > 0 ? (
              application.subjects.map((subject, index) => (
                <Badge
                  key={index}
                  className="bg-blue-100 text-blue-800 border-0 font-medium"
                >
                  {subject.name}
                </Badge>
              ))
            ) : (
              <p className="text-gray-500">No subjects selected</p>
            )}
          </div>
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
            {application.cv && (
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
                  onClick={() => window.open(application.cv, '_blank')}
                >
                  View File
                </Button>
              </div>
            )}

            {/* Abitur Certificate */}
            {application.abiturCertificate && (
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
                  onClick={() => window.open(application.abiturCertificate, '_blank')}
                >
                  View File
                </Button>
              </div>
            )}

            {/* Official ID */}
            {application.officialId && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-200 rounded">
                    <FileText size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Official ID</p>
                    <p className="text-xs text-gray-500">PDF / Image</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  onClick={() => window.open(application.officialId, '_blank')}
                >
                  View File
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Admin Notes / Rejection Reason / Revision Note */}
      {(application.adminNotes || application.rejectionReason || application.revisionNote) && (
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {application.adminNotes && (
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Admin Notes</p>
                <p className="text-gray-900">{application.adminNotes}</p>
              </div>
            )}
            {application.rejectionReason && (
              <div>
                <p className="text-sm font-medium text-red-600 mb-1">Rejection Reason</p>
                <p className="text-gray-900">{application.rejectionReason}</p>
              </div>
            )}
            {application.revisionNote && (
              <div>
                <p className="text-sm font-medium text-orange-600 mb-1">Revision Note</p>
                <p className="text-gray-900">{application.revisionNote}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons - Based on Status */}
      {application.status !== 'APPROVED' && application.status !== 'REJECTED' && (
        <div className="flex justify-center gap-4">
          {/* Select for Interview - for SUBMITTED/REVISION */}
          {(application.status === 'SUBMITTED' || application.status === 'REVISION') && (
            <Button
              onClick={handleSelectForInterview}
              disabled={isActionPending}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            >
              {isSelecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Select for Interview
            </Button>
          )}

          {/* Approve - for SELECTED_FOR_INTERVIEW */}
          {application.status === 'SELECTED_FOR_INTERVIEW' && (
            <Button
              onClick={handleApprove}
              disabled={isActionPending}
              className="bg-green-600 hover:bg-green-700 text-white px-8"
            >
              {isApproving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Approve as Tutor
            </Button>
          )}

          {/* Send for Revision */}
          <Button
            onClick={handleOpenRevisionModal}
            disabled={isActionPending}
            variant="outline"
            className="border-orange-600 text-orange-600 hover:bg-orange-50 px-8"
          >
            Request Revision
          </Button>

          {/* Reject */}
          <Button
            onClick={handleReject}
            disabled={isActionPending}
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-50 px-8"
          >
            {isRejecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reject
          </Button>
        </div>
      )}

      {/* Revision Request Modal */}
      <Dialog open={isRevisionModalOpen} onOpenChange={setIsRevisionModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Request Revision</DialogTitle>
            <DialogDescription>
              Specify what the applicant needs to fix or update in their application.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="revisionNote">Reason for Revision</Label>
              <Textarea
                id="revisionNote"
                placeholder="Please describe what needs to be corrected or updated..."
                value={revisionNote}
                onChange={(e) => setRevisionNote(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-sm text-gray-500">
                Minimum 10 characters required ({revisionNote.length}/10)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRevisionModalOpen(false)}
              disabled={isSendingRevision}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitRevision}
              disabled={revisionNote.trim().length < 10 || isSendingRevision}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isSendingRevision && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Revision Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default function ApplicationDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>}>
      <ApplicationDetails />
    </Suspense>
  );
}