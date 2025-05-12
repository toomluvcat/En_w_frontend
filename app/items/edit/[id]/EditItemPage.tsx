"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { ItemForm } from "@/components/item-form"
import type { Item } from "@/types/item"
import { MotionDiv, fadeIn } from "@/components/animations/motion"
import axios from "axios"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { string } from "zod"

export default function EditItemPage() {
  const [itemEdit, setItemEdit] = useState<Item>()
  const params =useParams()
  const id =params?.id as string

  useEffect(() => {
    const fetchData = async () => {
      try {
        const protectID = encodeURIComponent(id)
        const res = await axios.get(`https://en-w-backend.onrender.com/admin/item/${protectID}`)
        setItemEdit(res.data.item)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [params.id])

  return (
    <MotionDiv className="container mx-auto py-10" initial="initial" animate="animate" exit="exit" variants={fadeIn}>
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1">
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Edit Item</h1>
      </div>
      <div className="max-w-2xl mx-auto">
        <ItemForm initialData={itemEdit} />
      </div>
    </MotionDiv>
  )
}
