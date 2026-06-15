import React, { useState, useEffect } from 'react';
import {
  Handbag,
  BriefcaseMedical,
  UserPlus,
  TrendingUp,
  AlertCircle,
  Pill,
  ExternalLink,
  RefreshCw // Menambahkan icon untuk reload
} from 'lucide-react';

import {
  getDashboardStats,
  getLowStockMedicines,
  getPatientDemographics
} from '../../services/pharmacyDashboardService';

const PharmacyDashboard = () => {
  const [medicines, setMedicines] = useState([]);
  const [stats, setStats] = useState({
    monthly_transactions: 0,
    total_medicines: 0,
    monthly_patients: 0,
    today_visits: 0,
  });
  const [patientData, setPatientData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State baru untuk menangani error

  // Fungsi dipindahkan ke luar useEffect agar bisa digunakan untuk tombol "Coba Lagi"
  const fetchData = async () => {
    setLoading(true);
    setError(null); // Reset error setiap kali mencoba mengambil data

    try {
      // Menggunakan Promise.allSettled agar kegagalan satu API
      // tidak menghancurkan seluruh dashboard
      const results = await Promise.allSettled([
        getDashboardStats(),
        getLowStockMedicines(),
        getPatientDemographics()
      ]);

      const [dashboardResult, lowStockResult, demographicsResult] = results;

      // Proses setiap hasil secara independen
      if (dashboardResult.status === 'fulfilled') {
        setStats(dashboardResult.value || {});
      } else {
        console.error('Dashboard stats error:', dashboardResult.reason);
      }

      if (lowStockResult.status === 'fulfilled') {
        const data = lowStockResult.value;
        setMedicines(Array.isArray(data) ? data : []);
      } else {
        console.error('Low stock error:', lowStockResult.reason);
        setMedicines([]);
      }

      if (demographicsResult.status === 'fulfilled') {
        const data = demographicsResult.value;
        setPatientData(Array.isArray(data) ? data : []);
      } else {
        console.error('Demographics error:', demographicsResult.reason);
        setPatientData([]);
      }

      // Tampilkan peringatan jika ada sebagian data yang gagal dimuat
      const failedCount = results.filter(r => r.status === 'rejected').length;
      if (failedCount === results.length) {
        setError('Gagal memuat semua data dari server. Silakan periksa koneksi Anda.');
      } else if (failedCount > 0) {
        setError('Sebagian data gagal dimuat. Data yang tersedia tetap ditampilkan.');
      }
    } catch (error) {
      console.error('Dashboard Error:', error);
      setError(error.message || 'Gagal memuat data dari server. Silakan periksa koneksi Anda.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const lowStockMedicines = medicines;

  const cardStats = [
    {
      title: 'Pembelian Bulan Ini',
      value: `${stats.monthly_transactions || 0} Transaksi`,
      change: '+0%',
      icon: <Handbag className="text-blue-600 h-6 w-6" />,
      bgIcon: 'bg-blue-100',
    },
    {
      title: 'Total Jenis Obat',
      value: `${stats.total_medicines || 0} Item`,
      change: '+0%',
      icon: <BriefcaseMedical className="text-emerald-600 h-6 w-6" />,
      bgIcon: 'bg-emerald-100',
    },
    {
      title: 'Total Pasien Bulan Ini',
      value: `${stats.monthly_patients || 0} Pasien`,
      change: '+0%',
      icon: <UserPlus className="text-orange-600 h-6 w-6" />,
      bgIcon: 'bg-orange-100',
    },
    {
      title: 'Kunjungan Hari Ini',
      value: stats.today_visits || 0,
      change: '+0%',
      icon: <TrendingUp className="text-purple-600 h-6 w-6" />,
      bgIcon: 'bg-purple-100',
    },
  ];

  // 1. Handling State Loading
  if (loading) {
    return (
      <div className="p-6 flex items-center gap-2 text-slate-500 animate-pulse">
        <RefreshCw className="animate-spin" size={20} />
        <span>Loading Dashboard...</span>
      </div>
    );
  }

  // 2. Handling State Error TOTAL (semua API gagal)
  const isFullError = error && stats.monthly_transactions === 0 && stats.total_medicines === 0 && medicines.length === 0 && patientData.length === 0;
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

  const totalPatients = patientData.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0
  );

  return (
    <div className="space-y-6 p-6"> {/* Membungkus komponen agar tata letak rapi */}
      {/* Banner peringatan jika ada sebagian data yang gagal dimuat */}
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
      {/* Card Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cardStats.map((stat, index) => (
          <div
            key={index}
            className="flex flex-col justify-between rounded-sm border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.bgIcon} mb-4`}>
              {stat.icon}
            </div>

            <div>
              <h4 className="text-2xl font-bold">
                {stat.value}
              </h4>
              <span className="text-sm text-slate-500">
                {stat.title}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Jenis Pasien */}
      <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
        <h3 className="mb-4 text-xl font-bold">
          Jenis Pasien Terbanyak
        </h3>

        <div className="space-y-5">
          {patientData.length > 0 ? (
            patientData.map((item, index) => {
              const percentage =
                totalPatients > 0
                  ? Math.round((item.total / totalPatients) * 100)
                  : 0;

              return (
                <div key={index}>
                  <div className="mb-1.5 flex justify-between text-sm font-medium">
                    <span>{item.species}</span>
                    <span>{percentage}%</span>
                  </div>

                  <div className="h-2.5 w-full rounded-full bg-slate-100">
                    <div
                      className="h-2.5 rounded-full bg-blue-600"
                      style={{
                        width: `${percentage}%`
                      }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-slate-500 text-sm">
              Belum ada data pasien.
            </p>
          )}
        </div>
      </div>

      {/* Low Stock */}
      <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200 border-l-4 border-l-red-500">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <AlertCircle
              className="text-red-500"
              size={24}
            />
            Peringatan Stok Tipis
          </h2>

          <a
            href="/pharmacy/inventory/monitoring"
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
          >
            Kelola Inventaris
            <ExternalLink size={14} />
          </a>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
          {lowStockMedicines.length > 0 ? (
            lowStockMedicines.map((medicine) => (
              <div
                key={medicine.id}
                className="flex flex-col justify-between bg-red-50 p-4 rounded-md border border-red-100"
              >
                <div>
                  <span className="inline-block px-2 py-0.5 mb-2 text-[10px] font-bold uppercase rounded bg-red-100 text-red-800">
                    {medicine.category}
                  </span>
                  <p className="font-bold text-sm">
                    {medicine.name}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t flex justify-between text-xs">
                  <span className="text-red-600 font-bold">
                    Sisa: {medicine.current_stock}
                  </span>
                  <span className="text-slate-400">
                    Min: {medicine.min_stock}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex justify-center py-8 text-gray-500">
              Semua stok obat dalam kondisi aman.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PharmacyDashboard;