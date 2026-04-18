import { useEffect } from 'react';
import useStore from '../store/useStore';

export default function Dashboard() {
  const { user, portfolio, btcPrice, aiDecision, loading, simulateBuy, fetchPortfolio, fetchTaxReport, taxReport } = useStore();

  useEffect(() => { fetchPortfolio(); }, []);

  const pnl = portfolio ? portfolio.currentValue - portfolio.totalInvested : 0;
  const pnlPct = portfolio?.totalInvested ? ((pnl / portfolio.totalInvested) * 100).toFixed(2) : 0;

  return (
    <div style={{ padding: 24 }}>
      <h1>₿ BitGuard AI Dashboard</h1>
      <p>Welcome, {user?.name} | Mode: <strong>{user?.riskMode}</strong></p>

      {/* BTC Price */}
      <div style={{ background: '#1a1a2e', color: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 }}>
        <h3>Live BTC Price</h3>
        <p style={{ fontSize: 28, color: '#f7931a' }}>
          ₹{btcPrice?.inr?.toLocaleString('en-IN') || '—'}
        </p>
        <p style={{ color: '#aaa' }}>${btcPrice?.usd?.toLocaleString() || '—'}</p>
      </div>

      {/* Portfolio Summary */}
      {portfolio && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
          <StatCard label="Total Invested" value={`₹${portfolio.totalInvested?.toLocaleString('en-IN')}`} />
          <StatCard label="Current Value" value={`₹${Math.round(portfolio.currentValue)?.toLocaleString('en-IN')}`} />
          <StatCard label="P&L" value={`₹${Math.round(pnl)?.toLocaleString('en-IN')} (${pnlPct}%)`} color={pnl >= 0 ? '#22c55e' : '#ef4444'} />
          <StatCard label="Total BTC" value={`₿${portfolio.totalBtc?.toFixed(6)}`} />
          <StatCard label="Avg Buy Price" value={`₹${Math.round(portfolio.averageCost)?.toLocaleString('en-IN')}`} />
          <StatCard label="Transactions" value={portfolio.transactions?.length || 0} />
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <button onClick={simulateBuy} disabled={loading}>
          {loading ? '🤖 AI Thinking...' : '⚡ Simulate Next Buy'}
        </button>
        <button onClick={fetchTaxReport} disabled={loading}>
          📊 Generate Tax Report
        </button>
      </div>

      {/* AI Decision */}
      {aiDecision && (
        <div style={{ background: '#0f172a', color: '#e2e8f0', padding: 16, borderRadius: 8, marginBottom: 16 }}>
          <h3>🤖 AI Agent Decision</h3>
          <p><strong>Action:</strong> {aiDecision.action?.toUpperCase()}</p>
          <p><strong>Amount:</strong> ₹{aiDecision.amountToInvest?.toLocaleString('en-IN')}</p>
          <p><strong>Reasoning:</strong> {aiDecision.reasoning}</p>
          {aiDecision.taxSavingsSuggestion && (
            <p style={{ color: '#4ade80' }}>💡 {aiDecision.taxSavingsSuggestion}</p>
          )}
          <p><strong>Next DCA:</strong> {aiDecision.nextDcaDate}</p>
        </div>
      )}

      {/* Tax Report */}
      {taxReport && (
        <div style={{ background: '#1e1b4b', color: '#e2e8f0', padding: 16, borderRadius: 8 }}>
          <h3>📋 Tax Report FY {taxReport.fy}</h3>
          <p>Total Profit: ₹{taxReport.totalProfit?.toLocaleString('en-IN')}</p>
          <p>Tax Due (30%): <strong style={{ color: '#f87171' }}>₹{taxReport.taxDue?.toLocaleString('en-IN')}</strong></p>
          {taxReport.harvestingSuggestion && (
            <p style={{ color: '#4ade80' }}>
              💰 {taxReport.harvestingSuggestion.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

const StatCard = ({ label, value, color }) => (
  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 12 }}>
    <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>{label}</p>
    <p style={{ margin: 0, fontSize: 18, fontWeight: 600, color: color || '#0f172a' }}>{value}</p>
  </div>
);
