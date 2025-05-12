import { put } from "@vercel/blob"

/**
 * Uploads a file to Vercel Blob storage
 * @param file The file to upload
 * @param folder The folder to store the file in (e.g., 'items', 'users')
 * @returns The URL of the uploaded file
 */
export async function uploadToBlob(file: File, folder = "items") {
  try {
    // Generate a unique filename to avoid collisions
    const uniqueFilename = `${folder}/${Date.now()}-${file.name}`

    // Upload the file to Vercel Blob
    const blob = await put(uniqueFilename, file, {
      access: "public",
    })

    return blob.url
  } catch (error) {
    console.error("Error uploading to Blob:", error)
    throw new Error("Failed to upload file")
  }
}

/**
 * Extracts the filename from a Blob URL
 * @param url The Blob URL
 * @returns The filename
 */
export function getFilenameFromBlobUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    // Extract the filename from the path
    const filename = pathname.split("/").pop() || "unknown"
    return filename
  } catch (error) {
    return "unknown"
  }
}
