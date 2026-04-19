import { useState } from 'react';
import { Bot, Rocket } from 'lucide-react';
import useStore from '../../store/useStore';

const inputCls = 'w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder:text-zinc-500';
const labelCls = 'block text-zinc-400 text-xs font-medium mb-1.5 uppercase tracking-wider';

const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const WEEKDAY_LABELS = { MON: 'Mon', TUE: 'Tue', WED: 'Wed', THU: 'Thu', FRI: 'Fri', SAT: 'Sat', SUN: 'Sun' };

export default function DcaForm() {
  const { saveGoal, loading, error } = useStore();
  const [form, setForm] = useState({
    name: '', email: '', monthlyAmount: 10000,
    frequency: 'monthly', durationMonths: 12, riskMode: 'smart',
    scheduleTime: '09:00', scheduleDays: ['MON'], scheduleDate: 1,
  });

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleDay = (day) => {
    const days = form.scheduleDays.includes(day)
      ? form.scheduleDays.filter(d => d !== day)
      : [...form.scheduleDays, day];
    if (days.length > 0) setForm({ ...form, scheduleDays: days });
  };

  const submit = (e) => {
    e.preventDefault();
    saveGoal({
      ...form,
      monthlyAmount: Number(form.monthlyAmount),
      durationMonths: Number(form.durationMonths),
      scheduleDate: Number(form.scheduleDate),
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
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
            <label className={labelCls}>Investment Amount (₹)</label>
            <input name="monthlyAmount" type="number" min="100" value={form.monthlyAmount} onChange={handle} required className={inputCls} />
          </div>

          {/* Frequency selector */}
          <div>
            <label className={labelCls}>Frequency</label>
            <div className="grid grid-cols-3 gap-2">
              {['daily', 'weekly', 'monthly'].map(f => (
                <button key={f} type="button"
                  onClick={() => setForm({ ...form, frequency: f })}
                  className={`py-2.5 rounded-xl text-sm font-medium border transition-all capitalize ${
                    form.frequency === f
                      ? 'bg-orange-500/10 border-orange-500/40 text-orange-400'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                  }`}>
                  {f === 'daily' ? '📅 Daily' : f === 'weekly' ? '📆 Weekly' : '🗓️ Monthly'}
                </button>
              ))}
            </div>
          </div>

          {/* Daily → show time picker */}
          {form.frequency === 'daily' && (
            <div>
              <label className={labelCls}>Buy Time (IST)</label>
              <input name="scheduleTime" type="time" value={form.scheduleTime} onChange={handle} className={inputCls} />
              <p className="text-zinc-500 text-xs mt-1">AI will execute buy every day at this time</p>
            </div>
          )}

          {/* Weekly → show weekday multi-select */}
          {form.frequency === 'weekly' && (
            <div>
              <label className={labelCls}>Buy Days</label>
              <div className="flex gap-2 flex-wrap">
                {WEEKDAYS.map(day => (
                  <button key={day} type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                      form.scheduleDays.includes(day)
                        ? 'bg-orange-500/10 border-orange-500/40 text-orange-400'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                    }`}>
                    {WEEKDAY_LABELS[day]}
                  </button>
                ))}
              </div>
              <p className="text-zinc-500 text-xs mt-1.5">
                {form.scheduleDays.length} day{form.scheduleDays.length !== 1 ? 's' : ''} selected — AI buys on each selected day
              </p>
            </div>
          )}

          {/* Monthly → show date picker + duration */}
          {form.frequency === 'monthly' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Buy Date (1–28)</label>
                <select name="scheduleDate" value={form.scheduleDate}
                  onChange={e => setForm({ ...form, scheduleDate: Number(e.target.value) })}
                  className={inputCls}>
                  {Array.from({ length: 28 }, (_, i) => i + 1).map(d => (
                    <option key={d} value={d}>{d}{d === 1 ? 'st' : d === 2 ? 'nd' : d === 3 ? 'rd' : 'th'} of every month</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Duration (months)</label>
                <input name="durationMonths" type="number" min="1" max="60"
                  value={form.durationMonths} onChange={handle} required className={inputCls} />
              </div>
            </div>
          )}

          {/* Duration for daily/weekly */}
          {form.frequency !== 'monthly' && (
            <div>
              <label className={labelCls}>Duration (months)</label>
              <input name="durationMonths" type="number" min="1" max="60"
                value={form.durationMonths} onChange={handle} required className={inputCls} />
            </div>
          )}

          <div>
            <label className={labelCls}>Risk Mode</label>
            <div className="grid grid-cols-2 gap-3">
              {['smart', 'conservative'].map((mode) => (
                <button key={mode} type="button"
                  onClick={() => setForm({ ...form, riskMode: mode })}
                  className={`py-3 rounded-xl text-sm font-medium border transition-all ${
                    form.riskMode === mode
                      ? 'bg-orange-500/10 border-orange-500/40 text-orange-400'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                  }`}>
                  {mode === 'smart' ? '⚡ Smart Dip' : '🛡️ Conservative'}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all duration-150 mt-1">
            <Rocket size={16} />
            {loading ? 'Activating Agent...' : 'Activate Autonomous Agent'}
          </button>
        </form>
      </div>
    </div>
  );
}
