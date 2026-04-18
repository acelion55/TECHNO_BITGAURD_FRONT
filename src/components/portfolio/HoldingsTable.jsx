import useStore from '../../store/useStore';

export default function HoldingsTable() {
  const { portfolio, btcPrice } = useStore();
  const txs = portfolio?.transactions
    ? [...portfolio.transactions].sort((a, b) => new Date(b.date) - new Date(a.date))
    : [];

  if (txs.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
        <p className="text-zinc-500">No transactions yet. Simulate a buy to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-800">
        <h3 className="text-white font-semibold">Transaction History</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              {['Date', 'Amount (₹)', 'BTC Bought', 'Price/BTC', 'Current Value', 'P&L'].map((h) => (
                <th key={h} className="text-left text-zinc-500 text-xs font-medium px-5 py-3 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {txs.map((tx, i) => {
              const currentVal = tx.btcAmount * (btcPrice?.inr || tx.pricePerBtc);
              const pnl = currentVal - tx.amountINR;
              const isProfit = pnl >= 0;
              return (
                <tr key={tx._id || i} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                  <td className="px-5 py-3.5 text-zinc-300">{new Date(tx.date).toLocaleDateString('en-IN')}</td>
                  <td className="px-5 py-3.5 text-white font-medium">₹{tx.amountINR?.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3.5 text-orange-400 font-mono">₿{tx.btcAmount?.toFixed(6)}</td>
                  <td className="px-5 py-3.5 text-zinc-300">₹{tx.pricePerBtc?.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3.5 text-zinc-300">₹{Math.round(currentVal).toLocaleString('en-IN')}</td>
                  <td className={`px-5 py-3.5 font-medium ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isProfit ? '+' : ''}₹{Math.round(pnl).toLocaleString('en-IN')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
