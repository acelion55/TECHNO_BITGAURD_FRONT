import DcaForm from '../components/dca/DcaForm';
import SimulationPanel from '../components/dca/SimulationPanel';
import useStore from '../store/useStore';

export default function DcaPage() {
  const { user, saveGoal, loading, error } = useStore();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-white text-2xl font-bold">DCA Agent</h1>
        <p className="text-zinc-400 text-sm mt-1">Configure your strategy and simulate AI-driven buys</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Goal Form */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-4">Investment Goal</h2>
          <div className="flex flex-col gap-3 text-sm">
            {[
              ['Name', user?.name],
              ['Email', user?.email],
              ['Amount', `₹${user?.monthlyAmount?.toLocaleString('en-IN')}`],
              ['Frequency', user?.frequency],
              ...(user?.frequency === 'daily'
                ? [['Buy Time', user?.scheduleTime + ' IST']]
                : user?.frequency === 'weekly'
                ? [['Buy Days', (user?.scheduleDays || []).join(', ')]]
                : [['Buy Date', `${user?.scheduleDate}${user?.scheduleDate === 1 ? 'st' : user?.scheduleDate === 2 ? 'nd' : user?.scheduleDate === 3 ? 'rd' : 'th'} of month`]]
              ),
              ['Duration', `${user?.durationMonths} months`],
              ['Risk Mode', user?.riskMode],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between py-2 border-b border-zinc-800 last:border-0">
                <span className="text-zinc-500">{label}</span>
                <span className="text-white font-medium capitalize">{val}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 bg-orange-500/5 border border-orange-500/20 rounded-xl p-3">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
            <span className="text-orange-300 text-xs font-medium">Agent is active and monitoring BTC price</span>
          </div>
        </div>

        {/* Right: Simulation */}
        <SimulationPanel />
      </div>
    </div>
  );
}
