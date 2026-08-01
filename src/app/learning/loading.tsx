import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LearningLoading() {
  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-8 w-full animate-pulse">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-80" />
        </div>
        <div className="flex gap-2 shrink-0">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-border/60 shadow-sm">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-10 w-16" />
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Topics Skeleton */}
      <div className="flex flex-col gap-4">
        <Skeleton className="h-7 w-48 mb-2" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="border-border/60 shadow-sm">
              <CardContent className="p-5 flex flex-col gap-4 h-full">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-2 w-full">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded-md shrink-0" />
                </div>
                
                <div className="mt-auto pt-2 flex justify-between items-center border-t border-border/40">
                  <Skeleton className="h-4 w-20 mt-2" />
                  <Skeleton className="h-5 w-16 rounded-md mt-2" />
                </div>
                
                <Skeleton className="h-8 w-full rounded-md mt-1" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
