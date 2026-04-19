import { useEffect } from 'react';
import { AlertTriangle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatsCards from '../components/dashboard/StatsCards';
import PortfolioChart from '../components/dashboard/PortfolioChart';
import QuickActions from '../components/dashboard/QuickActions';
import ReasoningBox from '../components/common/ReasoningBox';
import useStore from '../store/useStore';

export default function DashboardPage() {
  const { fetchPortfolio, fetchTaxReport, taxReport, aiDecision, user } = useStore();
  const navigate = useNavigate();

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

      {/* Access Gate Banner */}
      {!user?.hasFullAccess && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-300 font-semibold text-sm">Limited Access</p>
              <p className="text-yellow-500 text-xs mt-0.5">
                {!user?.walletFunded
                  ? 'Add ₹100+ to your wallet to unlock DCA Agent, Tax Optimizer, and AI Chat.'
                  : 'Complete KYC verification to unlock all features.'}
              </p>
            </div>
          </div>
          {!user?.walletFunded && (
            <button 
              onClick={() => navigate('/wallet')}
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-xl text-sm transition-colors shrink-0"
            >
              <Plus size={16} />
              Add Funds
            </button>
          )}
        </div>
      )}

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
