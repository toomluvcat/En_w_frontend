"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Edit, MoreHorizontal, Trash2 } from "lucide-react"
import { DeleteItemDialog } from "@/components/delete-item-dialog"
import { SkeletonTableRow } from "@/components/ui/skeleton-table-row"
import type { Item } from "@/types/item"

export function ItemsTable() {
  const [items, setItems] = useState<Item[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const itemsPerPage = 30

  useEffect(() => {
    // In a real application, this would be an API call with pagination
    // For demo purposes, we're using mock data
    const fetchItems = async () => {
      setIsLoading(true)
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // This would be replaced with an actual API call
        const mockItems: Item[] = [
          {
            ItemID: 1,
            Name: "Hammer",
            Description: "",
            ImageUrl: "",
            Bookmarks: false,
            Category: "",
            MaxQuantity: 7,
            CurrentQuantity: 6,
          },
          {
            ItemID: 2,
            Name: "้hammer",
            Description: "",
            ImageUrl: "https://res.cloudinary.com/dtpph38t4/image/upload/v1746868206/my_items/EN.W2.png",
            Bookmarks: false,
            Category: "Power tool",
            MaxQuantity: 1,
            CurrentQuantity: 1,
          },
          {
            ItemID: 4,
            Name: "้hammer123",
            Description: "",
            ImageUrl: "https://res.cloudinary.com/dtpph38t4/image/upload/v1746868206/my_items/EN.W2.png",
            Bookmarks: false,
            Category: "Power tool",
            MaxQuantity: 1,
            CurrentQuantity: 1,
          },
          {
            ItemID: 5,
            Name: "้hammer1234",
            Description: "",
            ImageUrl: "https://res.cloudinary.com/dtpph38t4/image/upload/v1746868206/my_items/EN.W2.png",
            Bookmarks: false,
            Category: "Power tool",
            MaxQuantity: 1,
            CurrentQuantity: 1,
          },
          {
            ItemID: 6,
            Name: "้hammer1234546",
            Description: "",
            ImageUrl: "https://res.cloudinary.com/dtpph38t4/image/upload/v1746868206/my_items/EN.W2.png",
            Bookmarks: false,
            Category: "Power tool",
            MaxQuantity: 1,
            CurrentQuantity: 1,
          },
          {
            ItemID: 7,
            Name: "board arduino",
            Description: "",
            ImageUrl: "https://res.cloudinary.com/dtpph38t4/image/upload/v1746888042/my_items/EN.W1.png",
            Bookmarks: false,
            Category: "board",
            MaxQuantity: 10,
            CurrentQuantity: 10,
          },
          {
            ItemID: 8,
            Name: "board arduino754",
            Description: "",
            ImageUrl: "https://res.cloudinary.com/dtpph38t4/image/upload/v1746888042/my_items/EN.W1.png",
            Bookmarks: false,
            Category: "board",
            MaxQuantity: 10,
            CurrentQuantity: 10,
          },
          {
            ItemID: 9,
            Name: "Hamer Jiant",
            Description: "",
            ImageUrl: "https://res.cloudinary.com/dtpph38t4/image/upload/v1746888132/my_items/EN.W3%20basket.png",
            Bookmarks: false,
            Category: "Hamer",
            MaxQuantity: 1,
            CurrentQuantity: 1,
          },
          {
            ItemID: 10,
            Name: "Test Item",
            Description: "",
            ImageUrl: "https://res.cloudinary.com/dtpph38t4/image/upload/v1746888132/my_items/EN.W3%20basket.png",
            Bookmarks: false,
            Category: "Test",
            MaxQuantity: 1,
            CurrentQuantity: 1,
          },
          {
            ItemID: 11,
            Name: "Kanomru",
            Description: "",
            ImageUrl: "https://res.cloudinary.com/dtpph38t4/image/upload/v1746888132/my_items/EN.W3%20basket.png",
            Bookmarks: false,
            Category: "Kanomru",
            MaxQuantity: 1,
            CurrentQuantity: 1,
          },
        ]

        setItems(mockItems)
        setTotalPages(Math.ceil(mockItems.length / itemsPerPage))
      } catch (error) {
        console.error("Failed to fetch items:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchItems()
  }, [])

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

  const paginatedItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-center">Available</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Show skeleton rows while loading
              Array.from({ length: 10 }).map((_, index) => <SkeletonTableRow key={index} columns={7} />)
            ) : paginatedItems.length > 0 ? (
              paginatedItems.map((item) => (
                <TableRow key={item.ItemID}>
                  <TableCell className="font-medium">{item.ItemID}</TableCell>
                  <TableCell>
                    {item.ImageUrl ? (
                      <div className="relative h-10 w-10 rounded-md overflow-hidden">
                        <Image
                          src={item.ImageUrl || "/placeholder.svg"}
                          alt={item.Name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                        No img
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{item.Name}</TableCell>
                  <TableCell>{item.Category || "—"}</TableCell>
                  <TableCell className="text-center">{item.MaxQuantity}</TableCell>
                  <TableCell className="text-center">{item.CurrentQuantity}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link href={`/items/edit/${item.ItemID}`}>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteClick(item.ItemID)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && !isLoading && (
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

      <DeleteItemDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
