import { Skeleton } from "@/components/ui/skeleton";
import { TableRow, TableCell } from "@/components/ui/table";

interface AdminTableSkeletonProps {
  rows?: number;
  cols: number;
  actionCol?: boolean;
}

export function AdminTableSkeleton({
  rows = 5,
  cols,
  actionCol = true,
}: AdminTableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: cols }).map((_, colIndex) => (
            <TableCell key={colIndex}>
              {actionCol && colIndex === cols - 1 ? (
                <Skeleton className="h-8 w-8 rounded" />
              ) : (
                <Skeleton className="h-4 w-32" />
              )}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
