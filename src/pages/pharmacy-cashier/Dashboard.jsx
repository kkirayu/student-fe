import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Handbag,
  BriefcaseMedical,
  UserPlus,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  PackageMinus,
  AlertTriangle,
  Plus,
  Package,
  ClipboardList,
  ShoppingCart,
  Truck,
  FileBarChart2,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import {
  getDashboardStats,
  getLowStockMedicines,
  getPatientDemographics
} from '../../services/pharmacyDashboardService';

const PharmacyDashboard = () => {
  const [lowStockMedicines, setLowStockMedicines] = useState([]);
  const [patientData, setPatientData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    monthly_transactions: 0,
    total_medicines: 0,
    monthly_patients: 0,
    today_visits: 0,
  });

  const COLORS = ["#2563EB", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"];

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const results = await Promise.allSettled([
        getDashboardStats(),
        getLowStockMedicines(),
        getPatientDemographics()
      ]);

      const [dashboardResult, lowStockResult, demographicsResult] = results;

      if (dashboardResult.status === 'fulfilled') {
        setStats(dashboardResult.value || {});
      } else {
        console.error('Dashboard stats error:', dashboardResult.reason);
      }

      if (lowStockResult.status === 'fulfilled') {
        setLowStockMedicines(Array.isArray(lowStockResult.value) ? lowStockResult.value : []);
      } else {
        console.error('Low stock error:', lowStockResult.reason);
      }

      if (demographicsResult.status === 'fulfilled') {
        setPatientData(Array.isArray(demographicsResult.value) ? demographicsResult.value : []);
      } else {
        console.error('Demographics error:', demographicsResult.reason);
      }

      const failedCount = results.filter(r => r.status === 'rejected').length;
      if (failedCount === results.length) {
        setError('Gagal memuat semua data dari server. Silakan periksa koneksi Anda.');
      } else if (failedCount > 0) {
        setError('Sebagian data gagal dimuat. Data yang tersedia tetap ditampilkan.');
      }
    } catch (err) {
      console.error('Dashboard Error:', err);
      setError(err.message || 'Gagal memuat data dari server. Silakan periksa koneksi Anda.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const chartData = useMemo(() => patientData.map((item) => ({
    name: item.species,
    value: Number(item.total),
  })), [patientData]);

  const totalPatients = useMemo(() => patientData.reduce((sum, item) => sum + Number(item.total || 0), 0), [patientData]);

  const cardStats = useMemo(() => [
    {
      title: 'Pembelian Bulan Ini',
      value: `${stats.monthly_transactions || 0} Transaksi`,
      icon: <Handbag className="text-blue-600 h-6 w-6" />,
      bgIcon: 'bg-blue-100',
    },
    {
      title: 'Total Jenis Obat',
      value: `${stats.total_medicines || 0} Item`,
      icon: <BriefcaseMedical className="text-emerald-600 h-6 w-6" />,
      bgIcon: 'bg-emerald-100',
    },
    {
      title: 'Total Pasien Bulan Ini',
      value: `${stats.monthly_patients || 0} Pasien`,
      icon: <UserPlus className="text-orange-600 h-6 w-6" />,
      bgIcon: 'bg-orange-100',
    },
    {
      title: 'Kunjungan Hari Ini',
      value: stats.today_visits || 0,
      icon: <TrendingUp className="text-purple-600 h-6 w-6" />,
      bgIcon: 'bg-purple-100',
    },
  ], [stats]);

  const quickActions = [
    {
      title: "Tambah Obat",
      icon: <Plus size={22} />,
      color: "bg-blue-100 text-blue-600",
      href: "/pharmacy/inventory",
    },
    {
      title: "Inventaris",
      icon: <Package size={22} />,
      color: "bg-emerald-100 text-emerald-600",
      href: "/pharmacy/inventory/monitoring",
    },
    {
      title: "Antrean Resep",
      icon: <ClipboardList size={22} />,
      color: "bg-orange-100 text-orange-600",
      href: "/pharmacy/prescriptions",
    },
    {
      title: "Pembelian",
      icon: <ShoppingCart size={22} />,
      color: "bg-purple-100 text-purple-600",
      href: "/cashier",
    },
    {
      title: "Supplier",
      icon: <Truck size={22} />,
      color: "bg-cyan-100 text-cyan-600",
      href: "/pharmacy/supplier",
    },
    {
      title: "Laporan Mutasi",
      icon: <FileBarChart2 size={22} />,
      color: "bg-red-100 text-red-600",
      href: "/pharmacy/stock-mutations",
    },
  ];

  if (loading) {
    return (
      <div className="p-6 flex items-center gap-2 text-slate-500 animate-pulse">
        <RefreshCw className="animate-spin" size={20} />
        <span>Loading Dashboard...</span>
      </div>
    );
  }

  const isFullError = error && stats.monthly_transactions === 0 && stats.total_medicines === 0 && lowStockMedicines.length === 0 && patientData.length === 0;
  if (isFullError) {
    return (
      <div className="p-6 max-w-2xl mx-auto my-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center shadow-sm">
          <div className="flex justify-center mb-3 text-red-500">
            <AlertCircle size={40} />
          </div>
          <h3 className="text-lg font-bold text-red-800 mb-2">Gagal Memuat Dashboard</h3>
          <p className="text-sm text-red-600 mb-6">{error}</p>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-sm text-sm font-semibold hover:bg-red-700 transition shadow-sm"
          >
            <RefreshCw size={16} />
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {error && (
        <div className="flex items-center justify-between gap-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-amber-500 shrink-0" size={18} />
            <p className="text-sm text-amber-700">{error}</p>
          </div>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-1.5 rounded bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-200 transition shrink-0"
          >
            <RefreshCw size={14} />
            Muat Ulang
          </button>
        </div>
      )}

      {/* 1. Dashboard Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Dashboard Apotek</h1>
          <p className="mt-1 text-sm text-slate-500">
            Selamat datang kembali. Berikut ringkasan aktivitas apotek hari ini.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs text-slate-500">Hari Ini</p>
            <p className="font-semibold text-slate-700">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <button
            onClick={fetchData}
            className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm hover:bg-slate-50 transition"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* 2. Quick Actions */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-slate-800">Quick Actions</h2>
          <p className="text-sm text-slate-500">Akses cepat ke menu yang sering digunakan.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
          {quickActions.map((action, index) => (
            <a
              key={index}
              href={action.href}
              className="group flex flex-col items-center rounded-xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
            >
              <div className={`mb-3 flex h-14 w-14 items-center justify-center rounded-full ${action.color}`}>
                {action.icon}
              </div>
              <span className="text-center text-sm font-semibold text-slate-700 group-hover:text-blue-600">
                {action.title}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* 3. Card Stats (4 columns) */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cardStats.map((stat, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-full ${stat.bgIcon}`}>
              {stat.icon}
            </div>
            <h2 className="text-4xl font-bold text-slate-800">{stat.value}</h2>
            <p className="mt-1 text-sm text-slate-500">{stat.title}</p>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 via-cyan-400 to-transparent opacity-20" />
          </div>
        ))}
      </div>

      {/* 4. Split Layout: Donut Chart (Kiri) & Low Stock (Kanan) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* KIRI: Jenis Pasien (Donut Chart) */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">Jenis Pasien</h2>
            <p className="text-sm text-slate-500">Distribusi pasien berdasarkan jenis hewan</p>
          </div>

          <div className="flex-1 flex flex-col xl:flex-row gap-6 items-center">
            {/* Chart */}
            <div className="h-64 w-full xl:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-col justify-center gap-3 w-full xl:w-1/2">
              {chartData.map((item, index) => {
                const percentage = totalPatients > 0 ? Math.round((item.value / totalPatients) * 100) : 0;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-slate-100 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div>
                        <h4 className="font-semibold text-slate-700 text-sm">{item.name}</h4>
                        <p className="text-xs text-slate-500">{item.value} Pasien</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-700 text-sm">{percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* KANAN: Low Stock */}
        <div className="rounded-xl border border-red-200 bg-white p-6 shadow-sm border-l-4 border-l-red-500 flex flex-col">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-red-100 p-3">
                <PackageMinus className="text-red-600" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Stok Tipis</h2>
                <p className="text-sm text-slate-500">Segera restock obat</p>
              </div>
            </div>
            <a
              href="/pharmacy/inventory/monitoring"
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-slate-50 flex items-center gap-1"
            >
              Kelola
              <ExternalLink size={12} />
            </a>
          </div>

          <div className="flex-1 overflow-y-auto pr-1" style={{ maxHeight: '350px' }}>
            {lowStockMedicines.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                {lowStockMedicines.map((medicine) => {
                  const percentage = Math.min((medicine.current_stock / medicine.min_stock) * 100, 100);
                  return (
                    <div
                      key={medicine.id}
                      className="rounded-xl border border-slate-200 p-4 transition hover:border-red-300 hover:shadow-md"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase text-red-700">
                          {medicine.category}
                        </span>
                        <AlertTriangle className="text-red-500" size={16} />
                      </div>
                      <h3 className="mb-3 text-base font-bold text-slate-800 line-clamp-1" title={medicine.name}>
                        {medicine.name}
                      </h3>
                      <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-1.5 rounded-full bg-gradient-to-r from-red-500 to-orange-400"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs">
                        <div>
                          <p className="text-slate-400">Sisa Stok</p>
                          <p className="font-bold text-red-600">{medicine.current_stock}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-400">Minimum</p>
                          <p className="font-bold">{medicine.min_stock}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-full min-h-[150px] items-center justify-center text-slate-400 text-sm">
                Semua stok obat dalam kondisi aman.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PharmacyDashboard;