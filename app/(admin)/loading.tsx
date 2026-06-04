export default function AdminLoading() {
  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200" />
          <div className="h-8 w-72 animate-pulse rounded-xl bg-slate-200" />
        </div>
        <div className="h-10 w-32 animate-pulse rounded-xl bg-slate-200" />
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="h-28 animate-pulse rounded-xl border border-slate-200 bg-white" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="h-96 animate-pulse rounded-xl border border-slate-200 bg-white lg:col-span-8" />
        <div className="h-96 animate-pulse rounded-xl border border-slate-200 bg-white lg:col-span-4" />
      </div>
    </div>
  );
}
