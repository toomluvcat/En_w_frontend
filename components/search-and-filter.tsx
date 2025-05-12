"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, SlidersHorizontal } from "lucide-react"

const TOOL_CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "hand-tools", label: "Hand Tools" },
  { value: "power-tools", label: "Power Tools" },
  { value: "measuring-tools", label: "Measuring Tools" },
  { value: "cutting-tools", label: "Cutting Tools" },
  { value: "electrical", label: "Electrical" },
  { value: "plumbing", label: "Plumbing" },
  { value: "safety", label: "Safety Equipment" },
  { value: "boards", label: "Electronic Boards" },
  { value: "components", label: "Electronic Components" },
]

interface SearchAndFilterProps {
  onFilter: (searchQuery: string, category: string) => void
}

export function SearchAndFilter({ onFilter }: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("all")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onFilter(searchQuery, category)
  }

  return (
    <div className="bg-muted/40 p-4 rounded-lg">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="w-full md:w-64">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {TOOL_CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="shrink-0">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </form>
    </div>
  )
}
