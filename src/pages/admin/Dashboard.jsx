import React from 'react';
import { Users, DollarSign, UserPlus, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    {
      title: 'Total Pendapatan Hari Ini',
      value: 'Rp 2.450.000',
      change: '+12.5%',
      icon: <DollarSign className="text-blue-600 h-6 w-6" />,
      bgIcon: 'bg-blue-100',
    },
    {
      title: 'Jumlah Staf Aktif',
      value: '12 Orang',
      change: 'Stabil',
      icon: <Users className="text-emerald-600 h-6 w-6" />,
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
    <div className="space-y-6">
      {/* 1. Header Dashboard */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Ringkasan Klinik</h1>
        <div className="text-sm font-medium text-slate-500">Update terakhir: 08 Mei 2026</div>
      </div>

      {/* 2. Stat Cards Grid (Sudah dibuat Full Responsive) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col justify-between rounded-sm border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            
            {/* Bagian Ikon */}
            <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${stat.bgIcon} mb-4`}>
              {stat.icon}
            </div>
            
            {/* Bagian Teks Utama (Rata Kiri) */}
            <div className="mb-4">
              <h4 className="text-2xl font-bold text-black sm:text-xl md:text-2xl">{stat.value}</h4>
              <span className="text-sm font-medium text-slate-500">{stat.title}</span>
            </div>
            
            {/* Bagian Persentase di Bawah */}
            <div className="mt-auto flex items-center gap-2">
              <span className={`text-xs font-semibold ${stat.change.includes('+') ? 'text-emerald-500' : 'text-slate-400'}`}>
                {stat.change}
              </span>
              <span className="text-xs text-slate-400">dari periode lalu</span>
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
          {/* Visual Mockup Grafik Bar */}
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
      </div>
    </div>
  );
};

export default AdminDashboard;