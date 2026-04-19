import { useEffect } from 'react';
import HoldingsTable from '../components/portfolio/HoldingsTable';
import useStore from '../store/useStore';

export default function TransactionsPage() {
  const { portfolio, fetchPortfolio } = useStore();
  const count = portfolio?.transactions?.length || 0;

  useEffect(() => { fetchPortfolio(); }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-white text-2xl font-bold">Transactions</h1>
        <p className="text-zinc-400 text-sm mt-1">{count} DCA buy{count !== 1 ? 's' : ''} recorded</p>
      </div>
      <HoldingsTable />
    </div>
  );
}
