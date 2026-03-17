import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText } from "lucide-react";

type EditTutorFilesSectionProps = {
  cvUrl?: string;
  abiturCertificateUrl?: string;
};

function FileRow({ label, onView }: { label: string; onView: () => void }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-200 rounded">
          <FileText size={20} className="text-gray-600" />
        </div>
        <div>
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-xs text-gray-500">PDF</p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="border-blue-600 text-blue-600 hover:bg-blue-50"
        onClick={onView}
      >
        View File
      </Button>
    </div>
  );
}

export default function EditTutorFilesSection({
  cvUrl,
  abiturCertificateUrl,
}: EditTutorFilesSectionProps) {
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle>Uploaded Files</CardTitle>
        <CardDescription>View tutor documents (read-only)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {cvUrl && (
            <FileRow
              label="CV / Resume"
              onView={() => window.open(cvUrl, "_blank")}
            />
          )}

          {abiturCertificateUrl && (
            <FileRow
              label="Abitur Certificate"
              onView={() => window.open(abiturCertificateUrl, "_blank")}
            />
          )}

          {!cvUrl && !abiturCertificateUrl && (
            <p className="text-gray-500 text-center py-4">No files uploaded</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
