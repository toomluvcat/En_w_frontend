import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { z } from "zod"

const itemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
  maxQuantity: z.number().min(1),
  currentQuantity: z.number().min(0),
})

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // In a real application, you would fetch the item from your database
    // For demo purposes, we're returning mock data

    const mockItem = {
      ItemID: Number.parseInt(id),
      Name: "Hammer",
      Description: "",
      ImageUrl: "https://res.cloudinary.com/dtpph38t4/image/upload/v1746868206/my_items/EN.W2.png",
      Bookmarks: false,
      Category: "Power tool",
      MaxQuantity: 7,
      CurrentQuantity: 6,
    }

    return NextResponse.json(mockItem)
  } catch (error) {
    console.error(`Error fetching item ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch item" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const formData = await request.formData()

    // Get file from form data
    const file = formData.get("file") as File | null

    // Get item data from form data
    const itemDataJson = formData.get("itemData") as string
    const itemData = JSON.parse(itemDataJson)

    // Validate item data
    const validatedData = itemSchema.parse(itemData)

    let imageUrl = itemData.imageUrl || ""

    // Upload file to Vercel Blob if provided
    if (file) {
      const blob = await put(`items/${id}-${file.name}`, file, {
        access: "public",
      })
      imageUrl = blob.url
    }

    // In a real application, you would update the item in your database here
    // For demo purposes, we're just returning the data

    return NextResponse.json({
      success: true,
      item: {
        ItemID: Number.parseInt(id),
        ...validatedData,
        ImageUrl: imageUrl,
      },
    })
  } catch (error) {
    console.error(`Error updating item ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // In a real application, you would:
    // 1. Get the item from your database to get the image URL
    // 2. Delete the image from Vercel Blob if it exists
    // 3. Delete the item from your database

    // For demo purposes, we're just returning success

    return NextResponse.json({
      success: true,
      message: `Item ${id} deleted successfully`,
    })
  } catch (error) {
    console.error(`Error deleting item ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 })
  }
}
