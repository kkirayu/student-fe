import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Search, Bell, MessageSquare, Sun, ChevronDown, 
  LayoutDashboard, User, Box, Menu, X, Heart, BarChart3, Tag
} from 'lucide-react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const isReportsPath = location.pathname.includes('/admin/reports');

  return (
    <div className="flex h-screen overflow-hidden bg-[#F1F5F9] font-sans text-slate-600">
      
      {/* Overlay Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* ================== SIDEBAR ================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#1C2434] transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between gap-2 px-6 py-6">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded bg-blue-600">
              <Box className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">Zeta Connect</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white lg:hidden">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Menu List */}
        <div className="no-scrollbar flex flex-col overflow-y-auto">
          <nav className="mt-4 px-4 py-4 lg:px-6">
            <div>
              <h3 className="mb-4 ml-4 text-xs font-semibold uppercase tracking-widest text-[#8A99AF]">MENU UTAMA</h3>
              <ul className="mb-6 flex flex-col gap-1.5">
                
                {/* Dashboard */}
                <li>
                  <Link to="/admin" className={`flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium text-[#DEE4EE] transition-all hover:bg-[#333A48] ${isActive('/admin') ? 'bg-[#333A48]' : ''}`}>
                    <LayoutDashboard className="h-5 w-5" />
                    Dashboard
                  </Link>
                </li>
                
                {/* Manajemen Staf */}
                <li>
                  <Link to="/admin/staff" className={`flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium text-[#DEE4EE] transition-all hover:bg-[#333A48] ${isActive('/admin/staff') ? 'bg-[#333A48]' : ''}`}>
                    <User className="h-5 w-5" />
                    Manajemen Staf
                  </Link>
                </li>

                {/* Layanan & Tarif */}
                <li>
                  <Link to="/admin/services" className={`flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium text-[#DEE4EE] transition-all hover:bg-[#333A48] ${isActive('/admin/services') ? 'bg-[#333A48]' : ''}`}>
                    <Tag className="h-5 w-5" />
                    Layanan & Tarif
                  </Link>
                </li>

                {/* Laporan (Dropdown) */}
                <li>
                  <button 
                    onClick={() => setReportsOpen(!reportsOpen)}
                    className={`flex w-full items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium text-[#DEE4EE] transition-all hover:bg-[#333A48] ${isReportsPath ? 'bg-[#333A48]' : ''}`}
                  >
                    <BarChart3 className="h-5 w-5" />
                    Laporan
                    <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${reportsOpen || isReportsPath ? 'rotate-180' : ''}`} />
                  </button>
                  <ul className={`mt-2 flex flex-col gap-1.5 pl-9 ${(reportsOpen || isReportsPath) ? 'block' : 'hidden'}`}>
                    <li><Link to="/admin/reports/financial" className={`text-sm text-[#8A99AF] transition-colors hover:text-white ${isActive('/admin/reports/financial') ? 'font-semibold text-white' : ''}`}>Laporan Keuangan</Link></li>
                    <li><Link to="/admin/reports/demographics" className={`text-sm text-[#8A99AF] transition-colors hover:text-white ${isActive('/admin/reports/demographics') ? 'font-semibold text-white' : ''}`}>Demografi Pasien</Link></li>
                    <li><Link to="/admin/reports/transactions" className={`text-sm text-[#8A99AF] transition-colors hover:text-white ${isActive('/admin/reports/transactions') ? 'font-semibold text-white' : ''}`}>Log Transaksi</Link></li>
                    <li><Link to="/admin/reports/stock-mutation" className={`text-sm text-[#8A99AF] transition-colors hover:text-white ${isActive('/admin/reports/stock-mutation') ? 'font-semibold text-white' : ''}`}>Mutasi Stok</Link></li>
                  </ul>
                </li>

                {/* Pengaturan Klinik */}
                <li>
                  <Link to="/admin/settings" className={`flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium text-[#DEE4EE] transition-all hover:bg-[#333A48] ${isActive('/admin/settings') ? 'bg-[#333A48]' : ''}`}>
                    <Box className="h-5 w-5" />
                    Pengaturan Klinik
                  </Link>
                </li>

                {/* Petlist */}
                <li>
                  <Link to="/admin/PetList" className={`flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium text-[#DEE4EE] transition-all hover:bg-[#333A48] ${isActive('/admin/pets') ? 'bg-[#333A48]' : ''}`}>
                    <Box className="h-5 w-5" />
                    Daftar Hewan Peliharaan
                  </Link>
                </li>

              </ul>
            </div>
          </nav>
        </div>
      </aside>

      {/* ================== MAIN AREA ================== */}
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        
        {/* Header */}
        <header className="sticky top-0 z-40 flex w-full border-b border-slate-200 bg-white shadow-sm">
          <div className="flex flex-grow items-center justify-between px-4 py-4 md:px-6 2xl:px-11">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="flex items-center justify-center rounded-md border border-slate-200 bg-white p-1.5 shadow-sm lg:hidden">
                <Menu className="h-5 w-5 text-black" />
              </button>
              <div className="hidden sm:block">
                <div className="relative">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400">
                    <Search className="h-5 w-5" />
                  </span>
                  <input type="text" placeholder="Cari data..." className="w-72 bg-transparent pl-9 pr-4 text-sm font-medium outline-none xl:w-125" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="hidden text-right lg:block">
                  <p className="text-sm font-bold leading-tight text-black">Muhammad Danil</p>
                  <p className="text-xs font-medium text-slate-500">Quality Assurance</p>
                </div>
                <div className="h-10 w-10 rounded-full border border-slate-200 p-0.5">
                  <img src="https://ui-avatars.com/api/?name=Muhammad+Danil&background=3b82f6&color=fff&bold=true" alt="User" className="h-full w-full rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex flex-grow flex-col">
          <main className="w-full flex-grow p-4 md:p-6 2xl:p-10">
            <Outlet />
          </main>

          {/* Footer */}
          <footer className="w-full border-t border-slate-200 bg-white px-4 py-6 md:px-10">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-sm font-medium text-slate-500">
                &copy; {new Date().getFullYear()} <span className="font-bold text-slate-800">Zeta Connect</span>. All rights reserved.
              </p>
              <div className="flex items-center gap-1 text-sm text-slate-500">
                <span>Made with</span>
                <Heart className="h-4 w-4 fill-current text-red-500" />
                <span>by</span>
                <span className="font-semibold text-blue-600">Informatics Team</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;