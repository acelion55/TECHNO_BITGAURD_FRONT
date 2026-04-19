import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import useStore from '../../store/useStore';

export default function Layout() {
  const { fetchWallet } = useStore();

  useEffect(() => {
    fetchWallet();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <Sidebar />
      <main className="ml-56 pt-16 min-h-screen">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
