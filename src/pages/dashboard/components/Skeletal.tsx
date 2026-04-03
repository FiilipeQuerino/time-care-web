export const DashboardSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="bg-white border border-slate-100 rounded-2xl p-5 space-y-4">
          <div className="h-8 w-8 bg-slate-200 rounded-xl"></div>
          <div className="h-4 w-24 bg-slate-200 rounded"></div>
          <div className="h-7 w-32 bg-slate-200 rounded"></div>
        </div>
      ))}
    </div>
    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 space-y-3">
      <div className="h-5 w-40 bg-slate-200 rounded"></div>
      <div className="h-4 w-56 bg-slate-200 rounded"></div>
      <div className="h-4 w-52 bg-slate-200 rounded"></div>
    </div>
  </div>
);

export const ClientsSkeleton = () => (
  <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 animate-pulse">
    <div className="h-6 w-36 bg-slate-200 rounded mb-4"></div>
    <div className="space-y-3">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="border border-slate-100 rounded-xl p-4 space-y-2">
          <div className="h-4 w-40 bg-slate-200 rounded"></div>
          <div className="h-3 w-56 bg-slate-200 rounded"></div>
          <div className="h-3 w-32 bg-slate-200 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

export const ProceduresSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="bg-white rounded-[2rem] border border-slate-100 p-6 space-y-3">
      <div className="h-5 w-44 bg-slate-200 rounded"></div>
      <div className="h-10 w-full bg-slate-200 rounded-xl"></div>
      <div className="h-10 w-full bg-slate-200 rounded-xl"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {[1, 2, 3].map((item) => (
        <div key={item} className="bg-white border border-slate-100 rounded-2xl p-4 space-y-2">
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
          <div className="h-4 w-28 bg-slate-200 rounded"></div>
          <div className="h-4 w-24 bg-slate-200 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);
