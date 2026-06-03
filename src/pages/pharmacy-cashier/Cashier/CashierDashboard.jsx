
import React from 'react';
import { Wallet, CreditCard, Clock, CheckCircle, ChevronRight, PlusCircle, Printer, Eye, Edit } from 'lucide-react';

const CashierDashboard = () => {
  // 1. Statistik Ringkasan Shift Aktif
  const shiftStats = [
    {
      title: 'Diproses',
      value: '12 Antrean',
      icon: <Wallet className="text-emerald-600 h-5 w-5" />,
      bgIcon: 'bg-emerald-100',
    },
    {
      title: 'Menunggu Bayar',
      value: '5 Antrean',
      icon: <Clock className="text-orange-600 h-5 w-5" />,
      bgIcon: 'bg-orange-100',
    },
    {
      title: 'Selesai',
      value: '84 Transaksi',
      icon: <CheckCircle className="text-blue-600 h-5 w-5" />,
      bgIcon: 'bg-blue-100',
    },
  ];

  // 2. Data Mockup Antrean Kasir Hari Ini (Disesuaikan untuk Petshop & Klinik)
  const queueList = [
    { 
      id: '#INV-2024-8821', 
      name: 'Andi Wijaya (Milo - Kucing)', 
      items: '1x Vaksin F3, 1x Royal Canin Kitten 400g', 
      time: '10:45 AM', 
      status: 'Diproses', 
      statusBg: 'bg-emerald-100 text-emerald-700' 
    },
    { 
      id: '#INV-2024-8820', 
      name: 'Siti Aminah (Boni - Anjing)', 
      items: '1x Basic Grooming, 1x Obat Cacing Drontal', 
      time: '10:42 AM', 
      status: 'Menunggu', 
      statusBg: 'bg-orange-100 text-orange-700' 
    },
    { 
      id: '#INV-2024-8819', 
      name: 'Herman (Panda - Kucing)', 
      items: '1x Konsultasi Dokter, 1x Tindakan Rawat Luka', 
      time: '10:35 AM', 
      status: 'Selesai', 
      statusBg: 'bg-slate-100 text-slate-700' 
    },
    { 
      id: '#INV-2024-8818', 
      name: 'Bambang S. (Rocky - Anjing)', 
      items: '1x Pet Carrier Size L, 2x Jerky Dog Treats', 
      time: '10:30 AM', 
      status: 'Selesai', 
      statusBg: 'bg-slate-100 text-slate-700' 
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* TOP ROW: STATISTICS GRID */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Main Cashier Status */}
        <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Uang Kasir Sementara</p>
              <h1 className="text-3xl font-extrabold text-blue-600 mt-1">Rp 12.450.000</h1>
            </div>
            <div className="text-right">
              <span className="text-emerald-600 font-bold text-sm flex items-center gap-1 justify-end">
                ▲ +12%
              </span>
              <p className="text-[10px] text-slate-400">vs kemarin</p>
            </div>
          </div>
          
          {/* Minimal Trend Chart Simulation */}
          <div className="mt-6 h-24 w-full flex items-end gap-2">
            {[40, 55, 45, 70, 60, 85, 75, 95].map((height, i) => (
              <div key={i} className="flex-1 bg-blue-50 rounded-t-sm transition-all hover:bg-blue-100" style={{ height: `${height}%` }}></div>
            ))}
            <div className="flex-1 bg-blue-600 rounded-t-sm" style={{ height: '100%' }}></div>
          </div>
        </div>

        {/* Secondary Status Counters */}
        <div className="col-span-12 lg:col-span-4 grid grid-rows-3 gap-3">
          {shiftStats.map((stat, index) => (
            <div key={index} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm hover:border-blue-500 transition-colors cursor-default">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${stat.bgIcon} flex items-center justify-center`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">{stat.title}</p>
                  <p className="text-base font-bold text-slate-800">{stat.value}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400" />
            </div>
          ))}
        </div>

      </div>

      {/* MIDDLE ROW: PRIMARY ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button className="group h-32 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-between p-8 text-white shadow-md transition-all active:scale-[0.98]">
          <div className="text-left">
            <h2 className="text-xl font-bold">Transaksi Baru</h2>
            <p className="text-sm opacity-80 mt-1">Mulai tagihan klinik atau penjualan retail</p>
          </div>
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <PlusCircle className="h-8 w-8 text-white" />
          </div>
        </button>

        <button className="group h-32 bg-white border-2 border-dashed border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 rounded-xl flex items-center justify-between p-8 text-slate-800 shadow-sm transition-all active:scale-[0.98]">
          <div className="text-left">
            <h2 className="text-xl font-bold">Log Transaksi</h2>
            <p className="text-sm text-slate-400 mt-1">Akses log transaksi </p>
          </div>
          <div className="w-14 h-14 bg-slate-100 group-hover:bg-blue-100 group-hover:text-blue-600 rounded-full flex items-center justify-center transition-colors">
            <CreditCard className="h-6 w-6 text-slate-600 group-hover:text-blue-600" />
          </div>
        </button>
      </div>

      {/* BOTTOM SECTION: ANTREAN TERBARU TABLE */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b border-slate-200 bg-white">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Antrean Kasir & Klinik</h2>
            <p className="text-xs text-slate-400 mt-0.5">Real-time update status tagihan</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors text-slate-600">Filter</button>
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors text-slate-600">View All</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4 text-xs">No. Invoice</th>
                <th className="px-6 py-4 text-xs">Pemilik (Hewan)</th>
                <th className="px-6 py-4 text-xs">Layanan / Item</th>
                <th className="px-6 py-4 text-xs">Waktu</th>
                <th className="px-6 py-4 text-xs">Status</th>
                <th className="px-6 py-4 text-xs text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {queueList.map((queue, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-blue-600">{queue.id}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{queue.name}</td>
                  <td className="px-6 py-4 text-slate-500 max-w-xs truncate">{queue.items}</td>
                  <td className="px-6 py-4 text-slate-400 font-medium">{queue.time}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${queue.statusBg}`}>
                      {queue.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-1">
                    {queue.status === 'Selesai' ? (
                      <button className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors inline-flex items-center"><Eye className="h-4 w-4" /></button>
                    ) : (
                      <button className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors inline-flex items-center"><Edit className="h-4 w-4" /></button>
                    )}
                    <button className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors inline-flex items-center"><Printer className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination / Footer Table */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs text-slate-400 font-medium">
          <p>Menampilkan 4 dari 25 antrean</p>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white hover:bg-slate-50"><ChevronRight className="h-4 w-4 rotate-180" /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 text-white font-bold">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white hover:text-blue-600">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white hover:text-blue-600">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white hover:bg-slate-50"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default CashierDashboard;