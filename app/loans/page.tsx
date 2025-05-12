import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { LoanHistory } from "@/components/loan-history"
import { LoanStatistics } from "@/components/loan-statistics"
import { MotionDiv, fadeIn } from "@/components/animations/motion"

export const metadata: Metadata = {
  title: "Loan History - Admin Dashboard",
  description: "View and manage item loan history",
}

export default function LoanHistoryPage() {
  return (
    <MotionDiv
      className="container mx-auto py-10 px-6"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeIn}
    >
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1">
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold">Loan History</h1>
      </div>
{/* 
      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <LoanStatistics />
      </div> */}

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <LoanHistory />
      </div>
    </MotionDiv>
  )
}
