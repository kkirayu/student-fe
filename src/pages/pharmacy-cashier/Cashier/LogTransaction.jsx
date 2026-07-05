import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Calendar, Download, Printer, Eye, ChevronRight, ChevronLeft, RefreshCw } from 'lucide-react';
import { getInvoices } from '../../../services/paymentService';
import TransactionDetailModal from '../../../components/TransactionDetailModal';

const LogTransaction = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data States
  const [transactionLogs, setTransactionLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [dateFilter, setDateFilter] = useState(''); // '' = all time, 'today' = hari ini

  // Modal State
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page };
      if (dateFilter === 'today') {
        const d = new Date();
        const tzOffset = d.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(Date.now() - tzOffset)).toISOString().slice(0, 10);
        params.date = localISOTime;
      }
      
      const response = await getInvoices(params);
      if (response && response.data) {
        setTransactionLogs(response.data.data || []);
        setTotalPages(response.data.last_page || 1);
        setTotalRecords(response.data.total || 0);
      }
    } catch (err) {
      setError('Gagal memuat log transaksi.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, dateFilter]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const toggleDateFilter = () => {
    setPage(1); // Reset page on filter change
    setDateFilter(prev => prev === 'today' ? '' : 'today');
  };

  const handleOpenDetail = (log) => {
    setSelectedTransaction(log);
    setIsModalOpen(true);
  };

  const handlePrint = (e) => {
    e.stopPropagation();
    window.print();
  };

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
            placeholder="Cari no. invoice... (Fitur pencarian dalam pengembangan)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <button 
            onClick={toggleDateFilter}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${dateFilter === 'today' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
          >
            <Calendar className={`h-4 w-4 ${dateFilter === 'today' ? 'text-blue-500' : 'text-slate-400'}`} />
            {dateFilter === 'today' ? 'Hari Ini' : 'Semua Waktu'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 bg-white rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors text-slate-700">
            <Filter className="h-4 w-4 text-slate-400" />
            Status & Pembayaran
          </button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500 gap-3">
              <RefreshCw className="animate-spin text-blue-600" size={28} />
              <p>Memuat Data Transaksi...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 text-red-500 gap-2">
              <p>{error}</p>
              <button onClick={fetchLogs} className="px-4 py-2 bg-red-50 hover:bg-red-100 rounded-md text-red-700 text-sm font-medium transition-colors">Coba Lagi</button>
            </div>
          ) : (
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
                {transactionLogs.length > 0 ? transactionLogs.map((log) => {
                  let statusBg = 'bg-slate-100 text-slate-700';
                  let statusText = log.status;
                  
                  if (log.status === 'Paid') {
                    statusBg = 'bg-emerald-100 text-emerald-700';
                    statusText = 'Berhasil';
                  } else if (log.status === 'Unpaid') {
                    statusBg = 'bg-orange-100 text-orange-700';
                    statusText = 'Menunggu';
                  } else if (log.status === 'Cancelled') {
                    statusBg = 'bg-red-100 text-red-700';
                    statusText = 'Dibatalkan';
                  }

                  let ownerName = log.owner ? log.owner.name : 'Umum';
                  let petName = '';
                  if (log.appointment && log.appointment.pet) {
                    petName = ` (${log.appointment.pet.name} - ${log.appointment.pet.species})`;
                  }
                  
                  const itemsSummary = log.items ? log.items.map(i => `${i.quantity}x Item`).join(', ') : '-';
                  const displayId = `#INV-${String(log.id).padStart(4, '0')}`;

                  return (
                    <tr 
                      key={log.id} 
                      onClick={() => handleOpenDetail(log)}
                      className="hover:bg-blue-50/50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-blue-600">{displayId}</p>
                        <p className="text-xs text-slate-400 mt-1">{formatDate(log.created_at)}</p>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">{ownerName}{petName}</td>
                      <td className="px-6 py-4 text-slate-500 max-w-xs truncate" title={itemsSummary}>
                        {itemsSummary}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">{formatCurrency(log.total_amount)}</p>
                        <p className="text-xs text-slate-400 mt-1">{log.payment_method || '-'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${statusBg}`}>
                          {statusText}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleOpenDetail(log); }}
                          className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors inline-flex items-center" 
                          title="Lihat Detail"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={handlePrint}
                          className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors inline-flex items-center" 
                          title="Cetak Struk"
                        >
                          <Printer className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500 font-medium">
                      Tidak ada riwayat transaksi ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && totalRecords > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs text-slate-500 font-medium">
            <p>Menampilkan halaman {page} dari {totalPages} ({totalRecords} transaksi)</p>
            <div className="flex gap-1">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 text-white font-bold">{page}</button>
              
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </section>

      <TransactionDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        data={selectedTransaction} 
      />

        </div>
    );
};

export default LogTransaction;