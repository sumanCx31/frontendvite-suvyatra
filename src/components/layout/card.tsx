const StatCard = ({ title, value, change, icon }: any) => (
  <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
    <div className="flex justify-between mb-4">
      <div className="p-3 bg-white/5 rounded-xl text-emerald-400">{icon}</div>
      <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg">
        {change}
      </span>
    </div>
    <p className="text-slate-400 text-sm">{title}</p>
    <h3 className="text-3xl font-bold text-white">{value}</h3>
  </div>
);

export default StatCard;