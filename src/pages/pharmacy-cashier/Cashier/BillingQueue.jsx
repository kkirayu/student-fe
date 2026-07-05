import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, FileText, Printer, CheckCircle2, Clock, AlertCircle, ChevronRight, Eye, Loader2 } from 'lucide-react';
import { getInvoices } from '../../../services/paymentService';

const BillingQueue = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const res = await getInvoices();
      const list = res?.data?.data || res?.data || [];
      // Tampilkan hanya yang belum dibayar di antrean awal jika tidak difilter
      setInvoices(list);
    } catch (err) {
      console.error('Fetch invoices error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 1. Ringkasan Antrean Tagihan saat ini
  const queueStats = [
    {
      title: 'Menunggu Pembayaran',
      value: '5 Pasien',
      desc: 'Perlu konfirmasi kasir',
      icon: <Clock className="text-orange-600 h-5 w-5" />,
      bgIcon: 'bg-orange-100',
    },
    {
      title: 'Resep Sedang Disiapkan',
      value: '3 Resep',
      desc: 'Oleh bagian farmasi',
      icon: <AlertCircle className="text-blue-600 h-5 w-5" />,
      bgIcon: 'bg-blue-100',
    },
    {
      title: 'Selesai Shift Ini',
      value: '28 Transaksi',
      desc: 'Tagihan terbayar',
      icon: <CheckCircle2 className="text-emerald-600 h-5 w-5" />,
      bgIcon: 'bg-emerald-100',
    },
  ];

  // Mapping status dari API ke label lokal
  const getStatusLabel = (status) => {
    switch (status) {
      case 'Unpaid': return 'Menunggu Pembayaran';
      case 'Paid': return 'Selesai';
      case 'Cancelled': return 'Dibatalkan';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Unpaid': return 'bg-orange-100 text-orange-700';
      case 'Paid': return 'bg-emerald-100 text-emerald-700';
      case 'Cancelled': return 'bg-slate-100 text-slate-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const getClientName = (inv) => inv?.owner?.name ?? inv?.client_name ?? '—';
  const getPetName = (inv) => inv?.appointment?.pet?.name ?? '—';
  const getPetType = (inv) => inv?.appointment?.pet?.species ?? '—';
  const getDoctorName = (inv) => inv?.appointment?.doctor?.name ?? '—';

  return (
    <div className="space-y-6 font-sans">

      {/* HEADER PAGE */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Antrean Tagihan & Resep</h1>
          <p className="text-sm text-slate-400">Daftar pemeriksaan medis selesai yang siap diproses pembayarannya.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-2 rounded-lg border border-blue-100">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          <span>Sinkronisasi Kamar Dokter Aktif</span>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {queueStats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
            <div className={`w-12 h-12 rounded-xl ${stat.bgIcon} flex items-center justify-center flex-shrink-0`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-xl font-bold text-slate-800 mt-0.5">{stat.value}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-3 shadow-sm justify-between items-center">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
          <input
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm"
            placeholder="Cari nama hewan, pemilik, atau no antrean..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              className="bg-transparent border-none p-0 focus:ring-0 text-slate-600 font-medium text-sm outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="Semua">Semua Status</option>
              <option value="Unpaid">Menunggu Pembayaran</option>
              <option value="Paid">Selesai</option>
              <option value="Cancelled">Dibatalkan</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-500 tracking-wider">
                <th className="px-6 py-4 text-xs uppercase">No. Antrean</th>
                <th className="px-6 py-4 text-xs uppercase">Pasien & Pemilik</th>
                <th className="px-6 py-4 text-xs uppercase">Dokter Pemeriksa</th>
                <th className="px-6 py-4 text-xs uppercase">Rincian Layanan (Otomatis Dokter)</th>
                <th className="px-6 py-4 text-xs uppercase">Total Estimasi</th>
                <th className="px-6 py-4 text-xs uppercase">Status</th>
                <th className="px-6 py-4 text-xs uppercase text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-500" />
                    <p className="mt-2 text-sm text-slate-500">Memuat data antrean...</p>
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-sm text-slate-400">
                    Tidak ada antrean ditemukan.
                  </td>
                </tr>
              ) : (
                invoices
                  .filter(item => statusFilter === 'Semua' || item.status === statusFilter)
                  .filter(item => {
                    const search = searchTerm.toLowerCase();
                    return getPetName(item).toLowerCase().includes(search) || 
                           getClientName(item).toLowerCase().includes(search) || 
                           item.id.toString().toLowerCase().includes(search);
                  })
                  .map((queue, i) => {
                    const services = queue.items?.filter(it => it.item_type === 'Service' || it.item_type === 'App\\Models\\Service') || [];
                    const products = queue.items?.filter(it => it.item_type === 'Product' || it.item_type === 'App\\Models\\Product') || [];
                    return (
                      <tr key={queue.id || i} className="hover:bg-slate-50/50 transition-colors align-top">
                        {/* No Antrean & Waktu */}
                        <td className="px-6 py-4">
                          <span className="font-bold text-blue-600 block">{queue.id}</span>
                          <span className="text-xs text-slate-400 font-medium block mt-0.5">
                            Tanggal: {new Date(queue.created_at).toLocaleDateString('id-ID')}
                          </span>
                        </td>

                        {/* Pasien & Pemilik */}
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-800">{getPetName(queue)} <span className="text-xs font-normal text-slate-500">({getPetType(queue)})</span></div>
                          <div className="text-xs text-slate-400 mt-0.5">Pmlk: {getClientName(queue)}</div>
                        </td>

                        {/* Dokter */}
                        <td className="px-6 py-4">
                          <span className="text-slate-600 font-medium">{getDoctorName(queue)}</span>
                        </td>

                        {/* Rincian Otomatis Komparasi */}
                        <td className="px-6 py-4 max-w-xs">
                          <div className="space-y-1.5">
                            {/* Bagian Tindakan */}
                            {services.length > 0 && (
                              <div>
                                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Tindakan/Layanan</span>
                                {services.map((t, idx) => (
                                  <div key={idx} className="text-xs text-slate-600 flex justify-between mt-0.5">
                                    <span>• {t.item_name ?? `${t.item_type} #${t.item_id}`}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            {/* Bagian Obat */}
                            {products.length > 0 && (
                              <div className="mt-1">
                                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block">Tebus Obat / Resep</span>
                                {products.map((p, idx) => (
                                  <div key={idx} className="text-xs text-slate-600 flex justify-between mt-0.5">
                                    <span>• {p.item_name ?? `${p.item_type} #${p.item_id}`}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Total Tagihan */}
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-800">Rp {(queue.total_amount ?? 0).toLocaleString('id-ID')}</span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusColor(queue.status)}`}>
                            {getStatusLabel(queue.status)}
                          </span>
                        </td>

                        {/* Tombol Aksi */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            {queue.status === 'Paid' ? (
                              <>
                                <button title="Lihat Riwayat Kwitansi" className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"><Eye className="h-4 w-4" /></button>
                                <button title="Cetak Ulang Nota" className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"><Printer className="h-4 w-4" /></button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => navigate(`/cashier/checkout?invoice_id=${queue.id}`)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                                >
                                  <FileText className="h-3.5 w-3.5" />
                                  <span>Bayar</span>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER PAGINATION */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs text-slate-400 font-medium">
          <p>Menampilkan {invoices.length} data antrean medis</p>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white hover:bg-slate-50">⟨</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 text-white font-bold">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white hover:text-blue-600">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white hover:bg-slate-50">⟩</button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default BillingQueue;