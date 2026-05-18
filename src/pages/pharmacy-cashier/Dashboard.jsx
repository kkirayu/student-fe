import React, { useState } from 'react';
// Perbaikan import icon: Pills diubah menjadi Pill agar tidak crash
import { 
  Handbag, 
  BriefcaseMedical, 
  UserPlus, 
  TrendingUp, 
  AlertCircle, 
  Pill, 
  ExternalLink 
} from 'lucide-react';

const AdminDashboard = () => {
  // Data Master Obat
  const [medicines] = useState([
    { id: 1, name: 'Paracetamol', stock: 50, minStock: 100, category: 'Analgesik' },
    { id: 2, name: 'Amoxicillin', stock: 75, minStock: 150, category: 'Antibiotik' },
    { id: 3, name: 'Ibuprofen', stock: 200, minStock: 100, category: 'Analgesik' },
    { id: 4, name: 'Vitamin C', stock: 30, minStock: 200, category: 'Vitamin' },
    { id: 5, name: 'Antasida', stock: 120, minStock: 150, category: 'Pencernaan' },
  ]);

  // EFISIENSI: Hitung langsung data tanpa useEffect & state tambahan (Mencegah double-render)
  const lowStockMedicines = medicines.filter(m => m.stock < m.minStock);
  const totalItems = medicines.length;

  // Data untuk Stat Cards Grid
  const cardStats = [
    {
      title: 'Pembelian Bulan Ini',
      value: '100 Transaksi',
      change: '+12.5%',
      icon: <Handbag className="text-blue-600 h-6 w-6" />,
      bgIcon: 'bg-blue-100',
    },
    {
      title: 'Total Jenis Obat',
      value: `${totalItems} Item`, // Otomatis sinkron dengan jumlah data obat
      change: `+${totalItems} item`,
      icon: <BriefcaseMedical className="text-emerald-600 h-6 w-6" />,
      bgIcon: 'bg-emerald-100',
    },
    {
      title: 'Total Pasien Bulan Ini',
      value: '148 Pasien',
      change: '+18%',
      icon: <UserPlus className="text-orange-600 h-6 w-6" />,
      bgIcon: 'bg-orange-100',
    },
    {
      title: 'Kunjungan Hari Ini',
      value: '24',
      change: '-2%',
      icon: <TrendingUp className="text-purple-600 h-6 w-6" />,
      bgIcon: 'bg-purple-100',
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6 bg-slate-50 min-h-screen">
      
      {/* 1. Header Dashboard + Logo Link Menu Utama */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Dashboard Apotek & Inventaris</h1>
          <p className="text-gray-600 text-sm mt-1">Ringkasan ketersediaan stok obat dan barang terbaru</p>
          <div className="text-xs font-medium text-slate-400 mt-2">Update terakhir: 08 Mei 2026</div>
        </div>
        
        {/* Logo / Tombol navigasi ke halaman lain */}
        <a 
          href="/main-menu" // Ganti dengan route halaman tujuan Anda
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-all group hover:shadow-md self-start sm:self-center"
        >
          <Pill size={18} className="animate-pulse group-hover:rotate-45 transition-transform duration-300" />
          <span className="text-sm font-semibold tracking-wide">Menu Utama</span>
        </a>
      </div>

      {/* 2. Stat Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cardStats.map((stat, index) => (
          <div key={index} className="flex flex-col justify-between rounded-sm border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${stat.bgIcon} mb-4`}>
              {stat.icon}
            </div>
            <div className="mb-4">
              <h4 className="text-2xl font-bold text-black sm:text-xl md:text-2xl">{stat.value}</h4>
              <span className="text-sm font-medium text-slate-500">{stat.title}</span>
            </div>
            <div className="mt-auto flex items-center gap-2">
              <span className={`text-xs font-semibold ${stat.change.includes('+') ? 'text-emerald-500' : 'text-slate-400'}`}>
                {stat.change}
              </span>
              <span className="text-xs text-slate-400">dari Bulan lalu</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Section Grafik & Laporan Utama */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Grafik Pendapatan */}
        <div className="col-span-1 rounded-sm border border-slate-200 bg-white p-6 shadow-sm lg:col-span-8">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-xl font-bold text-black">Statistik Pendapatan</h3>
            <select className="rounded border border-slate-200 bg-transparent px-3 py-1.5 text-sm outline-none">
              <option>7 Hari Terakhir</option>
              <option>Bulan Ini</option>
            </select>
          </div>
          <div className="flex h-64 items-end justify-between gap-2 pt-4 sm:gap-4">
            {[40, 70, 45, 90, 65, 80, 50].map((height, i) => (
              <div key={i} className="group relative w-full flex-1">
                <div 
                  className="w-full rounded-t-sm bg-blue-600 transition-all hover:bg-blue-400" 
                  style={{ height: `${height}%` }}
                ></div>
                <span className="mt-2 block text-center text-xs text-slate-400 sm:text-sm">H-{6-i}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Laporan Kunjungan Pasien */}
        <div className="col-span-1 rounded-sm border border-slate-200 bg-white p-6 shadow-sm lg:col-span-4">
          <h3 className="mb-4 text-xl font-bold text-black">Jenis Pasien Terbanyak</h3>
          <div className="space-y-5">
            {[
              { label: 'Kucing', value: 65, color: 'bg-blue-600' },
              { label: 'Anjing', value: 25, color: 'bg-emerald-500' },
              { label: 'Burung', value: 10, color: 'bg-orange-400' },
            ].map((item, i) => (
              <div key={i}>
                <div className="mb-1.5 flex justify-between text-sm font-medium">
                  <span className="text-slate-700">{item.label}</span>
                  <span className="text-black">{item.value}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100">
                  <div className={`h-2.5 rounded-full ${item.color}`} style={{ width: `${item.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Stock Notifications (Super Responsive Auto-Fit Grid) */}
        <div className="col-span-1 lg:col-span-12 bg-white p-6 rounded-sm shadow-sm border border-slate-200 border-l-4 border-l-red-500">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <AlertCircle className="text-red-500" size={24} /> Peringatan Stok Tipis
            </h2>
            <a href="http://localhost:5173/admin/pharmacy-cashier/inventory/StockMonitoring" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 group">
              Kelola Inventaris <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Menggunakan minmax auto-fit: Kotak card otomatis melebar & mengisi ruang kosong sesuai jumlahnya */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
            {lowStockMedicines.length > 0 ? (
              lowStockMedicines.map(medicine => (
                <div 
                  key={medicine.id} 
                  className="flex flex-col justify-between bg-red-50/60 p-4 rounded-md border border-red-100 hover:bg-red-50 hover:shadow-sm transition-all"
                >
                  <div>
                    <span className="inline-block px-2 py-0.5 mb-2 text-[10px] font-bold tracking-wide uppercase rounded bg-red-100 text-red-800">
                      {medicine.category}
                    </span>
                    <p className="font-bold text-slate-800 text-sm break-words">{medicine.name}</p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-slate-200/60 flex justify-between items-center text-xs">
                    <span className="text-red-600 font-bold">Sisa: {medicine.stock}</span>
                    <span className="text-slate-400">Min: {medicine.minStock}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-8 text-gray-500 bg-slate-50 rounded-md border border-dashed border-slate-200">
                <p className="text-sm font-medium">Semua ketersediaan stok obat aman terjamin.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;