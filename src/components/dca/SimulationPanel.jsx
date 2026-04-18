import { Zap, Clock } from 'lucide-react';
import useStore from '../../store/useStore';
import ReasoningBox from '../common/ReasoningBox';
import LoadingSpinner from '../common/LoadingSpinner';

export default function SimulationPanel() {
  const { simulateBuy, loading, aiDecision, portfolio, btcPrice } = useStore();

  const recentTxs = portfolio?.transactions
    ? [...portfolio.transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)
    : [];

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={simulateBuy}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all text-base"
      >
        <Zap size={18} />
        {loading ? 'AI is Thinking...' : 'Simulate Next Buy'}
      </button>

      {loading && <LoadingSpinner text="AI agent analyzing market conditions..." />}

      {aiDecision && !loading && <ReasoningBox aiDecision={aiDecision} />}

      {recentTxs.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={15} className="text-zinc-500" />
            <h3 className="text-white font-semibold text-sm">Recent Simulations</h3>
          </div>
          <div className="flex flex-col gap-2">
            {recentTxs.map((tx, i) => (
              <div key={tx._id || i} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
                <div>
                  <p className="text-white text-sm font-medium">₹{tx.amountINR?.toLocaleString('en-IN')}</p>
                  <p className="text-zinc-500 text-xs">{new Date(tx.date).toLocaleDateString('en-IN')}</p>
                </div>
                <div className="text-right">
                  <p className="text-orange-400 text-sm font-medium">₿{tx.btcAmount?.toFixed(6)}</p>
                  <p className="text-zinc-500 text-xs">@ ₹{tx.pricePerBtc?.toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
