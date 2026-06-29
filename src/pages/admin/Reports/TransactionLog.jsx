import React, { useState, useEffect } from 'react';
import { Eye, Search, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';

// Helper format Rupiah
const formatRupiah = (number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number ?? 0);

const TransactionLog = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/invoices');
        // Backend pagination (response.data.data) or direct array (response.data)
        const data = response.data.data?.data || response.data.data || response.data;
        setLogs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch transaction logs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    if (!searchQuery) return true;
    const lowerQuery = searchQuery.toLowerCase();
    return log.id.toLowerCase().includes(lowerQuery) || 
           (log.owner?.name || '').toLowerCase().includes(lowerQuery);
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Log Tagihan & Transaksi</h1>

      <div className="rounded-md border border-slate-200 bg-white shadow-sm">
        <div className="p-4 border-b border-slate-100">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari No. Invoice atau Nama Owner..." 
              className="w-full rounded border border-slate-300 pl-9 pr-4 py-2 text-sm outline-none focus:border-blue-600" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
            {isLoading ? (
              <tr>
                <td colSpan="6" className="py-10 text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
                  <p className="mt-2 text-sm text-slate-500">Memuat log transaksi...</p>
                </td>
              </tr>
            ) : filteredLogs.length > 0 ? (
              filteredLogs.map((log) => {
                const ownerName = log.owner?.name || '-';
                const petName = log.appointment?.pet?.name || '-';
                const petSpecies = log.appointment?.pet?.species || '-';
                
                // Hitung total_amount jika tidak ada secara eksplisit
                const totalAmount = log.total_amount || log.items?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;
                const statusLabel = log.status === 'Paid' ? 'Lunas' : (log.status === 'Unpaid' ? 'Belum Lunas' : 'Dibatalkan');
                const isPaid = log.status === 'Paid';

                return (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-blue-600">{log.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-black">{ownerName}</div>
                      <div className="text-xs text-slate-500">{petName} ({petSpecies})</div>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(log.created_at).toLocaleDateString('id-ID', {
                        day: '2-digit', month: 'long', year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 font-bold text-black">{formatRupiah(totalAmount)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${isPaid ? 'bg-emerald-100 text-emerald-700' : (log.status === 'Unpaid' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700')}`}>
                        {statusLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link to={`/admin/reports/invoice/${log.id}`} className="inline-flex text-slate-400 hover:text-blue-600">
                        <Eye className="h-5 w-5" />
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="py-6 text-center text-slate-500 text-sm">
                  Tidak ada transaksi yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionLog;