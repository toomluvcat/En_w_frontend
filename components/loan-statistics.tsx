"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, CheckCircle, Clock } from "lucide-react"
import { MotionDiv, MotionUl, MotionLi, fadeIn, staggerContainer, itemAnimation } from "@/components/animations/motion"

export function LoanStatistics() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    completed: 0,
    todayRequests: 0,
    weeklyAverage: 0,
    mostBorrowedItem: { name: "", count: 0 },
    topBorrower: { name: "", count: 0 },
  })

  useEffect(() => {
    // In a real application, this would be an API call
    // For demo purposes, we're using mock data
    const fetchStats = async () => {
      try {
        // This would be replaced with an actual API call
        const mockStats = {
          total: 25,
          pending: 6,
          approved: 8,
          rejected: 4,
          completed: 7,
          todayRequests: 3,
          weeklyAverage: 12,
          mostBorrowedItem: { name: "Power Drill", count: 8 },
          topBorrower: { name: "Kritsada beapthong", count: 5 },
        }

        setStats(mockStats)
      } catch (error) {
        console.error("Failed to fetch loan statistics:", error)
      }
    }

    fetchStats()
  }, [])

  return (
    <MotionDiv className="space-y-6" initial="initial" animate="animate" variants={fadeIn}>
      <MotionUl className="grid grid-cols-1 md:grid-cols-5 gap-4" variants={staggerContainer}>
        <MotionLi variants={itemAnimation}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-4xl font-bold">{stats.total}</CardTitle>
              <CardDescription>Total Loans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <BarChart className="h-4 w-4" />
                  <span>{stats.weeklyAverage} weekly</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </MotionLi>

        <MotionLi variants={itemAnimation}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-4xl font-bold">{stats.pending}</CardTitle>
              <CardDescription>Pending</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span>{stats.todayRequests} today</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </MotionLi>

        <MotionLi variants={itemAnimation}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-4xl font-bold">{stats.approved}</CardTitle>
              <CardDescription>Approved</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Active loans</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </MotionLi>

        <MotionLi variants={itemAnimation}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-4xl font-bold">{stats.completed}</CardTitle>
              <CardDescription>Completed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  <span>Returned items</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </MotionLi>

        <MotionLi variants={itemAnimation}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-4xl font-bold">{stats.mostBorrowedItem.count}</CardTitle>
              <CardDescription>Top Item</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground truncate">
                <span>{stats.mostBorrowedItem.name}</span>
              </div>
            </CardContent>
          </Card>
        </MotionLi>
      </MotionUl>
    </MotionDiv>
  )
}
