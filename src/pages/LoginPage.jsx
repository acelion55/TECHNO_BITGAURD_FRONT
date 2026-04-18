import { useState } from 'react';
import { Bitcoin, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import useStore from '../store/useStore';

const inputCls = 'w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder:text-zinc-500';
const labelCls = 'block text-zinc-400 text-xs font-medium mb-1.5 uppercase tracking-wider';

export default function LoginPage({ onSwitch, switchLabel }) {
  const { login, forgotPassword, resetPassword, loading, error } = useStore();
  const [showMpin, setShowMpin] = useState(false);
  const [view, setView] = useState('login'); // 'login' | 'forgot' | 'reset'
  const [email, setEmail] = useState('');
  const [mpin, setMpin] = useState('');
  const [otp, setOtp] = useState('');
  const [newMpin, setNewMpin] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    login(email, mpin);
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    const msg = await forgotPassword(email);
    if (msg) { setMessage(msg); setView('reset'); }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    const msg = await resetPassword(email, otp, newMpin);
    if (msg) { setMessage(msg); setView('login'); }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bitcoin size={28} className="text-orange-400" />
          </div>
          <h1 className="text-white text-2xl font-bold">BitGuard <span className="text-orange-400">AI</span></h1>
          <p className="text-zinc-400 text-sm mt-1">
            {view === 'login' ? 'Login to your account' : view === 'forgot' ? 'Reset your MPIN' : 'Enter OTP'}
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

          {/* Back button for forgot/reset */}
          {view !== 'login' && (
            <button onClick={() => { setView('login'); setMessage(''); }}
              className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-sm mb-4 transition-colors">
              <ArrowLeft size={14} /> Back to Login
            </button>
          )}

          {/* Success message */}
          {message && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 mb-4">
              <p className="text-emerald-400 text-sm">{message}</p>
            </div>
          )}

          {/* LOGIN FORM */}
          {view === 'login' && (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label className={labelCls}>Email Address</label>
                <input type="email" placeholder="you@email.com" value={email}
                  onChange={(e) => setEmail(e.target.value)} required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>6-Digit MPIN</label>
                <div className="relative">
                  <input type={showMpin ? 'text' : 'password'} placeholder="••••••"
                    maxLength={6} value={mpin} onChange={(e) => setMpin(e.target.value)}
                    required className={inputCls + ' pr-12'} />
                  <button type="button" onClick={() => setShowMpin(!showMpin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                    {showMpin ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="button" onClick={() => setView('forgot')}
                className="text-right text-orange-400 hover:text-orange-300 text-xs transition-colors">
                Forgot MPIN?
              </button>

              {error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}

              <button type="submit" disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all">
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <p className="text-center text-zinc-500 text-sm">
                New here?{' '}
                <button type="button" onClick={onSwitch} className="text-orange-400 hover:text-orange-300 font-medium">{switchLabel || 'Create Account'}</button>
              </p>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {view === 'forgot' && (
            <form onSubmit={handleForgot} className="flex flex-col gap-4">
              <div>
                <label className={labelCls}>Registered Email</label>
                <input type="email" placeholder="you@email.com" value={email}
                  onChange={(e) => setEmail(e.target.value)} required className={inputCls} />
              </div>
              {error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all">
                {loading ? 'Sending OTP...' : 'Send OTP to Email'}
              </button>
            </form>
          )}

          {/* RESET PASSWORD FORM */}
          {view === 'reset' && (
            <form onSubmit={handleReset} className="flex flex-col gap-4">
              <div>
                <label className={labelCls}>OTP (sent to {email})</label>
                <input type="text" placeholder="6-digit OTP" maxLength={6} value={otp}
                  onChange={(e) => setOtp(e.target.value)} required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>New 6-Digit MPIN</label>
                <input type="password" placeholder="••••••" maxLength={6} value={newMpin}
                  onChange={(e) => setNewMpin(e.target.value)} required className={inputCls} />
              </div>
              {error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all">
                {loading ? 'Resetting...' : 'Reset MPIN'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
