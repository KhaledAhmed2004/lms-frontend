import { Card, CardContent, CardHeader } from "@/components/ui/card";

type StudentDetailsInfoCardProps = {
  name: string;
  phone?: string;
  location?: string;
  email: string;
  dateOfBirth?: string;
  createdAt?: string;
  formatDate: (dateString?: string) => string;
};

export default function StudentDetailsInfoCard({
  name,
  phone,
  location,
  email,
  dateOfBirth,
  createdAt,
  formatDate,
}: StudentDetailsInfoCardProps) {
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <div>
          <h1 className="text-xl font-bold text-gray-700">
            Information of {name}
          </h1>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">
                Full Name
              </p>
              <p className="text-gray-900 font-medium">{name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Phone</p>
              <p className="text-gray-900 font-medium">{phone || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Location</p>
              <p className="text-gray-900 font-medium">{location || "-"}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Email</p>
              <p className="text-gray-900 font-medium">{email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">
                Date of Birth
              </p>
              <p className="text-gray-900 font-medium">
                {formatDate(dateOfBirth)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">
                Member Since
              </p>
              <p className="text-gray-900 font-medium">
                {formatDate(createdAt)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
