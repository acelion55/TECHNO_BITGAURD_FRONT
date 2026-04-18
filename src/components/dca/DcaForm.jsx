import { useState } from 'react';
import { Bot, Rocket } from 'lucide-react';
import useStore from '../../store/useStore';

const inputCls = 'w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder:text-zinc-500';
const labelCls = 'block text-zinc-400 text-xs font-medium mb-1.5 uppercase tracking-wider';

export default function DcaForm() {
  const { saveGoal, loading, error } = useStore();
  const [form, setForm] = useState({
    name: '', email: '', monthlyAmount: 10000,
    frequency: 'monthly', durationMonths: 12, riskMode: 'smart'
  });

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    saveGoal({ ...form, monthlyAmount: Number(form.monthlyAmount), durationMonths: Number(form.durationMonths) });
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bot size={28} className="text-orange-400" />
          </div>
          <h1 className="text-white text-2xl font-bold">BitGuard <span className="text-orange-400">AI</span></h1>
          <p className="text-zinc-400 text-sm mt-1">Set once. AI handles DCA + Tax optimization.</p>
        </div>

        <form onSubmit={submit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="text-white font-semibold text-base">Set Your Investment Goal</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Your Name</label>
              <input name="name" placeholder="Harsh" value={form.name} onChange={handle} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input name="email" type="email" placeholder="you@email.com" value={form.email} onChange={handle} required className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Monthly Amount (₹)</label>
            <input name="monthlyAmount" type="number" min="1000" value={form.monthlyAmount} onChange={handle} required className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Frequency</label>
              <select name="frequency" value={form.frequency} onChange={handle} className={inputCls}>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Duration (months)</label>
              <input name="durationMonths" type="number" min="1" max="60" value={form.durationMonths} onChange={handle} required className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Risk Mode</label>
            <div className="grid grid-cols-2 gap-3">
              {['smart', 'conservative'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setForm({ ...form, riskMode: mode })}
                  className={`py-3 rounded-xl text-sm font-medium border transition-all ${
                    form.riskMode === mode
                      ? 'bg-orange-500/10 border-orange-500/40 text-orange-400'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                  }`}
                >
                  {mode === 'smart' ? '⚡ Smart Dip' : '🛡️ Conservative'}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all duration-150 mt-1"
          >
            <Rocket size={16} />
            {loading ? 'Activating Agent...' : 'Activate Autonomous Agent'}
          </button>
        </form>
      </div>
    </div>
  );
}
