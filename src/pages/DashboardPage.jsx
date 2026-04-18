import { useEffect } from 'react';
import StatsCards from '../components/dashboard/StatsCards';
import PortfolioChart from '../components/dashboard/PortfolioChart';
import QuickActions from '../components/dashboard/QuickActions';
import ReasoningBox from '../components/common/ReasoningBox';
import useStore from '../store/useStore';

export default function DashboardPage() {
  const { fetchPortfolio, fetchTaxReport, taxReport, aiDecision } = useStore();

  useEffect(() => {
    fetchPortfolio();
    fetchTaxReport();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-white text-2xl font-bold">Dashboard</h1>
        <p className="text-zinc-400 text-sm mt-1">Your autonomous Bitcoin DCA overview</p>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <PortfolioChart />
          {aiDecision && <ReasoningBox aiDecision={aiDecision} />}
        </div>
        <div>
          <QuickActions />
        </div>
      </div>

      {taxReport?.harvestingSuggestion && (
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 flex items-start gap-3">
          <span className="text-2xl">💰</span>
          <div>
            <p className="text-emerald-300 font-semibold text-sm">Tax Saving Opportunity</p>
            <p className="text-emerald-400/80 text-sm mt-0.5">{taxReport.harvestingSuggestion.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
