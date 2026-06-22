import React, { useState, useEffect } from 'react';
import { FileText, Download, Loader2 } from 'lucide-react';
import { getFinancialReport } from '../../../services/adminService';

const FinancialReport = () => {
  const [financialData, setFinancialData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('Bulan Ini');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        let startDate = '';
        const endDate = new Date().toISOString().split('T')[0];

        if (dateFilter === '7 Hari Terakhir') {
          const start = new Date();
          start.setDate(start.getDate() - 7);
          startDate = start.toISOString().split('T')[0];
        } else if (dateFilter === 'Bulan Ini') {
          const start = new Date();
          start.setDate(1);
          startDate = start.toISOString().split('T')[0];
        } else if (dateFilter === 'Tahun Ini') {
          const start = new Date();
          start.setMonth(0, 1);
          startDate = start.toISOString().split('T')[0];
        }

        const response = await getFinancialReport(startDate, endDate);
        const data = response?.data?.revenue_by_date || response?.revenue_by_date || [];
        setFinancialData(data);
      } catch (error) {
        console.error('Error fetching financial report:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dateFilter]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Laporan Keuangan</h1>
          <p className="text-sm text-slate-500">Rekapitulasi pemasukan klinik Zeta Connect.</p>
        </div>
        <button className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Download className="h-4 w-4" /> Export
        </button>
      </div>

      <div className="rounded-md border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <select 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded border border-slate-300 bg-transparent px-3 py-1.5 text-sm outline-none"
          >
            <option value="7 Hari Terakhir">7 Hari Terakhir</option>
            <option value="Bulan Ini">Bulan Ini</option>
            <option value="Tahun Ini">Tahun Ini</option>
            <option value="Semua Waktu">Semua Waktu</option>
          </select>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-3 font-semibold">Tanggal</th>
              <th className="px-6 py-3 font-semibold">Jumlah Transaksi</th>
              <th className="px-6 py-3 font-semibold">Total Pemasukan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan="3" className="py-10 text-center text-slate-500">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600 mb-2" />
                  Memuat data keuangan...
                </td>
              </tr>
            ) : financialData.length > 0 ? (
              financialData.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-6 py-4">{formatDate(row.date)}</td>
                  <td className="px-6 py-4">{row.total_transactions} Transaksi</td>
                  <td className="px-6 py-4 font-bold text-black">{formatCurrency(row.total_revenue)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-10 text-center text-slate-500">
                  Belum ada data transaksi keuangan pada periode ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinancialReport;