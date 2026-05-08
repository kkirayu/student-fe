import React from 'react';
import { Eye, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const TransactionLog = () => {
  const logs = [
    { id: 'INV-001', owner: 'Caca', pet: 'Mochi (Kucing)', date: '08 Mei 2026', total: 'Rp 250.000', status: 'Lunas' },
    { id: 'INV-002', owner: 'Galih', pet: 'Bona (Anjing)', date: '08 Mei 2026', total: 'Rp 450.000', status: 'Lunas' },
    { id: 'INV-003', owner: 'Sari', pet: 'Pio (Burung)', date: '07 Mei 2026', total: 'Rp 150.000', status: 'Dibatalkan' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Log Tagihan & Transaksi</h1>

      <div className="rounded-md border border-slate-200 bg-white shadow-sm">
        <div className="p-4 border-b border-slate-100">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input type="text" placeholder="Cari No. Invoice atau Nama Owner..." className="w-full rounded border border-slate-300 pl-9 pr-4 py-2 text-sm outline-none focus:border-blue-600" />
          </div>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-3 font-semibold">No. Invoice</th>
              <th className="px-6 py-3 font-semibold">Owner & Pasien</th>
              <th className="px-6 py-3 font-semibold">Tanggal</th>
              <th className="px-6 py-3 font-semibold">Total Tagihan</th>
              <th className="px-6 py-3 font-semibold text-center">Status</th>
              <th className="px-6 py-3 font-semibold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-blue-600">{log.id}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-black">{log.owner}</div>
                  <div className="text-xs text-slate-500">{log.pet}</div>
                </td>
                <td className="px-6 py-4">{log.date}</td>
                <td className="px-6 py-4 font-bold text-black">{log.total}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${log.status === 'Lunas' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {log.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <Link to={`/admin/reports/invoice/${log.id}`} className="inline-flex text-slate-400 hover:text-blue-600">
                    <Eye className="h-5 w-5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionLog;