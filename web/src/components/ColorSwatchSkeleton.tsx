export default function ColorSwatchSkeleton() {
  return (
    <button className="text-center" disabled>
      <div className="aspect-square bg-surface rounded-xl mb-2 border-2 border-border/50 skeleton" />
      <div className="h-4 w-full skeleton rounded" />
    </button>
  );
}
