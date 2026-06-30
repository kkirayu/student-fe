import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Calendar, Download, Printer, Eye, ChevronRight, Loader2 } from 'lucide-react';
import api from '../../../services/api';

const formatRupiah = (number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number ?? 0);

const LogTransaction = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [transactionLogs, setTransactionLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/invoices');
        const data = response.data?.data?.data || response.data?.data || response.data || [];
        setTransactionLogs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch transaction logs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = transactionLogs.filter(log => {
    if (!searchTerm) return true;
    const lowerQuery = searchTerm.toLowerCase();
    return log.id.toLowerCase().includes(lowerQuery) || 
           (log.owner?.name || '').toLowerCase().includes(lowerQuery);
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link to="/cashier" className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-600">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Log Transaksi</h1>
            <p className="text-sm text-slate-500 mt-1">Riwayat lengkap penjualan dan layanan klinik</p>
          </div>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
          <Download className="h-4 w-4" />
          Export Data
        </button>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 bg-slate-50 outline-none transition-all"
            placeholder="Cari no. invoice atau nama pelanggan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 bg-white rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors text-slate-700">
            <Calendar className="h-4 w-4 text-slate-400" />
            Hari Ini
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 bg-white rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors text-slate-700">
            <Filter className="h-4 w-4 text-slate-400" />
            Status & Pembayaran
          </button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4 text-xs">No. Invoice & Tanggal</th>
                <th className="px-6 py-4 text-xs">Pelanggan (Hewan)</th>
                <th className="px-6 py-4 text-xs">Detail Item</th>
                <th className="px-6 py-4 text-xs">Total Pembayaran</th>
                <th className="px-6 py-4 text-xs">Status</th>
                <th className="px-6 py-4 text-xs text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
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
                  const itemsStr = log.items?.map(i => `${i.quantity}x ${i.item_type === 'Service' ? 'Layanan' : 'Produk'}`).join(', ') || '-';
                  const totalAmount = log.total_amount || log.items?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;
                  
                  let statusLabel = 'Dibatalkan';
                  let statusBg = 'bg-red-100 text-red-700';
                  if (log.status === 'Paid') {
                    statusLabel = 'Berhasil';
                    statusBg = 'bg-emerald-100 text-emerald-700';
                  } else if (log.status === 'Unpaid') {
                    statusLabel = 'Belum Dibayar';
                    statusBg = 'bg-orange-100 text-orange-700';
                  }

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-blue-600">{log.id}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(log.created_at).toLocaleDateString('id-ID', {
                            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {ownerName} <span className="text-slate-500 font-normal">({petName} - {petSpecies})</span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 max-w-xs truncate" title={itemsStr}>
                        {itemsStr}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">{formatRupiah(totalAmount)}</p>
                        <p className="text-xs text-slate-400 mt-1">{log.payment_method || '-'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${statusBg}`}>
                          {statusLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                        <button className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors inline-flex items-center" title="Lihat Detail">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors inline-flex items-center" title="Cetak Struk">
                          <Printer className="h-4 w-4" />
                        </button>
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

        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs text-slate-500 font-medium">
          <p>Menampilkan 1 - 5 dari 142 transaksi</p>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50" disabled>
              <ChevronRight className="h-4 w-4 rotate-180" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 text-white font-bold">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white hover:text-blue-600">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white hover:text-blue-600">3</button>
            <span className="w-8 h-8 flex items-center justify-center text-slate-400">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white hover:text-blue-600">29</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white hover:bg-slate-50">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LogTransaction;