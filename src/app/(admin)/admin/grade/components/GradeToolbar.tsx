import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GraduationCap, Plus, Search } from "lucide-react";

type GradeToolbarProps = {
  total: number;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
};

export default function GradeToolbar({
  total,
  searchTerm,
  onSearchChange,
  onAddClick,
}: GradeToolbarProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="w-1/4">
          <Card className="border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="bg-blue-50 p-2 rounded-full w-fit mb-2">
                    <GraduationCap className="text-blue-600" size={24} />
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Total Grades
                  </p>
                  <p className="text-3xl font-bold text-gray-900">{total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Button onClick={onAddClick} className="bg-black hover:bg-gray-800">
          <Plus size={18} className="mr-2" />
          Add Grade
        </Button>
      </div>

      <div className="relative w-1/3">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <Input
          placeholder="Search grades..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 h-11 border border-gray-300 rounded-xl focus:ring-0 focus:border-gray-400"
        />
      </div>
    </>
  );
}
