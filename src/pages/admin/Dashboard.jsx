import React, { useState, useEffect } from 'react';
import { Users, DollarSign, UserPlus, TrendingUp, Loader2 } from 'lucide-react';
import { getAdminDashboardStats } from '../../services/adminService';

// Helper format Rupiah
const formatRupiah = (number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number ?? 0);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getAdminDashboardStats();
        setData(res.data);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const todayStr = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date());

  const stats = [
    {
      title: 'Total Pendapatan Hari Ini',
      value: formatRupiah(data?.total_revenue_today || 0),
      change: 'Hari Ini',
      icon: <DollarSign className="text-blue-600 h-6 w-6" />,
      bgIcon: 'bg-blue-100',
    },
    {
      title: 'Jumlah Staf Aktif',
      value: `${data?.active_staff_count || 0} Orang`,
      change: 'Saat Ini',
      icon: <Users className="text-emerald-600 h-6 w-6" />,
      bgIcon: 'bg-emerald-100',
    },
    {
      title: 'Total Pasien Bulan Ini',
      value: `${data?.total_patients_this_month || 0} Pasien`,
      change: 'Bulan Ini',
      icon: <UserPlus className="text-orange-600 h-6 w-6" />,
      bgIcon: 'bg-orange-100',
    },
    {
      title: 'Kunjungan Hari Ini',
      value: data?.visits_today || 0,
      change: 'Hari Ini',
      icon: <TrendingUp className="text-purple-600 h-6 w-6" />,
      bgIcon: 'bg-purple-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Dashboard */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Ringkasan Klinik</h1>
        <div className="text-sm font-medium text-slate-500">Update terakhir: {todayStr}</div>
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
              <span className={`text-xs font-semibold text-slate-400`}>
                {stat.change}
              </span>
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
          {/* Visual Bar Revenue */}
          <div className="flex h-64 items-end justify-between gap-2 pt-4 sm:gap-4">
            {data?.revenue_chart && data.revenue_chart.length > 0 ? (
              data.revenue_chart.map((chartItem, i) => {
                // Cari max untuk proporsi persentase tinggi
                const maxRevenue = Math.max(...data.revenue_chart.map(r => Number(r.total_revenue) || 0));
                const heightPercentage = maxRevenue > 0 ? ((Number(chartItem.total_revenue) || 0) / maxRevenue) * 100 : 0;
                
                return (
                  <div key={i} className="group relative w-full flex-1">
                    <div 
                      className="w-full rounded-t-sm bg-blue-600 transition-all hover:bg-blue-400" 
                      style={{ height: `${heightPercentage}%`, minHeight: '4px' }}
                      title={formatRupiah(chartItem.total_revenue)}
                    ></div>
                    <span className="mt-2 block text-center text-xs text-slate-400 sm:text-[10px]">
                      {new Date(chartItem.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="flex w-full h-full items-center justify-center text-slate-400 text-sm">
                Tidak ada data pendapatan dalam 7 hari terakhir.
              </div>
            )}
          </div>
        </div>

        {/* Laporan Kunjungan Pasien */}
        <div className="col-span-1 rounded-sm border border-slate-200 bg-white p-6 shadow-sm lg:col-span-4">
          <h3 className="mb-4 text-xl font-bold text-black">Jenis Pasien Terbanyak</h3>
          <div className="space-y-5">
            {data?.species_distribution && data.species_distribution.length > 0 ? (
              data.species_distribution.map((item, i) => {
                // Pilih warna berdasarkan index
                const colors = ['bg-blue-600', 'bg-emerald-500', 'bg-orange-400', 'bg-purple-500', 'bg-rose-500'];
                const color = colors[i % colors.length];
                return (
                  <div key={i}>
                    <div className="mb-1.5 flex justify-between text-sm font-medium">
                      <span className="text-slate-700">{item.species}</span>
                      <span className="text-black">{item.percentage}% ({item.count})</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-100">
                      <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${item.percentage}%` }}></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-slate-400">Belum ada data kunjungan.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;