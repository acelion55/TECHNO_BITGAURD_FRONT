import { useState } from 'react';
import { Bitcoin, CheckCircle, Loader2, Eye, EyeOff, ChevronRight, Shield, CreditCard, Wallet, Mail, User } from 'lucide-react';
import api from '../api/axios';
import useStore from '../store/useStore';

const STEPS = [
  { id: 1, label: 'PAN Verify',    icon: Shield },
  { id: 2, label: 'Aadhaar',       icon: User },
  { id: 3, label: 'Email & MPIN',  icon: Mail },
  { id: 4, label: 'Bank Details',  icon: CreditCard },
  { id: 5, label: 'Wallet',        icon: Wallet },
];

const inputCls = 'w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder:text-zinc-500';
const labelCls = 'block text-zinc-400 text-xs font-medium mb-1.5 uppercase tracking-wider';

export default function KycPage({ onComplete }) {
  const { login } = useStore();
  const [step, setStep]                   = useState(1);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');
  const [encSession, setEncSession]       = useState(null);
  const [kycData, setKycData]             = useState(null);
  const [verifiedName, setVerifiedName]   = useState('');
  const [showMpin, setShowMpin]           = useState(false);

  // Form states
  const [pan, setPan]                     = useState('');
  const [aadhaar, setAadhaar]             = useState('');
  const [email, setEmail]                 = useState('');
  const [otp, setOtp]                     = useState('');
  const [mpin, setMpin]                   = useState('');
  const [bankAccount, setBankAccount]     = useState('');
  const [ifsc, setIfsc]                   = useState('');
  const [bankHolder, setBankHolder]       = useState('');
  const [deposit, setDeposit]             = useState(500);
  const [goal, setGoal]                   = useState({ monthlyAmount: 10000, frequency: 'monthly', durationMonths: 12, riskMode: 'smart' });

  const call = async (fn) => {
    setLoading(true); setError('');
    try { await fn(); }
    catch (e) { setError(e.response?.data?.error || e.message); }
    finally { setLoading(false); }
  };

  // Step 1: PAN
  const handlePan = () => call(async () => {
    const { data } = await api.post('/kyc/pan', { pan: pan.toUpperCase() });
    setKycData(data.kycData);
    setEncSession(data.encryptedSession);
    setStep(2);
  });

  // Step 2: Aadhaar
  const handleAadhaar = () => call(async () => {
    const { data } = await api.post('/kyc/aadhaar', { aadhaar, encryptedSession: encSession });
    setVerifiedName(data.verifiedName);
    setEncSession(data.encryptedSession);
    setStep(3);
  });

  // Step 3a: Send OTP
  const handleSendOtp = () => call(async () => {
    const { data } = await api.post('/kyc/send-otp', { email, encryptedSession: encSession });
    setEncSession(data.encryptedSession);
  });

  // Step 3b: Verify OTP + MPIN
  const handleVerifyOtp = () => call(async () => {
    const { data } = await api.post('/kyc/verify-otp', { otp, mpin, encryptedSession: encSession });
    setEncSession(data.encryptedSession);
    setStep(4);
  });

  // Step 4: Bank (optional)
  const handleBank = (skip = false) => call(async () => {
    const { data } = await api.post('/kyc/bank', {
      skip,
      bankAccount: skip ? undefined : bankAccount,
      ifsc:        skip ? undefined : ifsc,
      bankHolderName: skip ? undefined : bankHolder,
      encryptedSession: encSession
    });
    setEncSession(data.encryptedSession);
    setStep(5);
  });

  // Step 5: Complete KYC + wallet deposit
  const handleComplete = () => call(async () => {
    const { data } = await api.post('/kyc/complete', {
      encryptedSession: encSession,
      depositAmount:    Number(deposit),
      ...goal
    });
    // Now login the user
    await login(data.user.email, mpin);
    onComplete?.();
  });

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Bitcoin size={24} className="text-orange-400" />
          </div>
          <h1 className="text-white text-xl font-bold">BitGuard AI — KYC Verification</h1>
          <p className="text-zinc-500 text-xs mt-1">Secure onboarding with AES-256 encryption</p>
        </div>

        {/* Step Progress */}
        <div className="flex items-center justify-between mb-6 px-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = step > s.id;
            const active = step === s.id;
            return (
              <div key={s.id} className="flex items-center">
                <div className={`flex flex-col items-center gap-1`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    done   ? 'bg-emerald-500 text-white' :
                    active ? 'bg-orange-500 text-white' :
                             'bg-zinc-800 text-zinc-500'
                  }`}>
                    {done ? <CheckCircle size={14} /> : <Icon size={14} />}
                  </div>
                  <span className={`text-xs hidden sm:block ${active ? 'text-orange-400' : done ? 'text-emerald-400' : 'text-zinc-600'}`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-0.5 w-8 sm:w-12 mx-1 mb-4 ${step > s.id ? 'bg-emerald-500' : 'bg-zinc-700'}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* ── STEP 1: PAN ── */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-white font-semibold text-base">Step 1: PAN Verification</h2>
                <p className="text-zinc-500 text-xs mt-1">Enter your 10-digit PAN number. We'll fetch your KYC details.</p>
              </div>
              <div>
                <label className={labelCls}>PAN Number</label>
                <input value={pan} onChange={e => setPan(e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F" maxLength={10}
                  className={inputCls + ' uppercase tracking-widest font-mono'} />
              </div>
              <Btn onClick={handlePan} loading={loading} label="Fetch PAN Details" />
            </div>
          )}

          {/* ── STEP 2: AADHAAR ── */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-white font-semibold text-base">Step 2: Aadhaar Verification</h2>
                <p className="text-zinc-500 text-xs mt-1">Name on Aadhaar must match PAN.</p>
              </div>
              {kycData && (
                <div className="bg-zinc-800 rounded-xl p-4 flex flex-col gap-2 text-sm">
                  <p className="text-zinc-400 text-xs uppercase tracking-wider mb-1">PAN Details Fetched</p>
                  <Row label="Name"        value={kycData.fullName} />
                  <Row label="DOB"         value={kycData.dob} />
                  <Row label="Father Name" value={kycData.fatherName} />
                  <Row label="Gender"      value={kycData.gender} />
                </div>
              )}
              <div>
                <label className={labelCls}>Aadhaar Number (12 digits)</label>
                <input value={aadhaar} onChange={e => setAadhaar(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456789012" maxLength={12}
                  className={inputCls + ' font-mono tracking-widest'} />
              </div>
              <Btn onClick={handleAadhaar} loading={loading} label="Verify Aadhaar" />
            </div>
          )}

          {/* ── STEP 3: EMAIL + OTP + MPIN ── */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-white font-semibold text-base">Step 3: Email & MPIN Setup</h2>
                {verifiedName && <p className="text-emerald-400 text-xs mt-1">✓ KYC verified for: <strong>{verifiedName}</strong></p>}
              </div>
              <div>
                <label className={labelCls}>Email Address</label>
                <div className="flex gap-2">
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@email.com" className={inputCls} />
                  <button onClick={handleSendOtp} disabled={loading || !email}
                    className="bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 text-white text-xs px-4 rounded-xl whitespace-nowrap transition-colors">
                    {loading ? <Loader2 size={14} className="animate-spin" /> : 'Send OTP'}
                  </button>
                </div>
              </div>
              <div>
                <label className={labelCls}>OTP (sent to email)</label>
                <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="6-digit OTP"
                  maxLength={6} className={inputCls + ' font-mono tracking-widest'} />
              </div>
              <div>
                <label className={labelCls}>Set 6-Digit MPIN</label>
                <div className="relative">
                  <input type={showMpin ? 'text' : 'password'} value={mpin}
                    onChange={e => setMpin(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••" maxLength={6} className={inputCls + ' pr-12 font-mono tracking-widest'} />
                  <button type="button" onClick={() => setShowMpin(!showMpin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
                    {showMpin ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <Btn onClick={handleVerifyOtp} loading={loading} label="Verify OTP & Continue" />
            </div>
          )}

          {/* ── STEP 4: BANK DETAILS ── */}
          {step === 4 && (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-white font-semibold text-base">Step 4: Bank Details</h2>
                <p className="text-zinc-500 text-xs mt-1">Optional — required for withdrawals. All data encrypted.</p>
              </div>
              <div>
                <label className={labelCls}>Account Holder Name</label>
                <input value={bankHolder} onChange={e => setBankHolder(e.target.value)}
                  placeholder={verifiedName} className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Account Number</label>
                  <input value={bankAccount} onChange={e => setBankAccount(e.target.value)}
                    placeholder="1234567890" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>IFSC Code</label>
                  <input value={ifsc} onChange={e => setIfsc(e.target.value.toUpperCase())}
                    placeholder="SBIN0001234" className={inputCls + ' uppercase'} />
                </div>
              </div>
              <Btn onClick={() => handleBank(false)} loading={loading} label="Save Bank Details" />
              <button onClick={() => handleBank(true)} className="text-zinc-500 hover:text-zinc-300 text-sm text-center transition-colors">
                Skip for now (limited access)
              </button>
            </div>
          )}

          {/* ── STEP 5: WALLET + GOAL ── */}
          {step === 5 && (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-white font-semibold text-base">Step 5: Activate Wallet</h2>
                <p className="text-zinc-500 text-xs mt-1">Add minimum ₹100 to unlock full access — DCA, Tax Optimizer, AI Agent.</p>
              </div>

              <div>
                <label className={labelCls}>Deposit Amount (₹)</label>
                <input type="number" min={100} value={deposit} onChange={e => setDeposit(e.target.value)}
                  className={inputCls} />
                <div className="flex gap-2 mt-2">
                  {[100, 500, 1000, 5000].map(a => (
                    <button key={a} onClick={() => setDeposit(a)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${deposit == a ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}>
                      ₹{a}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-zinc-800 rounded-xl p-4 flex flex-col gap-3">
                <p className="text-zinc-400 text-xs uppercase tracking-wider">DCA Goal</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Monthly Amount (₹)</label>
                    <input type="number" value={goal.monthlyAmount}
                      onChange={e => setGoal({...goal, monthlyAmount: Number(e.target.value)})}
                      className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Duration (months)</label>
                    <input type="number" value={goal.durationMonths}
                      onChange={e => setGoal({...goal, durationMonths: Number(e.target.value)})}
                      className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Risk Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['smart', 'conservative'].map(m => (
                      <button key={m} onClick={() => setGoal({...goal, riskMode: m})}
                        className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${goal.riskMode === m ? 'bg-orange-500/10 border-orange-500/40 text-orange-400' : 'bg-zinc-700 border-zinc-600 text-zinc-400'}`}>
                        {m === 'smart' ? '⚡ Smart Dip' : '🛡️ Conservative'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 text-xs text-emerald-400">
                ✓ KYC Complete &nbsp;|&nbsp; ✓ AES-256 Encrypted &nbsp;|&nbsp; ✓ Full Access on Deposit
              </div>

              <Btn onClick={handleComplete} loading={loading} label="🚀 Activate Full Access" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const Btn = ({ onClick, loading, label }) => (
  <button onClick={onClick} disabled={loading}
    className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all">
    {loading ? <Loader2 size={16} className="animate-spin" /> : <ChevronRight size={16} />}
    {loading ? 'Processing...' : label}
  </button>
);

const Row = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-zinc-500">{label}</span>
    <span className="text-white font-medium">{value}</span>
  </div>
);
