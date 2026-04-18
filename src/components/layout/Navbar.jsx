import { Bitcoin, TrendingUp, LogOut } from 'lucide-react';
import useStore from '../../store/useStore';

export default function Navbar() {
  const { btcPrice, user, logout } = useStore();

  const priceINR = btcPrice?.inr;
  const priceUSD = btcPrice?.usd;
  const isFallback = btcPrice?.isFallback;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-6">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
          <Bitcoin size={18} className="text-white" />
        </div>
        <span className="text-white font-bold text-lg tracking-tight">BitGuard <span className="text-orange-400">AI</span></span>
      </div>

      {/* Live BTC Price */}
      <div className={`flex items-center gap-3 bg-zinc-900 border rounded-xl px-4 py-2 ${isFallback ? 'border-yellow-500/40' : 'border-zinc-700'}`}>
        <Bitcoin size={16} className="text-orange-400" />
        <div>
          <p className="text-white font-semibold text-sm leading-none">
            ₹{priceINR ? priceINR.toLocaleString('en-IN') : '—'}
          </p>
          <p className="text-zinc-400 text-xs mt-0.5">${priceUSD ? priceUSD.toLocaleString() : '—'}</p>
        </div>
        {isFallback ? (
          <span className="text-yellow-400 text-xs font-medium">⚠ CACHED</span>
        ) : (
          <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
            <TrendingUp size={12} />
            <span>LIVE</span>
          </div>
        )}
      </div>

      {/* User */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <span className="text-zinc-300 text-sm hidden sm:block">{user?.name || 'User'}</span>
        <button onClick={logout} title="Logout"
          className="text-zinc-500 hover:text-red-400 transition-colors ml-1">
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
