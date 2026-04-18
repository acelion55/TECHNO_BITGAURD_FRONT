import { useState } from 'react';
import { Zap, TrendingDown, ArrowRight, Bot } from 'lucide-react';
import useStore from '../../store/useStore';

export default function SellSimulator() {
  const { simulateSellTax, sellSimulation, loading, portfolio } = useStore();
  const [btcInput, setBtcInput] = useState('');

  const totalBtc = portfolio?.totalBtc || 0;

  const handleSimulate = () => {
    const val = parseFloat(btcInput);
    if (!val || val <= 0 || val > totalBtc) return;
    simulateSellTax(val);
  };

  const fifo = sellSimulation?.fifo;
  const hifo = sellSimulation?.hifo;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap size={16} className="text-orange-400" />
            <h3 className="text-white font-semibold">AI Tax Sell Optimizer</h3>
          </div>
          <p className="text-zinc-500 text-xs leading-relaxed max-w-lg">
            Enter how much BTC you want to sell. AI picks the <span className="text-orange-400 font-medium">highest cost basis lots first (HIFO)</span> to minimize your taxable profit — saving you real money vs the default FIFO method.
          </p>
        </div>
      </div>

      {/* Input Row */}
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="text-zinc-500 text-xs mb-1.5 block uppercase tracking-wider">BTC Amount to Sell</label>
          <input
            type="number"
            step="0.000001"
            min="0"
            max={totalBtc}
            value={btcInput}
            onChange={(e) => setBtcInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSimulate()}
            placeholder={`Max ₿${totalBtc.toFixed(6)}`}
            className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 placeholder:text-zinc-600"
          />
        </div>
        <button
          onClick={handleSimulate}
          disabled={loading || !btcInput || parseFloat(btcInput) > totalBtc}
          className="bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm"
        >
          {loading ? 'Calculating...' : 'Simulate'}
        </button>
      </div>

      {/* Quick % buttons */}
      <div className="flex gap-2">
        <span className="text-zinc-600 text-xs self-center">Quick:</span>
        {[0.25, 0.5, 0.75, 1].map((pct) => (
          <button
            key={pct}
            onClick={() => setBtcInput((totalBtc * pct).toFixed(6))}
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            {pct * 100}%
          </button>
        ))}
      </div>

      {/* Results */}
      {sellSimulation && fifo && hifo && (
        <div className="flex flex-col gap-4">

          {/* FIFO vs HIFO Cards */}
          <div className="grid grid-cols-2 gap-3">

            {/* FIFO Card */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-3">
                Normal Way (FIFO)
              </p>
              <div className="flex flex-col gap-2.5 text-sm">
                <Row label="Sale Proceeds" value={`₹${fifo.totalProceeds?.toLocaleString('en-IN')}`} />
                <Row label="Taxable Profit" value={`₹${fifo.totalProfit?.toLocaleString('en-IN')}`} valueClass="text-yellow-400" />
                <Row label="Tax @ 30%" value={`₹${fifo.taxDue?.toLocaleString('en-IN')}`} valueClass="text-red-400 font-bold" divider />
                <Row
                  label="Net in Hand"
                  value={`₹${(fifo.totalProceeds - fifo.taxDue)?.toLocaleString('en-IN')}`}
                  valueClass="text-white font-semibold"
                />
              </div>
            </div>

            {/* HIFO Card */}
            <div className="bg-emerald-500/5 border border-emerald-500/25 rounded-xl p-4">
              <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
                ⚡ AI Optimized (HIFO)
              </p>
              <div className="flex flex-col gap-2.5 text-sm">
                <Row label="Sale Proceeds" value={`₹${hifo.totalProceeds?.toLocaleString('en-IN')}`} />
                <Row label="Taxable Profit" value={`₹${hifo.totalProfit?.toLocaleString('en-IN')}`} valueClass="text-yellow-400" />
                <Row label="Tax @ 30%" value={`₹${hifo.taxDue?.toLocaleString('en-IN')}`} valueClass="text-emerald-400 font-bold" divider borderClass="border-emerald-500/20" />
                <Row
                  label="Net in Hand"
                  value={`₹${(hifo.totalProceeds - hifo.taxDue)?.toLocaleString('en-IN')}`}
                  valueClass="text-white font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Tax Saved Banner */}
          {sellSimulation.taxSaved > 0 ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingDown size={20} className="text-emerald-400 shrink-0" />
                <div>
                  <p className="text-emerald-300 font-bold text-lg leading-none">
                    ₹{sellSimulation.taxSaved?.toLocaleString('en-IN')} Tax Saved!
                  </p>
                  <p className="text-emerald-600 text-xs mt-1">
                    AI lot selection (HIFO) vs normal method (FIFO)
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-zinc-400 text-xs">Selling ₿{sellSimulation.btcToSell}</p>
                <p className="text-zinc-500 text-xs mt-0.5">@ ₹{sellSimulation.currentBtcPrice?.toLocaleString('en-IN')}</p>
              </div>
            </div>
          ) : (
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-center">
              <p className="text-zinc-400 text-sm">Both methods result in the same tax for this selection.</p>
            </div>
          )}

          {/* AI Reasoning */}
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bot size={14} className="text-orange-400" />
              <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">AI Reasoning</p>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed">{sellSimulation.reasoning}</p>
          </div>

          {/* Recommended Lots Table */}
          <div>
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-2">
              Recommended Lots to Sell (HIFO Order)
            </p>
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-700">
                    {['Buy Date', 'Buy Price', 'BTC Sold', 'Cost Basis', 'Proceeds', 'Profit', 'Tax'].map(h => (
                      <th key={h} className="text-left text-zinc-500 text-xs font-medium px-4 py-2.5 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sellSimulation.recommendation?.map((lot, i) => (
                    <tr key={i} className="border-b border-zinc-700/50 last:border-0 hover:bg-zinc-700/30 transition-colors">
                      <td className="px-4 py-3 text-zinc-400 text-xs">{new Date(lot.date).toLocaleDateString('en-IN')}</td>
                      <td className="px-4 py-3 text-zinc-300">₹{lot.buyPrice?.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-orange-400 font-mono">₿{lot.btcSold?.toFixed(6)}</td>
                      <td className="px-4 py-3 text-zinc-300">₹{lot.costBasis?.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-zinc-300">₹{lot.proceeds?.toLocaleString('en-IN')}</td>
                      <td className={`px-4 py-3 font-medium ${lot.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {lot.profit >= 0 ? '+' : ''}₹{lot.profit?.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-red-400">
                        {lot.tax > 0 ? `₹${lot.tax?.toLocaleString('en-IN')}` : <span className="text-zinc-600">₹0</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-zinc-700/40">
                    <td colSpan={5} className="px-4 py-3 text-zinc-500 text-xs font-semibold uppercase">Total</td>
                    <td className="px-4 py-3 text-emerald-400 font-bold">
                      ₹{hifo.totalProfit?.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-red-400 font-bold">
                      ₹{hifo.taxDue?.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

// Small helper row component
const Row = ({ label, value, valueClass = 'text-white', divider = false, borderClass = 'border-zinc-700' }) => (
  <div className={`flex justify-between ${divider ? `border-t ${borderClass} pt-2 mt-0.5` : ''}`}>
    <span className="text-zinc-500">{label}</span>
    <span className={valueClass}>{value}</span>
  </div>
);
