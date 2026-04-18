import { Zap, FileText, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import LivePriceCard from '../common/LivePriceCard';

export default function QuickActions() {
  const { simulateBuy, fetchTaxReport, loading, aiDecision, user } = useStore();
  const navigate = useNavigate();

  const handleSimulate = async () => {
    await simulateBuy();
  };

  const handleTax = async () => {
    await fetchTaxReport();
    navigate('/tax');
  };

  return (
    <div className="flex flex-col gap-4">
      <LivePriceCard />

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <h3 className="text-white font-semibold text-sm mb-3">Quick Actions</h3>

        <button
          onClick={handleSimulate}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-150 mb-3"
        >
          <Zap size={16} />
          {loading ? 'AI Thinking...' : 'Simulate Next Buy'}
        </button>

        <button
          onClick={handleTax}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-200 font-medium py-3 rounded-xl transition-all duration-150"
        >
          <FileText size={16} />
          Generate Tax Report
        </button>
      </div>

      {aiDecision?.nextDcaDate && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-3">
          <Calendar size={16} className="text-purple-400 shrink-0" />
          <div>
            <p className="text-zinc-400 text-xs">Next DCA Date</p>
            <p className="text-white font-semibold text-sm">{aiDecision.nextDcaDate}</p>
          </div>
        </div>
      )}
    </div>
  );
}
