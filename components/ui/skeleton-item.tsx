import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export function SkeletonItem() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-[200px] w-full" />
      <CardContent className="p-3">
        <div className="flex justify-between items-start mb-1">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-7 w-7 rounded-full" />
        </div>
        <Skeleton className="h-4 w-1/3 mb-1" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full mt-1" />
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <Skeleton className="h-5 w-full" />
      </CardFooter>
    </Card>
  )
}
