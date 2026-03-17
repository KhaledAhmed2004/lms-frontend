import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AdminApplication } from "@/hooks/api";
import { FileText } from "lucide-react";

type ApplicationInfoSectionsProps = {
  application: AdminApplication;
  formatDate: (date: string) => string;
  address: string;
};

function FileRow({
  label,
  fileUrl,
  fileType,
}: {
  label: string;
  fileUrl: string;
  fileType: string;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-200 rounded">
          <FileText size={20} className="text-gray-600" />
        </div>
        <div>
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-xs text-gray-500">{fileType}</p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="border-blue-600 text-blue-600 hover:bg-blue-50"
        onClick={() => window.open(fileUrl, "_blank")}
      >
        View File
      </Button>
    </div>
  );
}

export default function ApplicationInfoSections({
  application,
  formatDate,
  address,
}: ApplicationInfoSectionsProps) {
  return (
    <>
      <Card className="border-gray-200">
        <CardHeader>
          <h1 className="text-xl font-bold text-gray-700">
            Information of {application.name}
          </h1>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Full Name
                </p>
                <p className="text-gray-900 font-medium">{application.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Phone</p>
                <p className="text-gray-900 font-medium">
                  {application.phoneNumber}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Address
                </p>
                <p className="text-gray-900 font-medium">{address}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Email</p>
                <p className="text-gray-900 font-medium">{application.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Date of Birth
                </p>
                <p className="text-gray-900 font-medium">
                  {formatDate(application.birthDate)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Submitted At
                </p>
                <p className="text-gray-900 font-medium">
                  {formatDate(application.submittedAt)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Uploaded Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {application.cv && (
              <FileRow
                label="CV / Resume"
                fileUrl={application.cv}
                fileType="PDF"
              />
            )}
            {application.abiturCertificate && (
              <FileRow
                label="Abitur Certificate"
                fileUrl={application.abiturCertificate}
                fileType="PDF"
              />
            )}
            {application.officialId && (
              <FileRow
                label="Official ID"
                fileUrl={application.officialId}
                fileType="PDF / Image"
              />
            )}
          </div>
        </CardContent>
      </Card>

      {(application.adminNotes ||
        application.rejectionReason ||
        application.revisionNote) && (
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {application.adminNotes && (
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Admin Notes
                </p>
                <p className="text-gray-900">{application.adminNotes}</p>
              </div>
            )}
            {application.rejectionReason && (
              <div>
                <p className="text-sm font-medium text-red-600 mb-1">
                  Rejection Reason
                </p>
                <p className="text-gray-900">{application.rejectionReason}</p>
              </div>
            )}
            {application.revisionNote && (
              <div>
                <p className="text-sm font-medium text-orange-600 mb-1">
                  Revision Note
                </p>
                <p className="text-gray-900">{application.revisionNote}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
