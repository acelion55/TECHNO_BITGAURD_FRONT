import { TrendingUp, TrendingDown, Bitcoin, Wallet, Target, DollarSign } from 'lucide-react';
import StatCard from '../ui/StatCard';
import useStore from '../../store/useStore';

export default function StatsCards() {
  const { portfolio, user, btcPrice } = useStore();

  const invested = portfolio?.totalInvested || 0;
  const currentVal = portfolio?.totalBtc && btcPrice?.inr
    ? portfolio.totalBtc * btcPrice.inr
    : portfolio?.currentValue || 0;
  const pnl = currentVal - invested;
  const pnlPct = invested > 0 ? ((pnl / invested) * 100).toFixed(2) : '0.00';
  const isProfit = pnl >= 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Monthly Goal"
        value={`₹${(user?.monthlyAmount || 0).toLocaleString('en-IN')}`}
        sub={`${user?.frequency || '—'} • ${user?.durationMonths || 0} months`}
        icon={Target}
      />
      <StatCard
        label="Total Invested"
        value={`₹${Math.round(invested).toLocaleString('en-IN')}`}
        sub={`${portfolio?.transactions?.length || 0} DCA buys`}
        icon={Wallet}
      />
      <StatCard
        label="Total BTC Held"
        value={`₿${(portfolio?.totalBtc || 0).toFixed(6)}`}
        sub={`Avg ₹${Math.round(portfolio?.averageCost || 0).toLocaleString('en-IN')}`}
        icon={Bitcoin}
        accent
      />
      <StatCard
        label="Portfolio Value"
        value={`₹${Math.round(currentVal).toLocaleString('en-IN')}`}
        sub={
          <span className={isProfit ? 'text-emerald-400' : 'text-red-400'}>
            {isProfit ? '▲' : '▼'} ₹{Math.abs(Math.round(pnl)).toLocaleString('en-IN')} ({pnlPct}%)
          </span>
        }
        icon={isProfit ? TrendingUp : TrendingDown}
      />
    </div>
  );
}
