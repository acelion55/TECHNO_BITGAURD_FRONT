import { Zap, CheckCircle } from 'lucide-react';
import useStore from '../../store/useStore';

export default function HarvestSuggestions() {
  const { taxReport } = useStore();
  const suggestion = taxReport?.harvestingSuggestion;

  if (!suggestion) {
    return (
      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 flex items-center gap-3">
        <CheckCircle size={18} className="text-emerald-400 shrink-0" />
        <p className="text-emerald-300 text-sm">No loss harvesting opportunities right now. All lots are in profit!</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Zap size={16} className="text-yellow-400" />
        <h3 className="text-white font-semibold text-sm">Tax Loss Harvesting Opportunities</h3>
      </div>
      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 mb-4">
        <p className="text-yellow-300 text-sm leading-relaxed">{suggestion.message}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-zinc-800 rounded-xl p-3">
          <p className="text-zinc-500 text-xs mb-1">Loss Lots Found</p>
          <p className="text-white font-bold text-lg">{suggestion.lossLots}</p>
        </div>
        <div className="bg-zinc-800 rounded-xl p-3">
          <p className="text-zinc-500 text-xs mb-1">Potential Tax Saving</p>
          <p className="text-emerald-400 font-bold text-lg">₹{suggestion.potentialSavings?.toLocaleString('en-IN')}</p>
        </div>
      </div>
    </div>
  );
}
