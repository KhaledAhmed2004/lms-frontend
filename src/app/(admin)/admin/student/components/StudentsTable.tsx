import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminTableSkeleton } from "@/components/admin/admin-table-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Student } from "@/hooks/api";
import { formatDateShort } from "@/lib/utils";
import { MoreVertical, Search, Star } from "lucide-react";
import Link from "next/link";

export type StudentStatus = "all" | "ACTIVE" | "RESTRICTED";

export type StudentConfirmAction = {
  id: string;
  name: string;
  type: "block" | "unblock";
};

type StudentsTableProps = {
  activeTab: StudentStatus;
  onTabChange: (tab: string) => void;
  searchTerm: string;
  onSearch: (value: string) => void;
  isLoading: boolean;
  isFetching: boolean;
  students: Student[];
  mutatingId: string | null;
  onSetConfirmAction: (action: StudentConfirmAction) => void;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  total: number;
  onPageChange: (page: number) => void;
};

export default function StudentsTable({
  activeTab,
  onTabChange,
  searchTerm,
  onSearch,
  isLoading,
  isFetching,
  students,
  mutatingId,
  onSetConfirmAction,
  currentPage,
  totalPages,
  itemsPerPage,
  total,
  onPageChange,
}: StudentsTableProps) {
  return (
    <>
      <div className="relative w-full sm:w-1/3">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <Input
          placeholder="Search by name, email..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10 pr-4 h-11 border border-gray-300 rounded-xl focus:ring-0 focus:border-gray-400"
        />
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <Card>
          <CardHeader className="pb-4">
            <TabsList className="grid w-1/4 grid-cols-2 bg-transparent p-0 h-auto">
              <TabsTrigger
                value="all"
                className="bg-transparent border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-black"
              >
                All Students
              </TabsTrigger>
              <TabsTrigger
                value="RESTRICTED"
                className="bg-transparent border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-black"
              >
                Blocked Students
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent>
            <TabsContent value={activeTab} className="space-y-4 mt-0">
              <div className="border border-gray-200 rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-200">
                      <TableHead className="py-3 px-4 font-semibold text-gray-700">
                        Name
                      </TableHead>
                      <TableHead className="py-3 px-4 font-semibold text-gray-700">
                        Email
                      </TableHead>
                      <TableHead className="py-3 px-4 font-semibold text-gray-700">
                        Registration Date
                      </TableHead>
                      <TableHead className="py-3 px-4 font-semibold text-gray-700">
                        Sessions
                      </TableHead>
                      <TableHead className="py-3 px-4 font-semibold text-gray-700">
                        Trial Status
                      </TableHead>
                      <TableHead className="py-3 px-4 font-semibold text-gray-700">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <AdminTableSkeleton cols={6} />
                    ) : students.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="py-8 text-center text-gray-500"
                        >
                          No students found
                        </TableCell>
                      </TableRow>
                    ) : (
                      students.map((student) => (
                        <TableRow
                          key={student._id}
                          className={`border-b border-gray-100 hover:bg-gray-50 ${isFetching ? "opacity-50" : ""}`}
                        >
                          <TableCell className="py-3 px-4 text-gray-900 font-medium">
                            <span className="flex items-center gap-1.5">
                              {student.name}
                              {student.studentProfile?.isSpecialStudent && (
                                <span title="Special student (€25/hr)">
                                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 shrink-0" />
                                </span>
                              )}
                            </span>
                          </TableCell>
                          <TableCell className="py-3 px-4 text-gray-600">
                            {student.email}
                          </TableCell>
                          <TableCell className="py-3 px-4 text-gray-600">
                            {formatDateShort(student.createdAt)}
                          </TableCell>
                          <TableCell className="py-3 px-4 text-gray-600">
                            {student.studentProfile?.sessionRequestsCount || 0}
                          </TableCell>
                          <TableCell className="py-3 px-4">
                            {student.studentProfile?.hasCompletedTrial ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                Trial Done
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                Trial Pending
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="py-3 px-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  disabled={mutatingId === student._id}
                                >
                                  <MoreVertical size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <Link
                                  href={`/admin/student-details?id=${student._id}`}
                                >
                                  <DropdownMenuItem>
                                    View Details
                                  </DropdownMenuItem>
                                </Link>
                                {student.status === "ACTIVE" ? (
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() =>
                                      onSetConfirmAction({
                                        id: student._id,
                                        name: student.name,
                                        type: "block",
                                      })
                                    }
                                  >
                                    Block Student
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    className="text-green-600"
                                    onClick={() =>
                                      onSetConfirmAction({
                                        id: student._id,
                                        name: student.name,
                                        type: "unblock",
                                      })
                                    }
                                  >
                                    Unblock Student
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {students.length > 0 && (
                <AdminPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  total={total}
                  onPageChange={onPageChange}
                />
              )}
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </>
  );
}
