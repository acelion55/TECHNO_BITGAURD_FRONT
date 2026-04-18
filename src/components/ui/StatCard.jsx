export default function StatCard({ label, value, sub, accent = false, icon: Icon }) {
  return (
    <div className={`bg-zinc-900 border rounded-2xl p-5 flex flex-col gap-2 ${accent ? 'border-orange-500/30' : 'border-zinc-800'}`}>
      <div className="flex items-center justify-between">
        <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider">{label}</span>
        {Icon && <Icon size={16} className="text-zinc-600" />}
      </div>
      <p className="text-white text-2xl font-bold tracking-tight">{value}</p>
      {sub && <div className="text-zinc-500 text-xs">{sub}</div>}
    </div>
  );
}
