export default function ProductCardSkeleton() {
  return (
    <div className="p-4 sm:p-6 text-center border border-border/50 rounded-xl">
      {/* Badge skeleton */}
      <div className="h-6 w-20 skeleton rounded-full mb-3" />

      {/* Image skeleton */}
      <div className="aspect-square bg-surface-alt rounded-xl mb-3 sm:mb-4 skeleton" />

      {/* Content skeleton */}
      <div className="h-6 w-3/4 skeleton rounded mx-auto mb-2" />
      <div className="h-4 w-1/2 skeleton rounded mx-auto mb-2" />
      <div className="h-6 w-1/3 skeleton rounded mx-auto mt-2" />
      <div className="h-4 w-2/3 skeleton rounded mx-auto mt-2 opacity-0" />
    </div>
  );
}
