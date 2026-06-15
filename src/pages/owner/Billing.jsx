import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import api from '../../services/api';

const OWNER_ID = 1;

// Helper format Rupiah
const formatRupiah = (number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number ?? 0);

// Helper badge status
const getStatusBadge = (status) => {
  switch (status) {
    case 'Paid': return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
    case 'Unpaid': return 'bg-rose-100 text-rose-800 border border-rose-200';
    case 'Cancelled': return 'bg-slate-100 text-slate-500 border border-slate-200';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const Billing = () => {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // ── Fetch invoices dari API ──────────────────────────────────
  // Hanya tampilkan invoice yang appointment-nya berstatus 'Selesai'
  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get('/invoices', { params: { owner_id: OWNER_ID } });
      // Response: { success, data: { data: [...], ... } }
      // InvoiceController include relasi 'appointment', filter status Selesai di sini
      const list = res.data?.data?.data ?? res.data?.data ?? [];
      const filtered = list.filter(inv => inv.appointment?.status === 'Selesai');
      setInvoices(filtered);
    } catch (err) {
      console.error('Fetch invoices error:', err);
      setError('Gagal memuat data tagihan. Pastikan server berjalan.');
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchInvoices();
  }, []);

  // ── Buka modal detail ────────────────────────────────────────
  const handleOpenDetail = (invoice) => {
    setSelectedInvoice(invoice);
    setSelectedPaymentMethod(invoice.payment_method || '');
    setIsModalOpen(true);
  };

  // ── Proses pembayaran (update status lokal + call API jika ada) ──
  const handleProcessPayment = async () => {
    if (!selectedPaymentMethod) {
      alert('Silakan pilih metode pembayaran!');
      return;
    }

    setIsProcessing(true);
    try {
      // Update status invoice via API
      await api.put(`/invoices/${selectedInvoice.id}`, {
        payment_method: selectedPaymentMethod,
        status: 'Paid',
      });

      // Update data lokal
      setInvoices(prev =>
        prev.map(inv =>
          inv.id === selectedInvoice.id
            ? { ...inv, status: 'Paid', payment_method: selectedPaymentMethod }
            : inv
        )
      );

      setIsModalOpen(false);
      alert(`Sukses! Pembayaran ${selectedInvoice.id} telah dikonfirmasi.`);
    } catch (err) {
      console.error('Payment error:', err);
      alert('Gagal memproses pembayaran. Silakan coba lagi.');
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Helper: nama klien ───────────────────────────────────────
  const getClientName = (invoice) =>
    invoice?.owner?.name ?? invoice?.client_name ?? '—';

  // ── Helper: items invoice ────────────────────────────────────
  const getItems = (invoice) => invoice?.items ?? [];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Tagihan & Pembayaran</h2>
          <p className="text-sm text-slate-500">Riwayat invoice dan status pembayaran Anda.</p>
        </div>
        <button
          onClick={fetchInvoices}
          className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50 transition"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabel */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr className="text-xs uppercase font-bold text-slate-600 tracking-tight">
                <th className="p-4">No. Invoice</th>
                <th className="p-4">Tanggal</th>
                <th className="p-4">Pelanggan</th>
                <th className="p-4 text-right">Total</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-500" />
                    <p className="mt-2 text-sm text-slate-500">Memuat data tagihan...</p>
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-sm text-slate-400">
                    Tidak ada tagihan ditemukan.
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-semibold text-blue-600 tracking-tight">{invoice.id}</td>
                    <td className="p-4 text-slate-500">
                      {invoice.created_at
                        ? new Date(invoice.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })
                        : '—'}
                    </td>
                    <td className="p-4 font-medium text-slate-900">{getClientName(invoice)}</td>
                    <td className="p-4 text-right font-bold text-slate-900">
                      {formatRupiah(invoice.total_amount)}
                    </td>
                    <td className="p-4 text-center whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleOpenDetail(invoice)}
                        className="px-3 py-1.5 text-xs font-bold rounded bg-slate-800 text-white hover:bg-blue-600 transition shadow-sm"
                      >
                        {invoice.status === 'Unpaid' ? 'BAYAR' : 'DETAIL'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DETAIL & PEMBAYARAN */}
      {isModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">

            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b flex items-center justify-between">
              <h3 className="font-bold text-slate-800 uppercase text-sm tracking-widest">
                Detail Tagihan
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-red-500 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Info dasar */}
              <div className="space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Invoice ID</span>
                  <span className="font-bold text-slate-900">{selectedInvoice.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Pelanggan</span>
                  <span className="font-bold text-slate-900">{getClientName(selectedInvoice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Tanggal</span>
                  <span className="font-medium text-slate-700">
                    {selectedInvoice.created_at
                      ? new Date(selectedInvoice.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })
                      : '—'}
                  </span>
                </div>
              </div>

              {/* Item layanan */}
              {getItems(selectedInvoice).length > 0 && (
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    Rincian Layanan
                  </p>
                  <div className="rounded-lg border border-slate-100 divide-y divide-slate-100 overflow-hidden">
                    {getItems(selectedInvoice).map((item, i) => (
                      <div key={i} className="flex justify-between items-center px-3 py-2.5 text-sm bg-white">
                        <div>
                          <p className="font-semibold text-slate-800">
                            {item.item_name ?? `${item.item_type} #${item.item_id}`}
                          </p>
                          <p className="text-xs text-slate-400">
                            {item.quantity}x · {formatRupiah(item.price)} / unit
                          </p>
                        </div>
                        <span className="font-bold text-slate-900">
                          {formatRupiah(item.subtotal ?? item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="space-y-1.5">
                {selectedInvoice.discount > 0 && (
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Subtotal</span>
                    <span>{formatRupiah(selectedInvoice.subtotal)}</span>
                  </div>
                )}
                {selectedInvoice.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Diskon</span>
                    <span>- {formatRupiah(selectedInvoice.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-bold text-blue-800">Total Tagihan</span>
                  <span className="text-lg font-black text-blue-800">
                    {formatRupiah(selectedInvoice.total_amount)}
                  </span>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Bayar / Info pembayaran */}
              {selectedInvoice.status === 'Unpaid' ? (
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    Pilih Metode Pembayaran
                  </label>
                  <select
                    value={selectedPaymentMethod}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Klik untuk memilih --</option>
                    <option value="Tunai">Tunai</option>
                    <option value="QRIS">QRIS</option>
                    <option value="Transfer">Transfer</option>
                    <option value="Debit">Debit</option>
                  </select>
                  <button
                    onClick={handleProcessPayment}
                    disabled={isProcessing}
                    className="w-full mt-2 bg-blue-600 text-white py-3 rounded-md font-bold text-xs uppercase tracking-widest hover:bg-blue-700 shadow-md active:scale-95 transition disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isProcessing ? 'Memproses...' : 'Konfirmasi & Bayar'}
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-md border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Metode Pembayaran
                  </span>
                  <p className="text-sm font-bold text-slate-700">
                    {selectedInvoice.payment_method || 'N/A'}
                  </p>
                  <div className={`mt-2 inline-block px-2 py-1 rounded text-[10px] font-black uppercase ${getStatusBadge(selectedInvoice.status)}`}>
                    {selectedInvoice.status}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;