import { type NextRequest, NextResponse } from "next/server"
import { uploadToBlob } from "@/lib/blob-utils"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const formData = await request.formData()
    const file = formData.get("avatar") as File | null

    if (!file) {
      return NextResponse.json({ error: "No avatar file provided" }, { status: 400 })
    }

    // Upload avatar to Vercel Blob
    const imageUrl = await uploadToBlob(file, "avatars")

    // In a real application, you would update the user's avatar in your database
    // For demo purposes, we're just returning the URL

    return NextResponse.json({
      success: true,
      avatarUrl: imageUrl,
    })
  } catch (error) {
    console.error(`Error uploading avatar for user ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to upload avatar" }, { status: 500 })
  }
}
