import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Package, 
  FileSpreadsheet, 
  ArrowUpRight, 
  Download, 
  Calendar, 
  Loader2,
  DollarSign,
  ClipboardList
} from 'lucide-react';
import { showInfo } from '../../../utils/alertUtils';

const ReportOverview = () => {
  const [reportStats, setReportStats] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    averageBill: 0,
    itemCount: 0
  });
  const [recentReports, setRecentReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('2026');

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await fetch('https://dummyjson.com/carts');
        const data = await response.json();

        const revenue = data.carts.reduce((acc, cart) => acc + (cart.total * 15000), 0);
        const transactions = data.total || data.carts.length;
        const avg = transactions > 0 ? Math.round(revenue / transactions) : 0;
        const items = data.carts.reduce((acc, cart) => acc + cart.totalProducts, 0);

        setReportStats({
          totalRevenue: revenue,
          totalTransactions: transactions,
          averageBill: avg,
          itemCount: items
        });

        const mappedReports = data.carts.slice(0, 5).map((cart, index) => {
          const types = ['Laporan Keuangan Bulanan', 'Analisis Demografi Pasien', 'Ringkasan Mutasi Stok Apotek', 'Log Transaksi Kasir', 'Rekapitulasi Kunjungan Klinis'];
          const paths = ['/admin/reports/financial', '/admin/reports/demographics', '/admin/reports/stock-mutation', '/admin/reports/transactions', '/admin/reports/demographics'];
          return {
            id: cart.id,
            title: types[index % types.length],
            category: index % 2 === 0 ? 'Finansial' : 'Operasional',
            generatedAt: `23 Mei 2026 - 0${1 + index}:45 WIB`,
            size: `${(cart.totalQuantity * 1.2).toFixed(1)} KB`,
            path: paths[index % paths.length]
          };
        });

        setRecentReports(mappedReports);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const reportModules = [
    {
      title: 'Laporan Keuangan',
      description: 'Analisis arus kas, pendapatan klinik, laba bersih, dan pelacakan invoice.',
      path: '/admin/reports/financial',
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100'
    },
    {
      title: 'Demografi Kunjungan',
      description: 'Statistik ras, spesies hewan peliharaan, dan tren sebaran wilayah pemilik.',
      path: '/admin/reports/demographics',
      icon: Users,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100'
    },
    {
      title: 'Log Transaksi',
      description: 'Riwayat lengkap seluruh audit transaksi kasir dan validasi pembayaran POS.',
      path: '/admin/reports/transactions',
      icon: FileSpreadsheet,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100'
    },
    {
      title: 'Mutasi Stok Obat',
      description: 'Pencatatan keluar masuk item apotek, penyesuaian stok, dan batch kedalwarsa.',
      path: '/admin/reports/stock-mutation',
      icon: Package,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Laporan Klinik & Analitik</h1>
          <p className="text-sm text-slate-500 font-medium">Pusat data summary eksekutif operasional dan finansial Zeta Connect.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Calendar className="h-4 w-4" />
            </span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="rounded border border-slate-300 bg-white py-2 pl-9 pr-8 text-sm font-medium text-slate-700 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            >
              <option value="2026">Tahun 2026</option>
              <option value="2025">Tahun 2025</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-blue-500 bg-white border border-slate-200 rounded-sm shadow-sm">
          <Loader2 className="h-10 w-10 animate-spin mb-3" />
          <p className="text-sm font-medium text-slate-500">Mengkalkulasi summary laporan...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Akumulasi Pendapatan</span>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(reportStats.totalRevenue)}</h3>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded w-fit">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>+14.2% Bulan Ini</span>
              </div>
            </div>

            <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Volume Transaksi</span>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">{reportStats.totalTransactions} Invoice</h3>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <span>Rata-rata aktivitas harian stabil</span>
              </div>
            </div>

            <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Rataan Nilai Bill</span>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(reportStats.averageBill)}</h3>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded w-fit">
                <span>Per Siklus Kunjungan</span>
              </div>
            </div>

            <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Produk Medis Keluar</span>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">{reportStats.itemCount} Item</h3>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <span>Obat, Vaksin & Makanan</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Pilih Ruang Lingkup Dokumen Laporan
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {reportModules.map((module, idx) => {
                const IconComponent = module.icon;
                return (
                  <div key={idx} className="group relative flex flex-col justify-between rounded-sm border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-slate-300">
                    <div>
                      <div className={`flex h-10 w-10 items-center justify-center rounded-sm ${module.bgColor} ${module.color} border ${module.borderColor} mb-4`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <h3 className="text-base font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {module.title}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-500 font-medium">
                        {module.description}
                      </p>
                    </div>
                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <Link 
                        to={module.path}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                      >
                        Buka Laporan
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-sm border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 p-4 bg-white flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-slate-500" />
              <h3 className="font-bold text-slate-800 text-base">Berkas Laporan Terkini</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full table-auto text-left">
                <thead>
                  <tr className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <th className="px-6 py-4">Nama Dokumen</th>
                    <th className="px-6 py-4">Kategori Klasifikasi</th>
                    <th className="px-6 py-4">Waktu Pembuatan</th>
                    <th className="px-6 py-4">Ukuran File</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-600">
                  {recentReports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <Link to={report.path} className="font-bold text-slate-800 hover:text-blue-600 transition-colors block">
                          {report.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-sm px-2 py-0.5 text-xs font-bold border ${
                          report.category === 'Finansial' 
                            ? 'bg-blue-50 text-blue-700 border-blue-100' 
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}>
                          {report.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {report.generatedAt}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {report.size}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => showInfo('Unduh Laporan', 'Mengunduh spreadsheet dokumen laporan...')}
                          className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-colors inline-flex items-center gap-1 text-xs font-semibold"
                          title="Download Spreadsheet"
                        >
                          <Download className="h-4 w-4" />
                          <span>Export</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportOverview;