import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Filler, Tooltip, Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import useStore from '../../store/useStore';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function PortfolioChart() {
  const { portfolio, btcPrice } = useStore();
  const txs = portfolio?.transactions || [];

  if (txs.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center justify-center h-64">
        <p className="text-zinc-500 text-sm">No transaction data yet</p>
      </div>
    );
  }

  // Build cumulative data
  let cumInvested = 0;
  const labels = [];
  const investedData = [];
  const valueData = [];

  const sorted = [...txs].sort((a, b) => new Date(a.date) - new Date(b.date));
  let cumBtc = 0;

  sorted.forEach((tx) => {
    cumInvested += tx.amountINR;
    cumBtc += tx.btcAmount;
    labels.push(new Date(tx.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }));
    investedData.push(Math.round(cumInvested));
    valueData.push(Math.round(cumBtc * (btcPrice?.inr || tx.pricePerBtc)));
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Invested (₹)',
        data: investedData,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#6366f1',
      },
      {
        label: 'Current Value (₹)',
        data: valueData,
        borderColor: '#f97316',
        backgroundColor: 'rgba(249,115,22,0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#f97316',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#a1a1aa', font: { size: 12 } } },
      tooltip: {
        backgroundColor: '#18181b',
        borderColor: '#3f3f46',
        borderWidth: 1,
        titleColor: '#f4f4f5',
        bodyColor: '#a1a1aa',
        callbacks: {
          label: (ctx) => ` ₹${ctx.raw.toLocaleString('en-IN')}`,
        },
      },
    },
    scales: {
      x: { ticks: { color: '#71717a', font: { size: 11 } }, grid: { color: '#27272a' } },
      y: {
        ticks: { color: '#71717a', font: { size: 11 }, callback: (v) => `₹${(v / 1000).toFixed(0)}k` },
        grid: { color: '#27272a' },
      },
    },
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
      <h3 className="text-white font-semibold mb-4">Portfolio Performance</h3>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
