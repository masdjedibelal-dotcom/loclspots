export default function EntdeckenLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-9 w-40 animate-pulse rounded bg-sage/20" />
        <div className="mt-2 h-5 w-64 animate-pulse rounded bg-sage/10" />
      </div>
      <div className="flex gap-2 border-b border-sage/20 pb-4">
        <div className="h-10 w-24 animate-pulse rounded-lg bg-sage/20" />
        <div className="h-10 w-24 animate-pulse rounded-lg bg-sage/10" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-48 animate-pulse rounded-xl bg-sage/10" />
        ))}
      </div>
    </div>
  );
}
