import { useState } from 'react';
import { Bitcoin, CheckCircle, Loader2, Eye, EyeOff, ChevronRight, Shield, CreditCard, UserCheck, Mail, User } from 'lucide-react';
import api from '../api/axios';
import useStore from '../store/useStore';

const STEPS = [
  { id: 1, label: 'PAN',     icon: Shield },
  { id: 2, label: 'Aadhaar', icon: UserCheck },
  { id: 3, label: 'Email',   icon: Mail },
  { id: 4, label: 'Bank',    icon: CreditCard },
  { id: 5, label: 'Done',    icon: User },
];

const inputCls = 'w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder:text-zinc-500';
const labelCls = 'block text-zinc-400 text-xs font-medium mb-1.5 uppercase tracking-wider';

export default function KycPage({ onComplete }) {
  const { login } = useStore();
  const [step, setStep]                 = useState(1);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [encSession, setEncSession]     = useState(null);
  const [kycData, setKycData]           = useState(null);
  const [verifiedName, setVerifiedName] = useState('');
  const [showMpin, setShowMpin]         = useState(false);
  const [otpSent, setOtpSent]           = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const [pan, setPan]           = useState('');
  const [aadhaar, setAadhaar]   = useState('');
  const [email, setEmail]       = useState('');
  const [otp, setOtp]           = useState('');
  const [mpin, setMpin]         = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [ifsc, setIfsc]         = useState('');
  const [bankHolder, setBankHolder]   = useState('');

  const call = async (fn) => {
    setLoading(true); setError('');
    try { await fn(); }
    catch (e) { setError(e.response?.data?.error || e.message); }
    finally { setLoading(false); }
  };

  const handlePan = () => call(async () => {
    const { data } = await api.post('/kyc/pan', { pan: pan.toUpperCase() });
    setKycData(data.kycData);
    setEncSession(data.encryptedSession);
    setStep(2);
  });

  const handleAadhaar = () => call(async () => {
    const { data } = await api.post('/kyc/aadhaar', { aadhaar, encryptedSession: encSession });
    setVerifiedName(data.verifiedName);
    setEncSession(data.encryptedSession);
    setStep(3);
  });

  const handleSendOtp = () => call(async () => {
    const { data } = await api.post('/kyc/send-otp', { email, encryptedSession: encSession });
    setEncSession(data.encryptedSession);
    setOtpSent(true);
  });

  const handleVerifyOtp = () => call(async () => {
    const { data } = await api.post('/kyc/verify-otp', { otp, mpin, encryptedSession: encSession });
    setEncSession(data.encryptedSession);
    setStep(4);
  });

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

  const handleComplete = () => call(async () => {
    const { data } = await api.post('/kyc/complete', { encryptedSession: encSession });
    setRegisteredEmail(data.user.email);
    // Auto-login after registration
    await login(data.user.email, mpin);
    onComplete?.(); // This will switch back to login view, then user will be logged in
  });

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Bitcoin size={24} className="text-orange-400" />
          </div>
          <h1 className="text-white text-xl font-bold">BitGuard AI — KYC Verification</h1>
          <p className="text-zinc-500 text-xs mt-1">Secure onboarding • AES-256 encrypted</p>
        </div>

        {/* Step Progress */}
        <div className="flex items-center justify-between mb-6 px-1">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = step > s.id;
            const active = step === s.id;
            return (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${done ? 'bg-emerald-500 text-white' : active ? 'bg-orange-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                    {done ? <CheckCircle size={14} /> : <Icon size={14} />}
                  </div>
                  <span className={`text-xs hidden sm:block ${active ? 'text-orange-400' : done ? 'text-emerald-400' : 'text-zinc-600'}`}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`h-0.5 w-8 sm:w-14 mx-1 mb-4 ${step > s.id ? 'bg-emerald-500' : 'bg-zinc-700'}`} />}
              </div>
            );
          })}
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4"><p className="text-red-400 text-sm">{error}</p></div>}

          {/* STEP 1: PAN */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-white font-semibold">Step 1: PAN Verification</h2>
                <p className="text-zinc-500 text-xs mt-1">Enter your 10-digit PAN. We'll fetch your KYC details via AI.</p>
              </div>
              <div>
                <label className={labelCls}>PAN Number</label>
                <input value={pan} onChange={e => setPan(e.target.value.toUpperCase())} placeholder="ABCDE1234F" maxLength={10} className={inputCls + ' uppercase tracking-widest font-mono'} />
              </div>
              <Btn onClick={handlePan} loading={loading} label="Fetch PAN Details" />
            </div>
          )}

          {/* STEP 2: AADHAAR */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-white font-semibold">Step 2: Aadhaar Verification</h2>
                <p className="text-zinc-500 text-xs mt-1">Name on Aadhaar must match PAN exactly.</p>
              </div>
              {kycData && (
                <div className="bg-zinc-800 rounded-xl p-4 flex flex-col gap-2 text-sm">
                  <p className="text-zinc-400 text-xs uppercase tracking-wider mb-1">PAN Details</p>
                  <Row label="Name"   value={kycData.fullName} />
                  <Row label="DOB"    value={kycData.dob} />
                  <Row label="Father" value={kycData.fatherName} />
                  <Row label="Gender" value={kycData.gender} />
                </div>
              )}
              <div>
                <label className={labelCls}>Aadhaar Number (12 digits)</label>
                <input value={aadhaar} onChange={e => setAadhaar(e.target.value.replace(/\D/g, ''))} placeholder="123456789012" maxLength={12} className={inputCls + ' font-mono tracking-widest'} />
              </div>
              <Btn onClick={handleAadhaar} loading={loading} label="Verify Aadhaar" />
            </div>
          )}

          {/* STEP 3: EMAIL + OTP + MPIN */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-white font-semibold">Step 3: Email & MPIN</h2>
                {verifiedName && <p className="text-emerald-400 text-xs mt-1">✓ KYC verified for: <strong>{verifiedName}</strong></p>}
              </div>
              <div>
                <label className={labelCls}>Email Address</label>
                <div className="flex gap-2">
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" className={inputCls} />
                  <button onClick={handleSendOtp} disabled={loading || !email}
                    className="bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 text-white text-xs px-4 rounded-xl whitespace-nowrap transition-colors">
                    {loading ? <Loader2 size={14} className="animate-spin" /> : otpSent ? 'Resend' : 'Send OTP'}
                  </button>
                </div>
              </div>
              {otpSent && (
                <>
                  <div>
                    <label className={labelCls}>OTP (sent to email)</label>
                    <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="6-digit OTP" maxLength={6} className={inputCls + ' font-mono tracking-widest'} />
                  </div>
                  <div>
                    <label className={labelCls}>Set 6-Digit MPIN</label>
                    <div className="relative">
                      <input type={showMpin ? 'text' : 'password'} value={mpin} onChange={e => setMpin(e.target.value.replace(/\D/g, ''))} placeholder="••••••" maxLength={6} className={inputCls + ' pr-12 font-mono tracking-widest'} />
                      <button type="button" onClick={() => setShowMpin(!showMpin)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
                        {showMpin ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <Btn onClick={handleVerifyOtp} loading={loading} label="Verify & Continue" />
                </>
              )}
            </div>
          )}

          {/* STEP 4: BANK (OPTIONAL) */}
          {step === 4 && (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-white font-semibold">Step 4: Bank Details</h2>
                <p className="text-zinc-500 text-xs mt-1">Optional — you can add this later. All data AES-256 encrypted.</p>
              </div>
              <div>
                <label className={labelCls}>Account Holder Name</label>
                <input value={bankHolder} onChange={e => setBankHolder(e.target.value)} placeholder={verifiedName} className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Account Number</label>
                  <input value={bankAccount} onChange={e => setBankAccount(e.target.value)} placeholder="1234567890" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>IFSC Code</label>
                  <input value={ifsc} onChange={e => setIfsc(e.target.value.toUpperCase())} placeholder="SBIN0001234" className={inputCls + ' uppercase'} />
                </div>
              </div>
              <Btn onClick={() => handleBank(false)} loading={loading} label="Save Bank Details" />
              <button onClick={() => handleBank(true)} className="text-zinc-500 hover:text-zinc-300 text-sm text-center transition-colors py-1">
                Skip for now →
              </button>
            </div>
          )}

          {/* STEP 5: COMPLETE REGISTRATION */}
          {step === 5 && (
            <div className="flex flex-col gap-4">
              <div className="text-center">
                <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle size={28} className="text-emerald-400" />
                </div>
                <h2 className="text-white font-semibold text-lg">KYC Complete!</h2>
                <p className="text-zinc-400 text-sm mt-1">All your details are verified and encrypted.</p>
              </div>
              <div className="bg-zinc-800 rounded-xl p-4 flex flex-col gap-2 text-sm">
                <Row label="✓ PAN Verified"     value="Encrypted" valueClass="text-emerald-400" />
                <Row label="✓ Aadhaar Verified"  value="Encrypted" valueClass="text-emerald-400" />
                <Row label="✓ Email Verified"    value="Encrypted" valueClass="text-emerald-400" />
                <Row label="✓ MPIN Set"          value="Hashed (bcrypt)" valueClass="text-emerald-400" />
                <Row label="Bank Details"        value={bankAccount ? 'Saved (Encrypted)' : 'Skipped'} valueClass={bankAccount ? 'text-emerald-400' : 'text-zinc-500'} />
              </div>
              <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-3 text-xs text-orange-300">
                After registration, add funds to your wallet to activate the AI DCA agent and start investing.
              </div>
              <Btn onClick={handleComplete} loading={loading} label="Complete Registration" />
            </div>
          )}
        </div>

        <p className="text-center text-zinc-600 text-xs mt-4">
          Already registered?{' '}
          <button onClick={onComplete} className="text-orange-400 hover:text-orange-300">Login instead</button>
        </p>
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

const Row = ({ label, value, valueClass = 'text-white' }) => (
  <div className="flex justify-between">
    <span className="text-zinc-500">{label}</span>
    <span className={`font-medium ${valueClass}`}>{value}</span>
  </div>
);
