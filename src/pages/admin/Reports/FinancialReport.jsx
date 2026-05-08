import React from 'react';
import { FileText, Download } from 'lucide-react';

const FinancialReport = () => {
  const financialData = [
    { date: '08 Mei 2026', income: 'Rp 2.450.000', transactions: 12 },
    { date: '07 Mei 2026', income: 'Rp 1.800.000', transactions: 8 },
    { date: '06 Mei 2026', income: 'Rp 3.100.000', transactions: 15 },
  ];

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
          <select className="rounded border border-slate-300 bg-transparent px-3 py-1.5 text-sm outline-none">
            <option>7 Hari Terakhir</option>
            <option>Bulan Ini</option>
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
            {financialData.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-6 py-4">{row.date}</td>
                <td className="px-6 py-4">{row.transactions} Transaksi</td>
                <td className="px-6 py-4 font-bold text-black">{row.income}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinancialReport;