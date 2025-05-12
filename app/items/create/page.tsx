import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { ItemForm } from "@/components/item-form"
import { MotionDiv, fadeIn } from "@/components/animations/motion"

export const metadata: Metadata = {
  title: "Create New Item",
  description: "Add a new item to the inventory",
}

export default function CreateItemPage() {
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
        <h1 className="text-3xl font-bold">Create New Item</h1>
      </div>
      <div className="max-w-2xl mx-auto">
        <ItemForm />
      </div>
    </MotionDiv>
  )
}
