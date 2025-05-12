"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { CheckCircle, Clock, Loader2, XCircle } from "lucide-react"
import type { LoanEvent } from "@/types/loan"

interface UpdateStatusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  loan: LoanEvent
  onStatusChange: (status: string) => void
}

export function UpdateStatusDialog({ open, onOpenChange, loan, onStatusChange }: UpdateStatusDialogProps) {
  const [status, setStatus] = useState(loan.Status)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    try {
      // Don't allow status changes for rejected or completed loans
      if (loan.Status === "rejected" || loan.Status === "completed") {
        toast({
          title: "Status cannot be changed",
          description: `Loan #${loan.EventID} status cannot be changed from ${loan.Status}.`,
          variant: "destructive",
        })
        onOpenChange(false)
        return
      }

      // Don't allow if status hasn't changed
      if (status === loan.Status) {
        toast({
          title: "No changes made",
          description: "The status remains the same.",
        })
        onOpenChange(false)
        return
      }

      setIsSubmitting(true)

      // Call the parent component's handler
      await onStatusChange(status)

      toast({
        title: "Status updated",
        description: `Loan #${loan.EventID} status has been updated to ${status}.`,
      })

      onOpenChange(false)
    } catch (error) {
      console.error("Failed to update status:", error)
      toast({
        title: "Error",
        description: "Failed to update loan status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Loan Status</DialogTitle>
          <DialogDescription>
            Change the status for loan #{loan.EventID} requested by {loan.UserName}.
            {loan.Status === "pending" && " You can approve or reject this request."}
            {loan.Status === "approved" && " You can mark this loan as completed."}
            {loan.Status === "rejected" && " This rejected request cannot be changed."}
            {loan.Status === "completed" && " This completed loan cannot be changed."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {loan.Status === "pending" && (
                  <>
                    <SelectItem value="pending">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                        Pending
                      </div>
                    </SelectItem>
                    <SelectItem value="approved">
                      <div className="flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                        Approved
                      </div>
                    </SelectItem>
                    <SelectItem value="rejected">
                      <div className="flex items-center">
                        <XCircle className="mr-2 h-4 w-4 text-red-500" />
                        Rejected
                      </div>
                    </SelectItem>
                  </>
                )}
                {loan.Status === "approved" && (
                  <>
                    <SelectItem value="approved">
                      <div className="flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                        Approved
                      </div>
                    </SelectItem>
                    <SelectItem value="completed">
                      <div className="flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4 text-blue-500" />
                        Completed
                      </div>
                    </SelectItem>
                  </>
                )}
                {loan.Status === "rejected" && (
                  <SelectItem value="rejected">
                    <div className="flex items-center">
                      <XCircle className="mr-2 h-4 w-4 text-red-500" />
                      Rejected (Cannot be changed)
                    </div>
                  </SelectItem>
                )}
                {loan.Status === "completed" && (
                  <SelectItem value="completed">
                    <div className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-blue-500" />
                      Completed (Cannot be changed)
                    </div>
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
