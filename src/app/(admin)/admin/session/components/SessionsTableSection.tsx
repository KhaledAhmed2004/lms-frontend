import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminTableSkeleton } from "@/components/admin/admin-table-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { UnifiedSession } from "@/hooks/api";
import { formatDateShort } from "@/lib/utils";
import { MoreVertical, Search } from "lucide-react";

type TabFilter = "all" | "COMPLETED" | "CANCELLED" | "SCHEDULED";

type SessionsTableSectionProps = {
  activeTab: TabFilter;
  onTabChange: (tab: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isLoading: boolean;
  isFetching: boolean;
  sessions: UnifiedSession[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  total: number;
  onPageChange: (page: number) => void;
  onViewDetails: (session: UnifiedSession) => void;
  getPaymentStatusColor: (status: string) => string;
  getLessonStatusColor: (status: string) => string;
  formatStatusLabel: (status: string) => string;
};

export default function SessionsTableSection({
  activeTab,
  onTabChange,
  searchTerm,
  onSearchChange,
  isLoading,
  isFetching,
  sessions,
  currentPage,
  totalPages,
  itemsPerPage,
  total,
  onPageChange,
  onViewDetails,
  getPaymentStatusColor,
  getLessonStatusColor,
  formatStatusLabel,
}: SessionsTableSectionProps) {
  return (
    <>
      <div className="relative w-1/3">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <Input
          placeholder="Search by name, subject..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 h-11 border border-gray-300 rounded-xl focus:ring-0 focus:border-gray-400"
        />
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <Card>
          <CardHeader className="pb-4">
            <TabsList className="grid w-1/2 grid-cols-4 bg-transparent p-0 h-auto">
              <TabsTrigger
                value="all"
                className="bg-transparent border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-black"
              >
                All Sessions
              </TabsTrigger>
              <TabsTrigger
                value="COMPLETED"
                className="bg-transparent border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-black"
              >
                Completed
              </TabsTrigger>
              <TabsTrigger
                value="CANCELLED"
                className="bg-transparent border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-black"
              >
                Cancelled
              </TabsTrigger>
              <TabsTrigger
                value="SCHEDULED"
                className="bg-transparent border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-black"
              >
                Scheduled
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent>
            <TabsContent value={activeTab} className="space-y-4 mt-0">
              <div className="overflow-x-auto">
                <div className="border border-gray-200 rounded-lg">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          Student Name
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          Subject
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          Booking Date
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          Payment Status
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          Lesson Status
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <AdminTableSkeleton cols={6} />
                      ) : sessions.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="py-8 text-center text-gray-500"
                          >
                            No sessions found
                          </td>
                        </tr>
                      ) : (
                        sessions.map((session) => (
                          <tr
                            key={session._id}
                            className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${isFetching ? "opacity-50" : ""}`}
                          >
                            <td className="py-3 px-4 text-gray-900 font-medium text-sm">
                              <div className="flex items-center gap-2">
                                {session.studentName || "N/A"}
                                {session.type === "TRIAL_REQUEST" && (
                                  <Badge className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                                    Trial Request
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-600 text-sm">
                              {session.subject}
                            </td>
                            <td className="py-3 px-4 text-gray-600 text-sm">
                              {formatDateShort(session.createdAt)}
                            </td>
                            <td className="py-3 px-4">
                              <Badge
                                className={`${getPaymentStatusColor(session.paymentStatus)} border-0`}
                              >
                                {formatStatusLabel(session.paymentStatus)}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Badge
                                className={`${getLessonStatusColor(session.status)} border-0`}
                              >
                                {formatStatusLabel(session.status)}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreVertical size={16} />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => onViewDetails(session)}
                                  >
                                    View Details
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {sessions.length > 0 && (
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
