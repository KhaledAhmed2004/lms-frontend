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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SchoolType } from "@/hooks/api";
import {
  type ColumnDef,
  type Table as TanstackTable,
  flexRender,
} from "@tanstack/react-table";
import { MoreVertical, Search } from "lucide-react";

type SchoolTypeTab = "all" | "active" | "inactive";

type SchoolTypeTableSectionProps = {
  activeTab: SchoolTypeTab;
  onTabChange: (tab: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isLoading: boolean;
  isFetching: boolean;
  table: TanstackTable<SchoolType>;
  columns: ColumnDef<SchoolType>[];
  schoolTypesCount: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  total: number;
  onPageChange: (page: number) => void;
  onEdit: (item: SchoolType) => void;
  onToggleStatus: (item: SchoolType) => void;
  onDelete: (item: SchoolType) => void;
};

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell className="py-3 px-4">
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell className="py-3 px-4">
            <Skeleton className="h-6 w-16 rounded-full" />
          </TableCell>
          <TableCell className="py-3 px-4">
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell className="py-3 px-4">
            <Skeleton className="h-8 w-8 rounded" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export function createSchoolTypeColumns(
  onEdit: (item: SchoolType) => void,
  onToggleStatus: (item: SchoolType) => void,
  onDelete: (item: SchoolType) => void,
  formatDate: (dateString: string) => string,
): ColumnDef<SchoolType>[] {
  return [
    {
      accessorKey: "name",
      header: "School Type Name",
      cell: ({ row }) => (
        <span className="text-gray-900 font-medium text-sm">
          {row.getValue("name")}
        </span>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return (
          <Badge
            variant={isActive ? "default" : "secondary"}
            className={
              isActive
                ? "bg-green-100 text-green-700 hover:bg-green-100"
                : "bg-gray-100 text-gray-600 hover:bg-gray-100"
            }
          >
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => (
        <span className="text-gray-600 text-sm">
          {formatDate(row.getValue("createdAt"))}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const schoolType = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(schoolType)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleStatus(schoolType)}>
                {schoolType.isActive ? "Deactivate" : "Activate"}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDelete(schoolType)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}

export default function SchoolTypeTableSection({
  activeTab,
  onTabChange,
  searchTerm,
  onSearchChange,
  isLoading,
  isFetching,
  table,
  columns,
  schoolTypesCount,
  currentPage,
  totalPages,
  itemsPerPage,
  total,
  onPageChange,
}: SchoolTypeTableSectionProps) {
  return (
    <>
      <div className="relative w-1/3">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <Input
          placeholder="Search school types..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 h-11 border border-gray-300 rounded-xl focus:ring-0 focus:border-gray-400"
        />
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <Card>
          <CardHeader className="pb-4">
            <TabsList className="grid w-1/3 grid-cols-3 bg-transparent p-0 h-auto">
              <TabsTrigger
                value="all"
                className="bg-transparent border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-black"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="active"
                className="bg-transparent border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-black"
              >
                Active
              </TabsTrigger>
              <TabsTrigger
                value="inactive"
                className="bg-transparent border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-black"
              >
                Inactive
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent>
            <TabsContent value={activeTab} className="space-y-4 mt-0">
              <div className="border border-gray-200 rounded-lg">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow
                        key={headerGroup.id}
                        className="border-b border-gray-200"
                      >
                        {headerGroup.headers.map((header) => (
                          <TableHead
                            key={header.id}
                            className="py-3 px-4 font-semibold text-gray-700 text-sm"
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {isLoading || isFetching ? (
                      <TableSkeleton />
                    ) : table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} className="py-3 px-4">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="py-8 text-center text-gray-500"
                        >
                          No school types found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {schoolTypesCount > 0 && (
                <div className="flex items-center justify-between pt-6">
                  <p className="text-sm text-gray-500 whitespace-nowrap">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, total)} of {total}{" "}
                    results
                  </p>
                  <Pagination className="justify-end mx-0">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            onPageChange(Math.max(1, currentPage - 1))
                          }
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => {
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  onClick={() => onPageChange(page)}
                                  isActive={page === currentPage}
                                  className="cursor-pointer"
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }

                          if (
                            (page === 2 && currentPage > 3) ||
                            (page === totalPages - 1 &&
                              currentPage < totalPages - 2)
                          ) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }

                          return null;
                        },
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            onPageChange(Math.min(totalPages, currentPage + 1))
                          }
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </>
  );
}
