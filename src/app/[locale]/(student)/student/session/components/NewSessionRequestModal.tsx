'use client';

import { useState } from 'react';
import { Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useActiveSubjects } from '@/hooks/api/use-subjects';
import { useCreateSessionRequest } from '@/hooks/api/use-session-requests';
import { useActiveGrades } from '@/hooks/api/use-grades';
import { useActiveSchoolTypes } from '@/hooks/api/use-school-types';

interface NewSessionRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewSessionRequestModal({ isOpen, onClose }: NewSessionRequestModalProps) {
  // Simplified form: only subject, gradeLevel, schoolType, learningGoals, documents
  // No description or preferredDateTime needed (unlike trial request)
  const [formData, setFormData] = useState({
    subject: '',
    gradeLevel: '',
    schoolType: '',
    learningGoals: '',
  });
  const [documents, setDocuments] = useState<File[]>([]);

  const { data: subjects, isLoading: subjectsLoading } = useActiveSubjects();
  const { data: grades, isLoading: gradesLoading } = useActiveGrades();
  const { data: schoolTypes, isLoading: schoolTypesLoading } = useActiveSchoolTypes();
  const createRequest = useCreateSessionRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject || !formData.gradeLevel || !formData.schoolType) {
      return;
    }

    try {
      await createRequest.mutateAsync({
        subject: formData.subject,
        gradeLevel: formData.gradeLevel,
        schoolType: formData.schoolType,
        learningGoals: formData.learningGoals || undefined,
      });

      // Show success toast
      toast.success('Session request created successfully!');

      // Reset form and close
      setFormData({
        subject: '',
        gradeLevel: '',
        schoolType: '',
        learningGoals: '',
      });
      setDocuments([]);
      onClose();
    } catch (error) {
      console.error('Failed to create session request:', error);
      toast.error('Failed to create session request');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request a New Session</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Select
              value={formData.subject}
              onValueChange={(value) => setFormData({ ...formData, subject: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjectsLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                ) : (
                  subjects?.map((subject) => (
                    <SelectItem key={subject._id} value={subject._id}>
                      {subject.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Grade Level */}
          <div className="space-y-2">
            <Label htmlFor="gradeLevel">Grade Level *</Label>
            <Select
              value={formData.gradeLevel}
              onValueChange={(value) => setFormData({ ...formData, gradeLevel: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select grade level" />
              </SelectTrigger>
              <SelectContent>
                {gradesLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                ) : (
                  grades?.map((grade) => (
                    <SelectItem key={grade._id} value={grade.name}>
                      {grade.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* School Type */}
          <div className="space-y-2">
            <Label htmlFor="schoolType">School Type *</Label>
            <Select
              value={formData.schoolType}
              onValueChange={(value) => setFormData({ ...formData, schoolType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select school type" />
              </SelectTrigger>
              <SelectContent>
                {schoolTypesLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                ) : (
                  schoolTypes?.map((type) => (
                    <SelectItem key={type._id} value={type.name}>
                      {type.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Learning Goals */}
          <div className="space-y-2">
            <Label htmlFor="learningGoals">Learning Goals (Optional)</Label>
            <Textarea
              id="learningGoals"
              placeholder="What do you want to achieve from this session?"
              value={formData.learningGoals}
              onChange={(e) => setFormData({ ...formData, learningGoals: e.target.value })}
              rows={2}
            />
          </div>

          {/* Documents Upload */}
          <div className="space-y-2">
            <Label>Attach Documents (Optional)</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="documents"
              />
              <label htmlFor="documents" className="cursor-pointer">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  Click to upload files
                </p>
              </label>
              {documents.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  {documents.length} file(s) selected
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createRequest.isPending}>
              {createRequest.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
