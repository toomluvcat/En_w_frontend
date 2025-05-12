"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, ClipboardList } from "lucide-react"
import { ItemGrid } from "@/components/item-grid"
import { SearchAndFilter } from "@/components/search-and-filter"
import { MotionDiv, fadeIn } from "@/components/animations/motion"

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const handleFilter = (search: string, category: string) => {
    setSearchQuery(search)
    setCategoryFilter(category)
  }

  return (
    <MotionDiv
      className="container mx-auto py-10 px-4"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeIn}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">Item Management</h1>
        <div className="flex gap-2">
          <Link href="/loans">
            <Button variant="outline">
              <ClipboardList className="mr-2 h-4 w-4" />
              Loan History
            </Button>
          </Link>
          <Link href="/items/create">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Item
            </Button>
          </Link>
        </div>
      </div>
      <SearchAndFilter onFilter={handleFilter} />
      <div className="mt-6">
        <ItemGrid searchQuery={searchQuery} categoryFilter={categoryFilter} />
      </div>
    </MotionDiv>
  )
}
