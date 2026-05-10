import React from 'react';
import { Users, DollarSign, UserPlus } from 'lucide-react';
import { 
  Dog, 
  Cat, 
  Calendar, 
  Activity, 
  TrendingUp, 
  ArrowUpRight 
} from 'lucide-react';

const OwnerDashboard = () => {
  const stats = [
    {
      title: 'Total Pet Terdaftar',
      value: '10 Ekor',
      change: '+12.5%',
      icon: <Dog className="text-blue-600 h-6 w-6" />, 
      bgIcon: 'bg-blue-100',
    },
    {
      title: 'Kucing (Aktif)',
      value: '8 Ekor',
      change: '+5%',
      icon: <Cat className="text-emerald-600 h-6 w-6" />,
      bgIcon: 'bg-emerald-100',
    },
    {
      title: 'Check-up Hari Ini',
      value: '24 Janji',
      change: '+18%',
      icon: <Calendar className="text-orange-600 h-6 w-6" />,
      bgIcon: 'bg-orange-100',
    },
    {
      title: 'Kesehatan Rata-rata',
      value: '92%',
      change: 'Stabil',
      icon: <Activity className="text-purple-600 h-6 w-6" />,
      bgIcon: 'bg-purple-100',
    },
  ];

    const revenueData = [
    { label: 'H-6', value: 1800000 },
    { label: 'H-5', value: 2100000 },
    { label: 'H-4', value: 1500000 },
    { label: 'H-3', value: 2400000 },
    { label: 'H-2', value: 3200000 },
    { label: 'H-1', value: 4800000 },
    { label: 'H-0', value: 3900000 },
  ];

  const maxRevenue = Math.max(...revenueData.map((d) => d.value));

 return (
    <div className="space-y-6">
      {/* 1. Header Dashboard */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Ringkasan Klinik Hewan</h1>
        <div className="text-sm font-medium text-slate-500">Update terakhir: 10 Mei 2026</div>
      </div>

      {/* 2. Stat Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col justify-between rounded-sm border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            
            {/* Bagian Ikon - Sekarang stat.icon sudah ada isinya */}
            <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${stat.bgIcon} mb-4`}>
              {stat.icon}
            </div>
            
            {/* Bagian Teks Utama */}
            <div className="mb-4">
              <h4 className="text-2xl font-bold text-black sm:text-xl md:text-2xl">{stat.value}</h4>
              <span className="text-sm font-medium text-slate-500">{stat.title}</span>
            </div>
            
            {/* Bagian Persentase */}
            <div className="mt-auto flex items-center gap-2">
              <span className={`text-xs font-semibold ${stat.change.includes('+') ? 'text-emerald-500' : 'text-slate-400'}`}>
                {stat.change}
              </span>
              <span className="text-xs text-slate-400">vs bulan lalu</span>
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
            <select className="rounded border border-slate-200 bg-transparent px-3 py-1.5 text-sm outline-none border-slate-300">
              <option>7 Hari Terakhir</option>
              <option>Bulan Ini</option>
            </select>
          </div>

          <div className="flex h-64 items-end justify-between gap-2 pt-10 sm:gap-4 relative">
             <div className="absolute left-0 top-1/2 w-full border-t border-dashed border-slate-100"></div>
             
            {revenueData.map((item, i) => (
              <div key={i} className="group relative w-full flex-1 flex flex-col items-center">
                {/* Tooltip Angka Rupiah */}
                <div className="invisible absolute bottom-full mb-2 flex flex-col items-center group-hover:visible z-10 transition-all duration-200">
                  <div className="rounded bg-slate-800 px-2 py-1 text-[10px] font-bold text-white whitespace-nowrap shadow-lg">
                    Rp {item.value.toLocaleString('id-ID')}
                  </div>
                  <div className="h-1 w-1 bg-slate-800 rotate-45 -mt-0.5"></div>
                </div>

                <div 
                  className={`w-full max-w-[40px] rounded-t-sm transition-all duration-500 cursor-pointer
                    ${item.value === maxRevenue ? 'bg-blue-600' : 'bg-blue-400 hover:bg-blue-500'}
                  `} 
                  style={{ height: `${(item.value / maxRevenue) * 100}%` }}
                ></div>
                <span className="mt-3 block text-center text-xs text-slate-400 sm:text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Laporan Kunjungan Pasien */}
        <div className="col-span-1 rounded-sm border border-slate-200 bg-white p-6 shadow-sm lg:col-span-4">
          <h3 className="mb-4 text-xl font-bold text-black">Jenis Pasien Terbanyak</h3>
          <div className="space-y-5">
            {[
              { label: 'Kucing (Oren, Troton, Bebek)', value: 60, color: 'bg-blue-600' },
              { label: 'Anjing (Mei-mei, Arifin)', value: 35, color: 'bg-emerald-500' },
              { label: 'Lainnya', value: 5, color: 'bg-orange-400' },
            ].map((item, i) => (
              <div key={i}>
                <div className="mb-1.5 flex justify-between text-sm font-medium">
                  <span className="text-slate-700 text-xs sm:text-sm">{item.label}</span>
                  <span className="text-black">{item.value}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100">
                  <div className={`h-2.5 rounded-full ${item.color} transition-all duration-700`} style={{ width: `${item.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Analisis Singkat menggunakan ikon TrendingUp dari Lucide */}
          <div className="mt-10 p-4 bg-slate-50 rounded-sm border border-slate-200">
             <div className="flex items-center gap-2 mb-2 text-slate-800">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Insight</span>
             </div>
             <p className="text-[11px] text-slate-600 leading-relaxed italic">
                "Populasi <b>Kucing</b> mendominasi 60% kunjungan. Tren menunjukkan kenaikan pada hari libur (H-1)."
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;