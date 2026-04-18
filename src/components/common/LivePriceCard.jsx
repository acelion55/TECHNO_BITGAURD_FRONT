import { Bitcoin, RefreshCw, AlertCircle } from 'lucide-react';
import useStore from '../../store/useStore';

export default function LivePriceCard() {
  const { btcPrice, fetchPrice } = useStore();
  const isFallback = btcPrice?.isFallback;

  return (
    <div className={`bg-gradient-to-br from-orange-500/10 to-yellow-500/5 border rounded-2xl p-5 ${
      isFallback ? 'border-yellow-500/30' : 'border-orange-500/20'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bitcoin size={18} className="text-orange-400" />
          <span className="text-zinc-300 text-sm font-medium">Bitcoin (BTC)</span>
        </div>
        <button onClick={fetchPrice} className="text-zinc-500 hover:text-zinc-300 transition-colors">
          <RefreshCw size={14} />
        </button>
      </div>

      <p className="text-white text-3xl font-bold tracking-tight">
        ₹{btcPrice?.inr ? btcPrice.inr.toLocaleString('en-IN') : '—'}
      </p>
      <p className="text-zinc-400 text-sm mt-1">
        ${btcPrice?.usd ? btcPrice.usd.toLocaleString() : '—'} USD
      </p>

      <div className="mt-3 flex items-center gap-1.5">
        {isFallback ? (
          <>
            <AlertCircle size={12} className="text-yellow-400" />
            <span className="text-yellow-400 text-xs font-medium">CoinGecko unavailable — showing cached price</span>
          </>
        ) : (
          <>
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-400 text-xs font-medium">Live • Updates every 30s</span>
          </>
        )}
      </div>
    </div>
  );
}
