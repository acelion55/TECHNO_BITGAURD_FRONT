import { Bot, Zap } from 'lucide-react';

export default function ReasoningBox({ aiDecision }) {
  if (!aiDecision) return null;

  const actionColor = {
    buy: 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20',
    hold: 'text-yellow-400 bg-yellow-400/10 border-yellow-500/20',
    suggest_tax_action: 'text-purple-400 bg-purple-400/10 border-purple-500/20',
  }[aiDecision.action] || 'text-zinc-400 bg-zinc-800 border-zinc-700';

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-center justify-center">
          <Bot size={14} className="text-orange-400" />
        </div>
        <span className="text-white font-semibold text-sm">AI Agent Decision</span>
        <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full border ${actionColor}`}>
          {aiDecision.action?.toUpperCase().replace('_', ' ')}
        </span>
      </div>

      <p className="text-zinc-300 text-sm leading-relaxed mb-4">{aiDecision.reasoning}</p>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-zinc-800 rounded-xl p-3">
          <p className="text-zinc-500 text-xs mb-1">Amount to Invest</p>
          <p className="text-white font-bold">₹{aiDecision.amountToInvest?.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-zinc-800 rounded-xl p-3">
          <p className="text-zinc-500 text-xs mb-1">Next DCA Date</p>
          <p className="text-white font-bold">{aiDecision.nextDcaDate}</p>
        </div>
      </div>

      {aiDecision.taxSavingsSuggestion && (
        <div className="mt-3 flex items-start gap-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3">
          <Zap size={14} className="text-emerald-400 mt-0.5 shrink-0" />
          <p className="text-emerald-300 text-xs leading-relaxed">{aiDecision.taxSavingsSuggestion}</p>
        </div>
      )}
    </div>
  );
}
