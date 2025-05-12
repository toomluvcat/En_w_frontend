"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { LoanDetailsDialog } from "@/components/loan-details-dialog"
import { Eye, Upload } from "lucide-react"
import type { LoanEvent } from "@/types/loan"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { MotionDiv, fadeIn } from "@/components/animations/motion"
import axios from "axios"

interface UserData {
  UserID: number
  Name: string
  Major: string
  StudentID: string
  Email: string
  AvatarUrl?: string
  Event: LoanEvent[]
}

interface UserProfileProps {
  userId: string
}

export function UserProfile({ userId }: UserProfileProps) {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLoan, setSelectedLoan] = useState<LoanEvent | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    // In a real application, this would be an API call
    // For demo purposes, we're using mock data
    const fetchUserData = async () => {
      try {
        setIsLoading(true)
        const protectID = encodeURI(userId)
        const res = await axios.get(`https://en-w-backend.onrender.com/user/${protectID}`)


        setUserData(res.data)
      } catch (error) {
        console.error("Failed to fetch user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [userId])

  const handleViewLoanDetails = (loan: LoanEvent) => {
    setSelectedLoan(loan)
    setIsDetailsDialogOpen(true)
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    return
    // const file = e.target.files?.[0]
    // if (!file) return

    // try {
    //   setIsUploading(true)

    //   // Create form data
    //   const formData = new FormData()
    //   formData.append("avatar", file)

    //   // In a real application, this would be an API call
    //   // const response = await fetch(`/api/users/${userId}/avatar`, {
    //   //   method: "POST",
    //   //   body: formData,
    //   // })
    //   // const data = await response.json()

    //   // Simulate API call
    //   await new Promise((resolve) => setTimeout(resolve, 1000))

    //   // Update user data with new avatar URL
    //   // In a real app, this would come from the API response
    //   const mockAvatarUrl = URL.createObjectURL(file)

    //   if (userData) {
    //     setUserData({
    //       ...userData,
    //       AvatarUrl: mockAvatarUrl,
    //     })
    //   }

    //   toast({
    //     title: "Avatar updated",
    //     description: "Your profile picture has been updated successfully.",
    //   })
    // } catch (error) {
    //   console.error("Failed to upload avatar:", error)
    //   toast({
    //     title: "Error",
    //     description: "Failed to upload avatar. Please try again.",
    //     variant: "destructive",
    //   })
    // } finally {
    //   setIsUploading(false)
    // }
  }

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

  if (isLoading) {
    return (
      <MotionDiv className="space-y-6" initial="initial" animate="animate" exit="exit" variants={fadeIn}>
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-6 w-32" />
              </div>
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-6 w-48" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <Skeleton className="h-8 w-48 mb-4" />
          <Card>
            <div className="p-4">
              <Skeleton className="h-10 w-full mb-4" />
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full mb-4" />
              ))}
            </div>
          </Card>
        </div>
      </MotionDiv>
    )
  }

  if (!userData) {
    return (
      <div className="flex justify-center py-10">
        <div className="text-center">
          <p className="text-lg font-medium">User not found</p>
          <p className="text-muted-foreground">The requested user could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <MotionDiv className="space-y-6" initial="initial" animate="animate" exit="exit" variants={fadeIn}>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="relative group">
              <Avatar className="w-24 h-24 border">
                <AvatarImage src={userData.AvatarUrl || "/placeholder.svg"} alt={userData.Name} />
                <AvatarFallback className="text-2xl">{userData.Name.charAt(0)}</AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Upload className="h-6 w-6" />
                <span className="sr-only">Upload avatar</span>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
                disabled={isUploading}
              />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full">
                  <span className="text-xs">Uploading...</span>
                </div>
              )}
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl">{userData.Name}</CardTitle>
              <CardDescription className="text-base">{userData.Major}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Student ID</h3>
              <p>{userData.StudentID}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
              <p>{userData.Email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Loan History</h2>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userData.Event.length > 0 ? (
                userData.Event.map((event) => (
                  <TableRow key={event.EventID}>
                    <TableCell className="font-medium">{event.EventID}</TableCell>
                    <TableCell>{format(new Date(event.CreatedAt), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="flex -space-x-2 mr-2">
                          {event.Loan.slice(0, 2).map((item, index) => (
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
                          {event.Loan.length > 2 && (
                            <div className="relative w-8 h-8 rounded-full border-2 border-background bg-gray-200 flex items-center justify-center text-xs">
                              +{event.Loan.length - 2}
                            </div>
                          )}
                        </div>
                        <span>
                          {event.Loan.length === 1
                            ? `${event.Loan[0].Name} (${event.Loan[0].Quantity})`
                            : `${event.Loan.length} items borrowed`}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(event.Status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleViewLoanDetails(event)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No loan history found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {selectedLoan && (
        <LoanDetailsDialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen} loan={selectedLoan} />
      )}
    </MotionDiv>
  )
}
