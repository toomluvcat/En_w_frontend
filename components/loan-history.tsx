"use client"

import { useState, useEffect, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { UpdateStatusDialog } from "@/components/update-status-dialog"
import { LoanDetailsDialog } from "@/components/loan-details-dialog"
import type { LoanEvent } from "@/types/loan"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Clock, XCircle } from "lucide-react"
import { LoanHistoryItem } from "@/components/loan-history-item"
import { DatePicker } from "@/components/ui/date-picker"
import { MotionDiv, fadeIn } from "@/components/animations/motion"
import { format, isEqual, startOfDay } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { SkeletonTableRow } from "@/components/ui/skeleton-table-row"
import { toast } from "@/components/ui/use-toast"
import axios from "axios"

export function LoanHistory() {
  const [allLoans, setAllLoans] = useState<LoanEvent[]>([])
  const [filteredLoans, setFilteredLoans] = useState<LoanEvent[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState<LoanEvent | null>(null)
  const loansPerPage = 10
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilters, setActiveFilters] = useState<{
    search: boolean
    status: boolean
    date: boolean
  }>({
    search: false,
    status: false,
    date: false,
  })

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setIsLoading(true)

        const res = await axios.get("https://en-w-backend.onrender.com/event")

        // ตรวจสอบว่า res.data มีค่าและเป็น array หรือไม่
        if (res.data && Array.isArray(res.data)) {
          setAllLoans(res.data)
          setFilteredLoans(res.data)
          setTotalPages(Math.ceil(res.data.length / loansPerPage))
        } else {
          // กรณีข้อมูลเป็น null หรือไม่ใช่ array
          console.warn("API returned no data or invalid data format")
          setAllLoans([])
          setFilteredLoans([])
          setTotalPages(1)
          
          // แสดงข้อความแจ้งเตือนผู้ใช้
          toast({
            title: "No loan data available",
            description: "Could not retrieve loan history at this time.",
            variant: "destructive"
          })
        }
      } catch (error) {
        console.error("Failed to fetch loans:", error)
        
        // แสดงข้อความแจ้งเตือนข้อผิดพลาด
        toast({
          title: "Error loading data",
          description: "There was a problem fetching the loan history. Please try again later.",
          variant: "destructive"
        })
        
        // เซ็ตค่าเริ่มต้นเมื่อเกิดข้อผิดพลาด
        setAllLoans([])
        setFilteredLoans([])
        setTotalPages(1)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLoans()
  }, [])

  // Apply filters whenever filter values change
  useEffect(() => {
    applyFilters()
  }, [searchQuery, statusFilter, selectedDate, allLoans])

  const applyFilters = () => {
    // ตรวจสอบว่า allLoans เป็น array หรือไม่
    if (!allLoans || !Array.isArray(allLoans)) {
      setFilteredLoans([])
      setTotalPages(1)
      return
    }
    
    let result = [...allLoans]
    const activeFilterState = {
      search: false,
      status: false,
      date: false,
    }

    // Apply search filter
    if (searchQuery.trim() !== "") {
      activeFilterState.search = true
      result = result.filter((loan) => {
        // ตรวจสอบว่า UserName มีค่าหรือไม่
        if (!loan.UserName) return false
        return loan.UserName.toLowerCase().includes(searchQuery.toLowerCase())
      })
    }

    // Apply status filter
    if (statusFilter !== "all") {
      activeFilterState.status = true
      result = result.filter((loan) => {
        // ตรวจสอบว่า Status มีค่าหรือไม่
        if (!loan.Status) return false
        return loan.Status === statusFilter
      })
    }

    // Apply date filter
    if (selectedDate) {
      activeFilterState.date = true
      const filterDate = startOfDay(selectedDate)

      result = result.filter((loan) => {
        // ตรวจสอบว่า CreatedAt มีค่าหรือไม่
        if (!loan.CreatedAt) return false
        
        try {
          const loanDate = startOfDay(new Date(loan.CreatedAt))
          return isEqual(loanDate, filterDate)
        } catch (error) {
          console.error("Invalid date format:", loan.CreatedAt)
          return false
        }
      })
    }

    setActiveFilters(activeFilterState)
    setFilteredLoans(result)
    setTotalPages(Math.max(1, Math.ceil(result.length / loansPerPage)))
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleStatusUpdate = (loan: LoanEvent) => {
    // ตรวจสอบว่า loan และ Status มีค่าหรือไม่
    if (!loan || !loan.Status) {
      toast({
        title: "Cannot update status",
        description: "Invalid loan data.",
        variant: "destructive",
      })
      return
    }
    
    // Don't allow status updates for rejected or completed loans
    if (loan.Status === "rejected") {
      toast({
        title: "Cannot update status",
        description: "Rejected loans cannot have their status changed.",
        variant: "destructive",
      })
      return
    }

    if (loan.Status === "completed") {
      toast({
        title: "Cannot update status",
        description: "Completed loans cannot have their status changed.",
        variant: "destructive",
      })
      return
    }

    setSelectedLoan(loan)
    setIsStatusDialogOpen(true)
  }

  const handleViewDetails = (loan: LoanEvent) => {
    setSelectedLoan(loan)
    setIsDetailsDialogOpen(true)
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedLoan || !selectedLoan.EventID) {
      toast({
        title: "Error",
        description: "Cannot update status: Invalid loan data.",
        variant: "destructive",
      })
      return
    }
    
    try {
      // In a real application, this would be an API call
      // const response = await fetch(`/api/loans/${selectedLoan.EventID}/status`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ Status: newStatus })
      // })

      // ตรวจสอบว่า allLoans เป็น array หรือไม่
      if (!Array.isArray(allLoans)) {
        throw new Error("Invalid loan data structure")
      }

      // Update local state
      const updatedLoans = allLoans.map((loan) =>
        loan.EventID === selectedLoan.EventID
          ? { ...loan, Status: newStatus, ApprovedAt: new Date().toISOString() }
          : loan
      )

      setAllLoans(updatedLoans)
      // Filters will be reapplied automatically due to the useEffect dependency

      toast({
        title: "Status updated",
        description: `Loan status has been updated to ${newStatus}.`,
      })

      setIsStatusDialogOpen(false)
    } catch (error) {
      console.error("Failed to update loan status:", error)
      toast({
        title: "Error",
        description: "Failed to update loan status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const clearFilter = (filterType: "search" | "status" | "date") => {
    if (filterType === "search") {
      setSearchQuery("")
    } else if (filterType === "status") {
      setStatusFilter("all")
    } else if (filterType === "date") {
      setSelectedDate(undefined)
    }
  }

  const clearAllFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setSelectedDate(undefined)
  }

  const paginatedLoans = useMemo(() => {
    // ตรวจสอบว่า filteredLoans เป็น array หรือไม่
    if (!filteredLoans || !Array.isArray(filteredLoans)) {
      return []
    }
    
    const startIndex = (currentPage - 1) * loansPerPage
    const endIndex = startIndex + loansPerPage
    
    // ตรวจสอบว่า startIndex และ endIndex ถูกต้อง
    if (startIndex < 0 || startIndex >= filteredLoans.length) {
      return []
    }
    
    return filteredLoans.slice(startIndex, endIndex)
  }, [filteredLoans, currentPage, loansPerPage])

  return (
    <MotionDiv initial="initial" animate="animate" exit="exit" variants={fadeIn} className="space-y-6">
      <div className="bg-muted/30 p-6 rounded-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            applyFilters()
          }}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by borrower name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="w-full md:w-[180px]">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center">All Statuses</div>
                </SelectItem>
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
                <SelectItem value="completed">
                  <div className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-blue-500" />
                    Completed
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-[180px]">
            <DatePicker date={selectedDate} setDate={setSelectedDate} />
          </div>
          <Button type="submit">Apply Filters</Button>
        </form>
      </div>

      {/* Active filters */}
      {(activeFilters.search || activeFilters.status || activeFilters.date) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>

          {activeFilters.search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {searchQuery}
              <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter("search")} />
            </Badge>
          )}

          {activeFilters.status && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status: {statusFilter}
              <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter("status")} />
            </Badge>
          )}

          {activeFilters.date && selectedDate && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Date: {format(selectedDate, "MMM d, yyyy")}
              <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter("date")} />
            </Badge>
          )}

          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-7 px-2 text-xs">
            Clear all
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Borrower</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Requested Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 10 }).map((_, index) => (
                <SkeletonTableRow key={index} columns={6} />
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <>
          <div className="rounded-md border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Borrower</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Requested Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLoans.length > 0 ? (
                  paginatedLoans.map((loan) => (
                    <LoanHistoryItem
                      key={loan.EventID}
                      loan={loan}
                      onViewDetails={handleViewDetails}
                      onUpdateStatus={handleStatusUpdate}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No loan records found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage > 1) setCurrentPage(currentPage - 1)
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  // Show pagination numbers around the current page
                  let pageNum = i + 1
                  if (totalPages > 5) {
                    if (currentPage > 3) {
                      pageNum = currentPage - 3 + i
                    }
                    if (currentPage > totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    }
                  }

                  return (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(pageNum)
                        }}
                        isActive={currentPage === pageNum}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}

      {selectedLoan && (
        <>
          <UpdateStatusDialog
            open={isStatusDialogOpen}
            onOpenChange={setIsStatusDialogOpen}
            loan={selectedLoan}
            onStatusChange={handleStatusChange}
          />
          <LoanDetailsDialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen} loan={selectedLoan} />
        </>
      )}
    </MotionDiv>
  )
}
