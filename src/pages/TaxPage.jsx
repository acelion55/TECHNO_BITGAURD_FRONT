import { useEffect } from 'react';
import { FileText } from 'lucide-react';
import TaxSummary from '../components/tax/TaxSummary';
import HarvestSuggestions from '../components/tax/HarvestSuggestions';
import TaxReportTable from '../components/tax/TaxReportTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SellSimulator from '../components/tax/SellSimulator';
import useStore from '../store/useStore';

export default function TaxPage() {
  const { fetchTaxReport, taxReport, loading } = useStore();

  useEffect(() => { fetchTaxReport(); }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Tax Optimizer</h1>
          <p className="text-zinc-400 text-sm mt-1">India VDA rules • 30% flat tax • FY 2025-26</p>
        </div>
        <button
          onClick={fetchTaxReport}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold px-4 py-2.5 rounded-xl transition-all text-sm"
        >
          <FileText size={15} />
          Refresh Report
        </button>
      </div>

      {loading && <LoadingSpinner text="Calculating tax report..." />}

      {!loading && !taxReport && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
          <p className="text-zinc-500">Click "Refresh Report" to generate your tax analysis.</p>
        </div>
      )}

      {taxReport && !loading && (
        <>
          <TaxSummary />
          <HarvestSuggestions />
          <SellSimulator />
          <TaxReportTable />
        </>
      )}
    </div>
  );
}
