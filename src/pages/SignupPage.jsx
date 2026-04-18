import { useState } from 'react';
import { Bitcoin, Eye, EyeOff } from 'lucide-react';
import useStore from '../store/useStore';

const inputCls = 'w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder:text-zinc-500';
const labelCls = 'block text-zinc-400 text-xs font-medium mb-1.5 uppercase tracking-wider';

export default function SignupPage({ onSwitch }) {
  const { signup, loading, error } = useStore();
  const [showMpin, setShowMpin] = useState(false);
  const [showKyc, setShowKyc] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', mpin: '',
    pan: '', aadhaar: '', bankAccount: '', ifsc: '',
    monthlyAmount: 10000, frequency: 'monthly',
    durationMonths: 12, riskMode: 'smart'
  });

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    signup({ ...form, monthlyAmount: Number(form.monthlyAmount), durationMonths: Number(form.durationMonths) });
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bitcoin size={28} className="text-orange-400" />
          </div>
          <h1 className="text-white text-2xl font-bold">Create Account</h1>
          <p className="text-zinc-400 text-sm mt-1">BitGuard AI — Autonomous Bitcoin DCA</p>
        </div>

        <form onSubmit={submit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">

          {/* Basic Info */}
          <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">Basic Info</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Full Name</label>
              <input name="name" placeholder="Harsh Vardhan" value={form.name} onChange={handle} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Phone Number</label>
              <input name="phone" placeholder="9876543210" value={form.phone} onChange={handle} required className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Email Address</label>
            <input name="email" type="email" placeholder="you@email.com" value={form.email} onChange={handle} required className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>6-Digit MPIN</label>
            <div className="relative">
              <input
                name="mpin" type={showMpin ? 'text' : 'password'}
                placeholder="••••••" maxLength={6} pattern="\d{6}"
                value={form.mpin} onChange={handle} required className={inputCls + ' pr-12'}
              />
              <button type="button" onClick={() => setShowMpin(!showMpin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                {showMpin ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-zinc-600 text-xs mt-1">Used to login — like a PIN for your account</p>
          </div>

          {/* DCA Goal */}
          <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold mt-2">Investment Goal</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Monthly Amount (₹)</label>
              <input name="monthlyAmount" type="number" min="500" value={form.monthlyAmount} onChange={handle} required className={inputCls} />
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

          {/* KYC Toggle */}
          <button type="button" onClick={() => setShowKyc(!showKyc)}
            className="text-left text-zinc-500 text-xs uppercase tracking-wider font-semibold flex items-center gap-2 mt-1">
            <span>{showKyc ? '▼' : '▶'}</span> KYC Details (Optional)
          </button>

          {showKyc && (
            <div className="flex flex-col gap-4 bg-zinc-800/50 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>PAN Number</label>
                  <input name="pan" placeholder="ABCDE1234F" value={form.pan} onChange={handle} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Aadhaar Number</label>
                  <input name="aadhaar" placeholder="1234 5678 9012" maxLength={12} value={form.aadhaar} onChange={handle} className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Bank Account</label>
                  <input name="bankAccount" placeholder="Account number" value={form.bankAccount} onChange={handle} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>IFSC Code</label>
                  <input name="ifsc" placeholder="SBIN0001234" value={form.ifsc} onChange={handle} className={inputCls} />
                </div>
              </div>
            </div>
          )}

          {error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all mt-1">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <p className="text-center text-zinc-500 text-sm">
            Already have an account?{' '}
            <button type="button" onClick={onSwitch} className="text-orange-400 hover:text-orange-300 font-medium">Login</button>
          </p>
        </form>
      </div>
    </div>
  );
}
