export default function SkeletonCard() {
  return (
    <div className="bg-surface rounded-card shadow-card overflow-hidden animate-pulse">
      <div className="aspect-square bg-stone-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-stone-200 rounded-full w-3/4" />
        <div className="h-3 bg-stone-200 rounded-full w-full" />
        <div className="h-3 bg-stone-200 rounded-full w-2/3" />
        <div className="flex items-center justify-between pt-1">
          <div className="h-5 bg-stone-200 rounded-full w-1/3" />
          <div className="h-9 bg-stone-200 rounded-btn w-24" />
        </div>
      </div>
    </div>
  )
}
