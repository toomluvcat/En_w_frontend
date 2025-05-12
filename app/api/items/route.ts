import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { uploadToBlob } from "@/lib/blob-utils"

const itemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
  maxQuantity: z.number().min(1),
  currentQuantity: z.number().min(0),
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Get file from form data
    const file = formData.get("file") as File | null

    // Get item data from form data
    const itemDataJson = formData.get("itemData") as string
    const itemData = JSON.parse(itemDataJson)

    // Validate item data
    const validatedData = itemSchema.parse(itemData)

    let imageUrl = ""

    // Upload file to Vercel Blob if provided
    if (file) {
      imageUrl = await uploadToBlob(file, "items")
    }

    // In a real application, you would save the item to your database here
    // For demo purposes, we're just returning the data

    return NextResponse.json({
      success: true,
      item: {
        ...validatedData,
        imageUrl,
      },
    })
  } catch (error) {
    console.error("Error creating item:", error)
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // In a real application, you would fetch items from your database
    // For demo purposes, we're returning mock data

    const mockItems = [
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
      // ... more items
    ]

    // Handle pagination
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "30")

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const paginatedItems = mockItems.slice(startIndex, endIndex)
    const totalItems = mockItems.length
    const totalPages = Math.ceil(totalItems / limit)

    return NextResponse.json({
      items: paginatedItems,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    })
  } catch (error) {
    console.error("Error fetching items:", error)
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 })
  }
}
