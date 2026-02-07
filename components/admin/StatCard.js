const StatCard = ({ label, value, trend, helper }) => {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          {label}
        </p>
        <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
      </div>
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-600">
          {trend}
        </span>
        <span className="text-slate-400">{helper}</span>
      </div>
    </div>
  );
};

export default StatCard;
