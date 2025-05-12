"use client"

import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, User } from "lucide-react"
import type { LoanEvent } from "@/types/loan"

interface LoanDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  loan: LoanEvent
}

export function LoanDetailsDialog({ open, onOpenChange, loan }: LoanDetailsDialogProps) {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Loan Request #{loan.EventID}</span>
            {getStatusBadge(loan.Status)}
          </DialogTitle>
          <DialogDescription>Details for loan request #{loan.EventID}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {loan.UserName && (
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Borrower:</span>
              <span>
                {loan.UserName} {loan.UserID && `(ID: ${loan.UserID})`}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Requested:</span>
            <span>{format(new Date(loan.CreatedAt), "PPP p")}</span>
          </div>

          {loan.ApprovedAt && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Status Updated:</span>
              <span>{format(new Date(loan.ApprovedAt), "PPP p")}</span>
            </div>
          )}

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Borrowed Items:</h4>
            <ul className="space-y-2">
              {loan.Loan.map((item) => (
                <li key={item.ItemID} className="flex justify-between items-center bg-muted/50 p-2 rounded-md">
                  <div className="flex items-center gap-2">
                    {item.ImageUrl ? (
                      <div className="relative w-8 h-8 rounded-md overflow-hidden">
                        <img
                          src={item.ImageUrl || "/placeholder.svg"}
                          alt={item.Name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                        {item.Name.charAt(0)}
                      </div>
                    )}
                    <span>{item.Name}</span>
                  </div>
                  <Badge variant="secondary">Qty: {item.Quantity}</Badge>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
