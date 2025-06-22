export function SkeletonTaskList() {
  return (
    <div className="flex flex-col gap-2">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="bg-card rounded-lg p-4 flex flex-col gap-2 animate-pulse">
          <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-muted rounded w-2/3 mb-1"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
          <div className="flex gap-2 mt-3">
            <div className="h-6 w-16 bg-muted rounded"></div>
            <div className="h-6 w-10 bg-muted rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}