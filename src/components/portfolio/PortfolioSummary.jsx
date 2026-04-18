import { Bitcoin, TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';
import StatCard from '../ui/StatCard';
import useStore from '../../store/useStore';

export default function PortfolioSummary() {
  const { portfolio, btcPrice } = useStore();

  const invested = portfolio?.totalInvested || 0;
  const currentVal = portfolio?.totalBtc && btcPrice?.inr
    ? portfolio.totalBtc * btcPrice.inr
    : portfolio?.currentValue || 0;
  const pnl = currentVal - invested;
  const isProfit = pnl >= 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard label="Total BTC" value={`₿${(portfolio?.totalBtc || 0).toFixed(6)}`} icon={Bitcoin} accent />
      <StatCard label="Avg. Cost Basis" value={`₹${Math.round(portfolio?.averageCost || 0).toLocaleString('en-IN')}`} icon={BarChart2} />
      <StatCard
        label="Unrealized P&L"
        value={`${isProfit ? '+' : ''}₹${Math.round(pnl).toLocaleString('en-IN')}`}
        sub={`${((pnl / (invested || 1)) * 100).toFixed(2)}% return`}
        icon={isProfit ? TrendingUp : TrendingDown}
      />
    </div>
  );
}
