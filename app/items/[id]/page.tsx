"use client"

import { useState, useEffect,use } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, Edit, Package } from "lucide-react"
import { format } from "date-fns"
import { MotionDiv, fadeIn } from "@/components/animations/motion"
import { Skeleton } from "@/components/ui/skeleton"
import type { Item } from "@/types/item"
import type { LoanEvent } from "@/types/loan"
import axios from "axios"

export default function ItemDetailsPage({ params: _params }: { params: Promise<{ id: string }> }) {
  const params = use(_params);
  const [item, setItem] = useState<Item | null>(null)
  const [borrowHistory, setBorrowHistory] = useState<LoanEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchItemDetails = async () => {
      setIsLoading(true)
      try {
        // Simulate API delay
        const protectID = encodeURI(params.id)
        const res =await axios.get(`https://en-w-backend.onrender.com/admin/item/${protectID}`)

        setItem(res.data.item)
        setBorrowHistory(res.data)
      } catch (error) {
        console.error("Failed to fetch item details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchItemDetails()
  }, [params.id])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Completed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1">
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <Skeleton className="h-4 w-1/3 mt-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-64 w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <Skeleton className="h-[1px] w-full" />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-8 w-1/2 mt-1" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-8 w-1/2 mt-1" />
                  </div>
                </div>
                <Skeleton className="h-2.5 w-full rounded-full" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-16 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : item ? (
        <MotionDiv
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={fadeIn}
        >
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{item.Name}</CardTitle>
                  <Link href={`/items/edit/${params.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <CardDescription>{item.Category}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative aspect-square bg-muted rounded-md overflow-hidden">
                  {item.ImageUrl ? (
                    <Image src={item.ImageUrl || "/placeholder.svg"} alt={item.Name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Package className="h-12 w-12" />
                      <span className="sr-only">No image</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Description</div>
                  <p className="text-sm">{item.Description || "No description available"}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Quantity</div>
                    <div className="text-2xl font-bold">{item.MaxQuantity}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Available</div>
                    <div className="text-2xl font-bold">{item.CurrentQuantity}</div>
                  </div>
                </div>

                <div className="w-full bg-muted rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${(item.CurrentQuantity / item.MaxQuantity) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-center text-muted-foreground">
                  {item.CurrentQuantity} of {item.MaxQuantity} available (
                  {Math.round((item.CurrentQuantity / item.MaxQuantity) * 100)}%)
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Borrowing History</CardTitle>
                <CardDescription>Users who have borrowed this item</CardDescription>
              </CardHeader>
              <CardContent>
                {borrowHistory.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>All Borrowed Items</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {borrowHistory.map((event) => (
                        <TableRow key={event.EventID}>
                          <TableCell>
                            <Link href={`/users/${event.UserID}`} className="font-medium hover:underline">
                              {event.UserName}
                            </Link>
                          </TableCell>
                          <TableCell>{format(new Date(event.CreatedAt), "MMM d, yyyy")}</TableCell>
                          <TableCell>{getStatusBadge(event.Status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="flex -space-x-2 mr-2">
                                {event.Loan && event.Loan.slice(0, 2).map((item, index) => (
                                  <div
                                    key={item.ItemID}
                                    className="relative w-6 h-6 rounded-full border-2 border-background bg-muted overflow-hidden"
                                    style={{ zIndex: 2 - index }}
                                  >
                                    {item.ImageUrl ? (
                                      <Image
                                        src={item.ImageUrl || "/placeholder.svg"}
                                        alt={item.Name}
                                        fill
                                        className="object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                        {item.Name.charAt(0)}
                                      </div>
                                    )}
                                  </div>
                                ))}
                                {event.Loan &&event.Loan.length > 2 && (
                                  <div className="relative w-6 h-6 rounded-full border-2 border-background bg-gray-200 flex items-center justify-center text-xs">
                                    +{event.Loan.length - 2}
                                  </div>
                                )}
                              </div>
                              <span className="text-sm">
                                {event.Loan &&event.Loan.map((item, index) => (
                                  <span key={item.ItemID}>
                                    {index > 0 && ", "}
                                    <Link href={`/items/${item.ItemID}`} className="hover:underline">
                                      {item.Name}
                                    </Link>
                                    {item.Quantity > 1 ? ` (${item.Quantity})` : ""}
                                  </span>
                                ))}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">No borrowing history found</div>
                )}
              </CardContent>
            </Card>
          </div>
        </MotionDiv>
      ) : (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-lg font-medium">Item not found</p>
            <p className="text-muted-foreground">The requested item could not be found.</p>
          </div>
        </div>
      )}
    </div>
  )
}
