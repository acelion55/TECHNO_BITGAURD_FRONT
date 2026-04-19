import { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Minus, Loader2, ChevronRight, Zap, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useStore from '../store/useStore';

const inputCls = 'w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder:text-zinc-500';
const labelCls = 'block text-zinc-400 text-xs font-medium mb-1.5 uppercase tracking-wider';

export default function WalletSetupPage() {
  const { user, fetchWallet } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading]       = useState(false);
  const [sugLoading, setSugLoading] = useState(false);
  const [error, setError]           = useState('');
  const [suggestion, setSuggestion] = useState(null);

  const fetchSuggestion = async () => {
    setSugLoading(true);
    try {
      const { data } = await api.get(`/wallet/suggest?amount=${monthly}`);
      setSuggestion(data);
      setRiskMode(data.riskMode || 'smart');
    } catch {}
    finally { setSugLoading(false); }
  };

  const [amount, setAmount]         = useState(1000);
  const [monthly, setMonthly]       = useState(10000);
  const [duration, setDuration]     = useState(12);
  const [frequency, setFrequency]   = useState('monthly');
  const [riskMode, setRiskMode]     = useState('smart');
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [scheduleDays, setScheduleDays] = useState(['MON']);
  const [scheduleDate, setScheduleDate] = useState(1);

  const toggleDay = (day) => {
    const days = scheduleDays.includes(day)
      ? scheduleDays.filter(d => d !== day)
      : [...scheduleDays, day];
    if (days.length > 0) setScheduleDays(days);
  };

  const WEEKDAYS = ['MON','TUE','WED','THU','FRI','SAT','SUN'];
  const WEEKDAY_LABELS = { MON:'Mon', TUE:'Tue', WED:'Wed', THU:'Thu', FRI:'Fri', SAT:'Sat', SUN:'Sun' };

  // Fetch AI suggestion on mount — REMOVED, now triggered by button
  const handleDeposit = async () => {
    setLoading(true); setError('');
    try {
      await api.post('/wallet/deposit', { amount: Number(amount), monthlyAmount: Number(monthly), frequency, durationMonths: Number(duration), riskMode, scheduleTime, scheduleDays, scheduleDate: Number(scheduleDate) });
      await fetchWallet();
      navigate('/');
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
    <div className="flex flex-col gap-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">Back to Dashboard</span>
        </button>
      </div>

      <div className="max-w-lg mx-auto w-full flex flex-col gap-4">

        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Wallet size={24} className="text-orange-400" />
          </div>
          <h1 className="text-white text-xl font-bold">Welcome, {user?.name}! 🎉</h1>
          <p className="text-zinc-400 text-sm mt-1">KYC verified. Add funds to activate your AI DCA agent.</p>
        </div>

        {/* AI Market Analysis */}
        <div className={`bg-zinc-900 border rounded-2xl p-5 ${
          suggestion?.priceSignal === 'DIP' ? 'border-emerald-500/30'
          : suggestion?.priceSignal === 'HIGH' ? 'border-red-500/30'
          : 'border-zinc-700'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap size={15} className="text-orange-400" />
              <span className="text-white font-semibold text-sm">AI Market Analysis</span>
            </div>
            {/* Analyse button — only show when not yet loaded or to refresh */}
            {!sugLoading && (
              <button onClick={fetchSuggestion}
                className="flex items-center gap-1.5 text-xs bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 px-3 py-1.5 rounded-lg transition-colors">
                <Zap size={11} />
                {suggestion ? 'Refresh' : 'Analyse Market'}
              </button>
            )}
            {sugLoading && <Loader2 size={13} className="text-zinc-500 animate-spin" />}
          </div>

          {sugLoading ? (
            <p className="text-zinc-500 text-sm">Analyzing market conditions...</p>
          ) : !suggestion ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <p className="text-zinc-500 text-sm text-center">Click "Analyse Market" to get AI-powered investment insights based on live BTC price and 7-day trend.</p>
              <button onClick={fetchSuggestion}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
                <Zap size={14} /> Analyse Market
              </button>
            </div>
          ) : (
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
              <div className="grid grid-cols-3 gap-1.5 mt-0.5">
                {['daily','weekly','monthly'].map(f => (
                  <button key={f} type="button" onClick={() => setFrequency(f)}
                    className={`py-2 rounded-lg text-xs font-medium border transition-all capitalize ${
                      frequency === f ? 'bg-orange-500/10 border-orange-500/40 text-orange-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                    }`}>
                    {f === 'daily' ? '📅' : f === 'weekly' ? '📆' : '🗓️'} {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Daily: time picker */}
          {frequency === 'daily' && (
            <div>
              <label className={labelCls}>Buy Time (IST)</label>
              <input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} className={inputCls} />
              <p className="text-zinc-500 text-xs mt-1">AI executes buy every day at this time</p>
            </div>
          )}

          {/* Weekly: weekday multi-select */}
          {frequency === 'weekly' && (
            <div>
              <label className={labelCls}>Buy Days</label>
              <div className="flex gap-2 flex-wrap">
                {WEEKDAYS.map(day => (
                  <button key={day} type="button" onClick={() => toggleDay(day)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                      scheduleDays.includes(day) ? 'bg-orange-500/10 border-orange-500/40 text-orange-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                    }`}>
                    {WEEKDAY_LABELS[day]}
                  </button>
                ))}
              </div>
              <p className="text-zinc-500 text-xs mt-1.5">{scheduleDays.length} day{scheduleDays.length !== 1 ? 's' : ''} selected</p>
            </div>
          )}

          {/* Monthly: date + duration side by side */}
          {frequency === 'monthly' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Buy Date</label>
                <select value={scheduleDate} onChange={e => setScheduleDate(Number(e.target.value))} className={inputCls}>
                  {Array.from({ length: 28 }, (_, i) => i + 1).map(d => (
                    <option key={d} value={d}>{d}{d===1?'st':d===2?'nd':d===3?'rd':'th'} of month</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Duration (months)</label>
                <input type="number" min={1} max={60} value={duration} onChange={e => setDuration(e.target.value)} className={inputCls} />
              </div>
            </div>
          )}

          {/* Duration for daily/weekly */}
          {frequency !== 'monthly' && (
            <div>
              <label className={labelCls}>Duration (months)</label>
              <input type="number" min={1} max={60} value={duration} onChange={e => setDuration(e.target.value)} className={inputCls} />
            </div>
          )}

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
