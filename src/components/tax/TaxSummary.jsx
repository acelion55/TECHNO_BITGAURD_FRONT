import { FileText, TrendingUp, Zap } from 'lucide-react';
import StatCard from '../ui/StatCard';
import useStore from '../../store/useStore';

export default function TaxSummary() {
  const { taxReport } = useStore();
  if (!taxReport) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        label="Total Profit"
        value={`₹${taxReport.totalProfit?.toLocaleString('en-IN')}`}
        sub={`FY ${taxReport.fy}`}
        icon={TrendingUp}
      />
      <StatCard
        label="Tax Liability (30%)"
        value={`₹${taxReport.taxDue?.toLocaleString('en-IN')}`}
        sub="India VDA flat rate"
        icon={FileText}
        accent
      />
      <StatCard
        label="Potential Savings"
        value={taxReport.harvestingSuggestion ? `₹${taxReport.harvestingSuggestion.potentialSavings?.toLocaleString('en-IN')}` : '₹0'}
        sub="via tax loss harvesting"
        icon={Zap}
      />
    </div>
  );
}
