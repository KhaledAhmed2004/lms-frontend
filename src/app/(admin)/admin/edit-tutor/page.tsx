'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FileText, X, ArrowLeft, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useTutor, useAdminUpdateTutorProfile, useActiveSubjects } from '@/hooks/api';

interface SubjectItem {
  _id: string;
  name: string;
}

const TutorEditContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id') || '';

  // Fetch tutor details
  const { data: tutor, isLoading, error } = useTutor(id);
  const { data: availableSubjects } = useActiveSubjects();
  const { mutate: updateTutor, isPending: isUpdating } = useAdminUpdateTutorProfile();

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [address, setAddress] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectItem[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');

  // Initialize form with tutor data
  useEffect(() => {
    if (tutor) {
      setFullName(tutor.name || '');
      setEmail(tutor.email || '');
      setPhone(tutor.phone || '');
      setBirthDate(tutor.tutorProfile?.birthDate || tutor.dateOfBirth || '');
      setAddress(tutor.tutorProfile?.address || tutor.location || '');
      setSelectedSubjects(tutor.tutorProfile?.subjects || []);
    }
  }, [tutor]);

  // Get subjects that are not yet selected
  const unselectedSubjects = availableSubjects?.filter(
    (sub) => !selectedSubjects.some((sel) => sel._id === sub._id)
  ) || [];

  const handleAddSubject = () => {
    if (selectedSubjectId) {
      const subjectToAdd = availableSubjects?.find((s) => s._id === selectedSubjectId);
      if (subjectToAdd && !selectedSubjects.some((s) => s._id === subjectToAdd._id)) {
        setSelectedSubjects([...selectedSubjects, { _id: subjectToAdd._id, name: subjectToAdd.name }]);
        setSelectedSubjectId('');
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
          toast.success('Tutor profile updated successfully');
          router.push(`/admin/tutor-details?id=${id}`);
        },
        onError: (error: any) => {
          toast.error(error?.message || 'Failed to update tutor profile');
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
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.push(`/admin/tutor-details?id=${id}`)}
          className="gap-2"
        >
          <ArrowLeft size={16} />
          Back
        </Button>
        <h1 className="text-xl font-bold text-gray-700">
          Edit Tutor: {tutor.name}
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

          {/* Phone and Birth Date */}
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
                Birth Date
              </label>
              <Input
                type="date"
                value={birthDate ? birthDate.split('T')[0] : ''}
                onChange={(e) => setBirthDate(e.target.value)}
                className="bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-0"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Address
            </label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-0"
            />
          </div>
        </CardContent>
      </Card>

      {/* Teaching Preferences Section */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Teaching Preferences</CardTitle>
          <CardDescription>Subjects the tutor teaches</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Selected Subjects */}
          <div className="flex flex-wrap gap-2">
            {selectedSubjects.map((subject) => (
              <Badge
                key={subject._id}
                className="bg-blue-100 text-blue-800 border-0 font-medium flex items-center gap-2 px-3 py-1"
              >
                {subject.name}
                <button
                  onClick={() => handleRemoveSubject(subject._id)}
                  className="ml-1 hover:opacity-70"
                >
                  <X size={14} />
                </button>
              </Badge>
            ))}
            {selectedSubjects.length === 0 && (
              <p className="text-gray-500 text-sm">No subjects selected</p>
            )}
          </div>

          {/* Add Subject Dropdown */}
          <div className="flex gap-2">
            <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
              <SelectTrigger className="w-[300px] bg-gray-50 border-gray-200">
                <SelectValue placeholder="Select a subject to add" />
              </SelectTrigger>
              <SelectContent>
                {unselectedSubjects.map((subject) => (
                  <SelectItem key={subject._id} value={subject._id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleAddSubject}
              disabled={!selectedSubjectId}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <Plus size={16} className="mr-1" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files Section */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Uploaded Files</CardTitle>
          <CardDescription>View tutor documents (read-only)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* CV */}
            {tutor.tutorProfile?.cvUrl && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
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
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
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
          onClick={handleSave}
          disabled={isUpdating}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8"
        >
          {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push(`/admin/tutor-details?id=${id}`)}
          className="px-8"
        >
          Cancel
        </Button>
      </div>
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
