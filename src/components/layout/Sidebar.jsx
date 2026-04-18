import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Bot, PieChart, ArrowLeftRight,
  FileText, MessageSquare, Bitcoin
} from 'lucide-react';

const links = [
  { to: '/',           icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dca',        icon: Bot,             label: 'DCA Agent' },
  { to: '/portfolio',  icon: PieChart,        label: 'Portfolio' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { to: '/tax',        icon: FileText,        label: 'Tax Optimizer' },
  { to: '/chat',       icon: MessageSquare,   label: 'AI Chat' },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-16 bottom-0 w-56 bg-zinc-950 border-r border-zinc-800 flex flex-col py-4 z-40">
      <nav className="flex flex-col gap-1 px-3">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-4 pb-2">
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-400 text-xs font-semibold">Agent Active</span>
          </div>
          <p className="text-zinc-500 text-xs">Monitoring BTC for next DCA opportunity</p>
        </div>
      </div>
    </aside>
  );
}
