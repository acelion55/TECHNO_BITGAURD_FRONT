import { useState } from 'react';
import useStore from '../store/useStore';

export default function DcaForm() {
  const { saveGoal, loading } = useStore();
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
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400, margin: '0 auto' }}>
      <h2>Set Your DCA Goal</h2>
      <input name="name" placeholder="Your Name" value={form.name} onChange={handle} required />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handle} required />
      <input name="monthlyAmount" type="number" placeholder="Monthly Amount (₹)" value={form.monthlyAmount} onChange={handle} required />
      <select name="frequency" value={form.frequency} onChange={handle}>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>
      <input name="durationMonths" type="number" placeholder="Duration (months)" value={form.durationMonths} onChange={handle} required />
      <select name="riskMode" value={form.riskMode} onChange={handle}>
        <option value="smart">Smart (Dip Buying)</option>
        <option value="conservative">Conservative</option>
      </select>
      <button type="submit" disabled={loading}>
        {loading ? 'Activating...' : '🚀 Activate AI Agent'}
      </button>
    </form>
  );
}
