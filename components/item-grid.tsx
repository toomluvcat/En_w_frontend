"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react"
import { DeleteItemDialog } from "@/components/delete-item-dialog"
import { useRouter } from "next/navigation"
import { MotionDiv, fadeIn, staggerContainer, itemAnimation } from "@/components/animations/motion"
import { SkeletonItem } from "@/components/ui/skeleton-item"
import axios from "axios"

export function ItemGrid({
  searchQuery = "",
  categoryFilter = "all",
}: { searchQuery?: string; categoryFilter?: string }) {
  const [items, setItems] = useState<Item[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const itemsPerPage = 15 // Increased from 12 to 15 to show 3 rows of 5 items
  const router = useRouter()

interface Item {
  ItemID: number
  Name: string
  Description: string
  ImageUrl: string
  Bookmarks: boolean
  Category: string
  MaxQuantity: number
  CurrentQuantity: number
}


  useEffect(() => {
    // In a real application, this would be an API call with pagination
    // For demo purposes, we're using mock data
    const fetchItems = async () => {
      setIsLoading(true)
      try {
        // Simulate API delay
        const res =await axios.get("https://en-w-backend.onrender.com/admin/item")

        setItems(res.data)
        setTotalPages(Math.ceil(res.data.length / itemsPerPage))
      } catch (error) {
        console.error("Failed to fetch items:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchItems()
  }, [])

  // Apply filters to the items
  const filteredItems = items.filter((item) => {
    // Apply search filter
    const matchesSearch =
      searchQuery === "" ||
      item.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.Description && item.Description.toLowerCase().includes(searchQuery.toLowerCase()))

    // Apply category filter
    const matchesCategory =
      categoryFilter === "all" || (item.Category && item.Category.toLowerCase() === categoryFilter.toLowerCase())

    return matchesSearch && matchesCategory
  })

  const handleDeleteClick = (itemId: number) => {
    setSelectedItemId(itemId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (selectedItemId) {
      try {
        // In a real application, this would be an API call
        // await fetch(`/api/items/${selectedItemId}`, { method: 'DELETE' })

        // Update local state
        setItems(items.filter((item) => item.ItemID !== selectedItemId))
        setIsDeleteDialogOpen(false)
        setSelectedItemId(null)
      } catch (error) {
        console.error("Failed to delete item:", error)
      }
    }
  }

  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  useEffect(() => {
    setTotalPages(Math.ceil(filteredItems.length / itemsPerPage))
    setCurrentPage(1) // Reset to first page when filters change
  }, [filteredItems.length, itemsPerPage])

  return (
    <MotionDiv className="px-4 py-6" initial="initial" animate="animate" exit="exit" variants={fadeIn}>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 15 }).map((_, index) => (
            <SkeletonItem key={index} />
          ))}
        </div>
      ) : (
        <>
          <MotionDiv
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            variants={staggerContainer}
          >
            {paginatedItems.length > 0 ? (
              paginatedItems.map((item,index) => (
                <MotionDiv key={index} variants={itemAnimation}>
                  <Card
                    className="overflow-hidden cursor-pointer transition-all hover:shadow-md"
                    onClick={() => router.push(`/items/${item.ItemID}`)}
                  >
                    <div className="relative aspect-square bg-muted">
                      {item.ImageUrl ? (
                        <Image
                          src={item.ImageUrl || "/placeholder.svg"}
                          alt={item.Name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium text-base truncate">{item.Name}</h3>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                            <Link href={`/items/${item.ItemID}`}>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                            </Link>
                            <Link href={`/items/edit/${item.ItemID}`}>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteClick(item.ItemID)
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <Badge variant="outline" className="mb-1 text-xs">
                        {item.Category}
                      </Badge>
                      <p className="text-xs text-muted-foreground line-clamp-2 h-8">
                        {item.Description || "No description available"}
                      </p>
                    </CardContent>
                    <CardFooter className="p-3 pt-0 flex justify-between">
                      <div className="w-full text-center">
                        <div className="text-sm font-medium">
                          <span className="text-base">{item.CurrentQuantity}</span>
                          <span className="text-muted-foreground"> / {item.MaxQuantity}</span>
                          <span className="block text-xs text-muted-foreground">available</span>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </MotionDiv>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No items found.</p>
              </div>
            )}
          </MotionDiv>

          {totalPages > 1 && (
            <Pagination className="mt-8">
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

                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(i + 1)
                      }}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

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
      <DeleteItemDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </MotionDiv>
  )
}
