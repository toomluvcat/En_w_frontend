import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { UserProfile } from "@/components/user-profile"
import { MotionDiv, fadeIn } from "@/components/animations/motion"

export const metadata: Metadata = {
  title: "User Profile - Admin Dashboard",
  description: "View user details and loan history",
}

interface UserProfilePageProps {
  params: {
    id: string
  }
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  return (
    <MotionDiv
      className="container mx-auto py-10 px-6"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeIn}
    >
      <div className="flex items-center mb-6">
        <Link href="/loans">
          <Button variant="ghost" size="sm" className="gap-1">
            <ChevronLeft className="h-4 w-4" />
            Back to Loan History
          </Button>
        </Link>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">User Profile</h1>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <UserProfile userId={params.id} />
      </div>
    </MotionDiv>
  )
}
