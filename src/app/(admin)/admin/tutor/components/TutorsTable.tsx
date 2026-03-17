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
import type { Tutor } from "@/hooks/api";
import { formatDateShort } from "@/lib/utils";
import { MoreVertical, Search } from "lucide-react";
import Link from "next/link";

export type TutorStatus = "all" | "ACTIVE" | "RESTRICTED";

export type TutorConfirmAction = {
  id: string;
  name: string;
  type: "block" | "unblock";
};

type TutorsTableProps = {
  activeTab: TutorStatus;
  onTabChange: (tab: string) => void;
  searchTerm: string;
  onSearch: (value: string) => void;
  isLoading: boolean;
  isFetching: boolean;
  tutors: Tutor[];
  mutatingId: string | null;
  onSetConfirmAction: (action: TutorConfirmAction) => void;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  total: number;
  onPageChange: (page: number) => void;
};

export default function TutorsTable({
  activeTab,
  onTabChange,
  searchTerm,
  onSearch,
  isLoading,
  isFetching,
  tutors,
  mutatingId,
  onSetConfirmAction,
  currentPage,
  totalPages,
  itemsPerPage,
  total,
  onPageChange,
}: TutorsTableProps) {
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
                All Tutors
              </TabsTrigger>
              <TabsTrigger
                value="RESTRICTED"
                className="bg-transparent border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-black"
              >
                Blocked Tutors
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent>
            <TabsContent value={activeTab} className="space-y-4 mt-0">
              <div className="border border-gray-200 rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Registration Date</TableHead>
                      <TableHead>Sessions</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <AdminTableSkeleton cols={6} />
                    ) : tutors.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="py-8 text-center text-muted-foreground"
                        >
                          No tutors found
                        </TableCell>
                      </TableRow>
                    ) : (
                      tutors.map((tutor) => (
                        <TableRow
                          key={tutor._id}
                          className={isFetching ? "opacity-50" : ""}
                        >
                          <TableCell className="font-medium">
                            {tutor.name}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {tutor.email}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {tutor.tutorProfile?.subjects
                              ?.map((s) => s.name)
                              .join(", ") || "-"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDateShort(tutor.createdAt)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {tutor.tutorProfile?.totalSessions || 0}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  disabled={mutatingId === tutor._id}
                                >
                                  <MoreVertical size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <Link
                                  href={`/admin/tutor-details?id=${tutor._id}`}
                                >
                                  <DropdownMenuItem>
                                    View Details
                                  </DropdownMenuItem>
                                </Link>
                                {tutor.status === "ACTIVE" ? (
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() =>
                                      onSetConfirmAction({
                                        id: tutor._id,
                                        name: tutor.name,
                                        type: "block",
                                      })
                                    }
                                  >
                                    Block Tutor
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    className="text-green-600"
                                    onClick={() =>
                                      onSetConfirmAction({
                                        id: tutor._id,
                                        name: tutor.name,
                                        type: "unblock",
                                      })
                                    }
                                  >
                                    Unblock Tutor
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

              {tutors.length > 0 && (
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
