import { TableCell, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

interface SkeletonTableRowProps {
  columns: number
}

export function SkeletonTableRow({ columns }: SkeletonTableRowProps) {
  return (
    <TableRow>
      {Array.from({ length: columns }).map((_, index) => (
        <TableCell key={index}>
          <Skeleton className="h-5 w-full" />
        </TableCell>
      ))}
    </TableRow>
  )
}
