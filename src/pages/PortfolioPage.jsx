import { useEffect } from 'react';
import PortfolioSummary from '../components/portfolio/PortfolioSummary';
import HoldingsTable from '../components/portfolio/HoldingsTable';
import PortfolioChart from '../components/dashboard/PortfolioChart';
import useStore from '../store/useStore';

export default function PortfolioPage() {
  const { fetchPortfolio } = useStore();
  useEffect(() => { fetchPortfolio(); }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-white text-2xl font-bold">Portfolio</h1>
        <p className="text-zinc-400 text-sm mt-1">Your Bitcoin holdings and performance</p>
      </div>
      <PortfolioSummary />
      <PortfolioChart />
      <HoldingsTable />
    </div>
  );
}
