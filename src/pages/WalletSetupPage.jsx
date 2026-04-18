import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, Minus, Loader2, ChevronRight, Zap } from 'lucide-react';
import api from '../api/axios';
import useStore from '../store/useStore';

const inputCls = 'w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder:text-zinc-500';
const labelCls = 'block text-zinc-400 text-xs font-medium mb-1.5 uppercase tracking-wider';

export default function WalletSetupPage() {
  const { user, restoreSession } = useStore();
  const [loading, setLoading]       = useState(false);
  const [sugLoading, setSugLoading] = useState(true);
  const [error, setError]           = useState('');
  const [suggestion, setSuggestion] = useState(null);

  const [amount, setAmount]         = useState(1000);
  const [monthly, setMonthly]       = useState(10000);
  const [duration, setDuration]     = useState(12);
  const [frequency, setFrequency]   = useState('monthly');
  const [riskMode, setRiskMode]     = useState('smart');

  // Fetch AI suggestion on mount
  useEffect(() => {
    api.get(`/wallet/suggest?amount=${monthly}`)
      .then(({ data }) => { setSuggestion(data); setRiskMode(data.riskMode || 'smart'); })
      .catch(() => {})
      .finally(() => setSugLoading(false));
  }, []);

  const handleDeposit = async () => {
    setLoading(true); setError('');
    try {
      await api.post('/wallet/deposit', { amount: Number(amount), monthlyAmount: Number(monthly), frequency, durationMonths: Number(duration), riskMode });
      await restoreSession(); // refresh user state with hasFullAccess: true
    } catch (e) {
      setError(e.response?.data?.error || 'Deposit failed');
      setLoading(false);
    }
  };

  const signalColor = {
    DIP:     'text-emerald-400',
    HIGH:    'text-red-400',
    NEUTRAL: 'text-yellow-400'
  }[suggestion?.priceSignal] || 'text-zinc-400';

  const SignalIcon = suggestion?.priceSignal === 'DIP' ? TrendingDown : suggestion?.priceSignal === 'HIGH' ? TrendingUp : Minus;

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg flex flex-col gap-4">

        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Wallet size={24} className="text-orange-400" />
          </div>
          <h1 className="text-white text-xl font-bold">Welcome, {user?.name}! 🎉</h1>
          <p className="text-zinc-400 text-sm mt-1">KYC verified. Add funds to activate your AI DCA agent.</p>
        </div>

        {/* AI Market Suggestion */}
        <div className={`bg-zinc-900 border rounded-2xl p-5 ${suggestion?.priceSignal === 'DIP' ? 'border-emerald-500/30' : suggestion?.priceSignal === 'HIGH' ? 'border-red-500/30' : 'border-zinc-700'}`}>
          <div className="flex items-center gap-2 mb-3">
            <Zap size={15} className="text-orange-400" />
            <span className="text-white font-semibold text-sm">AI Market Analysis</span>
            {sugLoading && <Loader2 size={13} className="text-zinc-500 animate-spin ml-auto" />}
          </div>

          {sugLoading ? (
            <p className="text-zinc-500 text-sm">Analyzing market conditions...</p>
          ) : suggestion ? (
            <>
              <div className={`flex items-center gap-2 mb-2 ${signalColor}`}>
                <SignalIcon size={16} />
                <span className="font-bold text-sm">{suggestion.priceSignal} — {suggestion.suggestion}</span>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed mb-3">{suggestion.reasoning}</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-zinc-800 rounded-lg p-2 text-center">
                  <p className="text-zinc-500">BTC Price</p>
                  <p className="text-white font-semibold">₹{suggestion.currentPrice?.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-zinc-800 rounded-lg p-2 text-center">
                  <p className="text-zinc-500">7-Day Avg</p>
                  <p className="text-white font-semibold">₹{suggestion.avg7d?.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-zinc-800 rounded-lg p-2 text-center">
                  <p className="text-zinc-500">Suggested</p>
                  <p className={`font-semibold ${signalColor}`}>₹{suggestion.recommendedAmount?.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </>
          ) : (
            <p className="text-zinc-500 text-sm">Market data unavailable. You can still proceed.</p>
          )}
        </div>

        {/* Setup Form */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-4">
          <p className="text-white font-semibold text-sm">Set Up Your Investment</p>

          {/* Wallet Deposit */}
          <div>
            <label className={labelCls}>Wallet Deposit (₹) — min ₹100</label>
            <input type="number" min={100} value={amount} onChange={e => setAmount(e.target.value)} className={inputCls} />
            <div className="flex gap-2 mt-2">
              {[500, 1000, 5000, 10000].map(a => (
                <button key={a} onClick={() => setAmount(a)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${amount == a ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}>
                  ₹{a.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          {/* Monthly DCA Amount */}
          <div>
            <label className={labelCls}>Monthly DCA Amount (₹)</label>
            <input type="number" min={100} value={monthly} onChange={e => setMonthly(e.target.value)} className={inputCls} />
            {suggestion?.recommendedAmount && (
              <p className="text-zinc-500 text-xs mt-1">
                AI suggests: <button onClick={() => setMonthly(suggestion.recommendedAmount)} className="text-orange-400 hover:underline">₹{suggestion.recommendedAmount?.toLocaleString('en-IN')}</button>
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Duration (months)</label>
              <input type="number" min={1} max={60} value={duration} onChange={e => setDuration(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Frequency</label>
              <select value={frequency} onChange={e => setFrequency(e.target.value)} className={inputCls}>
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Risk Mode</label>
            <div className="grid grid-cols-2 gap-2">
              {['smart', 'conservative'].map(m => (
                <button key={m} onClick={() => setRiskMode(m)}
                  className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${riskMode === m ? 'bg-orange-500/10 border-orange-500/40 text-orange-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}>
                  {m === 'smart' ? '⚡ Smart Dip' : '🛡️ Conservative'}
                </button>
              ))}
            </div>
            {suggestion?.riskMode && (
              <p className="text-zinc-500 text-xs mt-1">AI recommends: <span className="text-orange-400">{suggestion.riskMode}</span> mode based on current market</p>
            )}
          </div>

          {error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}

          <button onClick={handleDeposit} disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <ChevronRight size={16} />}
            {loading ? 'Activating...' : '🚀 Activate Full Access'}
          </button>

          <p className="text-zinc-600 text-xs text-center">Simulated UPI payment • All data AES-256 encrypted</p>
        </div>
      </div>
    </div>
  );
}
