export default function ClientLoading() {
  return (
    <div className="min-h-[70vh] bg-slate-50 px-6 pt-32">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="h-4 w-32 animate-pulse rounded-full bg-fluxion-rose/20" />
        <div className="space-y-4">
          <div className="h-12 w-full max-w-xl animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-12 w-full max-w-md animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-4 w-full max-w-2xl animate-pulse rounded-full bg-slate-200" />
          <div className="h-4 w-full max-w-lg animate-pulse rounded-full bg-slate-200" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white" />
          ))}
        </div>
      </div>
    </div>
  );
}
