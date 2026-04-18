import useStore from '../../store/useStore';

export default function TaxReportTable() {
  const { taxReport } = useStore();
  const lots = taxReport?.lots || [];

  if (lots.length === 0) return null;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
        <h3 className="text-white font-semibold">Detailed Lot Report</h3>
        <span className="text-zinc-500 text-xs">{lots.length} lots • FY {taxReport.fy}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              {['Buy Date', 'Buy Price', 'BTC Qty', 'Cost Basis', 'Current Value', 'Profit/Loss', 'Tax (30%)'].map((h) => (
                <th key={h} className="text-left text-zinc-500 text-xs font-medium px-5 py-3 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lots.map((lot, i) => {
              const isProfit = lot.profit >= 0;
              return (
                <tr key={i} className={`border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors ${lot.isLoss ? 'bg-red-500/3' : ''}`}>
                  <td className="px-5 py-3.5 text-zinc-300">{new Date(lot.date).toLocaleDateString('en-IN')}</td>
                  <td className="px-5 py-3.5 text-zinc-300">₹{lot.buyPrice?.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3.5 text-orange-400 font-mono">₿{lot.btcAmount?.toFixed(6)}</td>
                  <td className="px-5 py-3.5 text-zinc-300">₹{Math.round(lot.costBasis)?.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3.5 text-zinc-300">₹{Math.round(lot.currentValue)?.toLocaleString('en-IN')}</td>
                  <td className={`px-5 py-3.5 font-medium ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isProfit ? '+' : ''}₹{Math.round(lot.profit)?.toLocaleString('en-IN')}
                    {lot.isLoss && <span className="ml-1.5 text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded-full">Harvest</span>}
                  </td>
                  <td className="px-5 py-3.5 text-red-400 font-medium">
                    {lot.taxOnLot > 0 ? `₹${Math.round(lot.taxOnLot)?.toLocaleString('en-IN')}` : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-zinc-800/50">
              <td colSpan={5} className="px-5 py-3.5 text-zinc-400 font-medium text-xs uppercase">Total</td>
              <td className={`px-5 py-3.5 font-bold ${taxReport.totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                ₹{taxReport.totalProfit?.toLocaleString('en-IN')}
              </td>
              <td className="px-5 py-3.5 text-red-400 font-bold">₹{taxReport.taxDue?.toLocaleString('en-IN')}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
