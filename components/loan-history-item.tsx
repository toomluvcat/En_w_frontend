"use client"

import Link from "next/link"
import { format } from "date-fns"
import { TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, User } from "lucide-react"
import type { LoanEvent } from "@/types/loan"

interface LoanHistoryItemProps {
  loan: LoanEvent
  onViewDetails: (loan: LoanEvent) => void
  onUpdateStatus: (loan: LoanEvent) => void
}

export function LoanHistoryItem({ loan, onViewDetails, onUpdateStatus }: LoanHistoryItemProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Rejected
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Completed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <TableRow>
      <TableCell className="font-medium">{loan.EventID}</TableCell>
      <TableCell>
        <Link href={`/users/${loan.UserID}`} className="flex items-center hover:underline">
          <User className="h-4 w-4 mr-1 text-muted-foreground" />
          {loan.UserName}
        </Link>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <div className="flex -space-x-2 mr-2">
            {loan.Loan.slice(0, 2).map((item, index) => (
              <div
                key={item.ItemID}
                className="relative w-8 h-8 rounded-full border-2 border-background bg-muted overflow-hidden"
                style={{ zIndex: 2 - index }}
              >
                {item.ImageUrl ? (
                  <img
                    src={item.ImageUrl || "/placeholder.svg"}
                    alt={item.Name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                    {item.Name.charAt(0)}
                  </div>
                )}
              </div>
            ))}
            {loan.Loan.length > 2 && (
              <div className="relative w-8 h-8 rounded-full border-2 border-background bg-gray-200 flex items-center justify-center text-xs">
                +{loan.Loan.length - 2}
              </div>
            )}
          </div>
          <span>
            {loan.Loan.length === 1
              ? `${loan.Loan[0].Name} (${loan.Loan[0].Quantity})`
              : `${loan.Loan.length} items borrowed`}
          </span>
        </div>
      </TableCell>
      <TableCell>{format(new Date(loan.CreatedAt), "MMM d, yyyy")}</TableCell>
      <TableCell>{getStatusBadge(loan.Status)}</TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewDetails(loan)}>View Details</DropdownMenuItem>
            {(loan.Status === "pending" || loan.Status === "approved") && (
              <DropdownMenuItem onClick={() => onUpdateStatus(loan)}>Update Status</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
