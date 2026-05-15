import React, { useState } from 'react';

// Mock Data Transaksi
const invoiceDataRaw = [
  {
    id: "INV-2026-001",
    created_at: "2026-05-16 10:00",
    client_name: "Rizky Amelia", 
    total_amount: 350000,
    payment_method: "QRIS", 
    status: "Paid" 
  },
  {
    id: "INV-2026-002",
    created_at: "2026-05-15 14:30",
    client_name: "Budi Santoso",
    total_amount: 120000,
    payment_method: "Tunai",
    status: "Paid"
  },
  {
    id: "INV-2026-003",
    created_at: "2026-05-14 09:15",
    client_name: "Citra Lestari",
    total_amount: 750000,
    payment_method: null, 
    status: "Unpaid"
  },
  {
    id: "INV-2026-004",
    created_at: "2026-05-12 16:00",
    client_name: "Ahmad Dhani",
    total_amount: 500000,
    payment_method: "Transfer",
    status: "Cancelled"
  }
];

const Billing = () => {
  // State Management
  const [invoices, setInvoices] = useState(invoiceDataRaw);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  // Helper fungsi untuk format Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  // Helper fungsi untuk Badge Status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid': return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'Unpaid': return 'bg-rose-100 text-rose-800 border border-rose-200';
      case 'Cancelled': return 'bg-slate-100 text-slate-500 border border-slate-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Fungsi Buka Modal Detail
  const handleOpenDetail = (invoice) => {
    setSelectedInvoice(invoice);
    setSelectedPaymentMethod(invoice.payment_method || '');
    setIsModalOpen(true);
  };

  // Fungsi Simpan Pembayaran (Hanya untuk Unpaid)
  const handleProcessPayment = () => {
    if (!selectedPaymentMethod) return alert('Silakan pilih metode pembayaran!');
    
    setInvoices(prev => prev.map(inv => 
      inv.id === selectedInvoice.id 
        ? { ...inv, status: 'Paid', payment_method: selectedPaymentMethod }
        : inv
    ));
    
    setIsModalOpen(false);
    alert(`Sukses! Pembayaran ${selectedInvoice.id} telah diverifikasi.`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Riwayat Transaksi</h2>
          <p className="text-sm text-slate-500">Kelola invoice dan metode pembayaran pelanggan.</p>
        </div>
        <div className="bg-slate-100 px-4 py-2 rounded-lg">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Total Data: {invoices.length}</span>
        </div>
      </div>

      {/* Tabel Utama */}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-600 tracking-tight">
              <th className="p-4">No. Invoice</th>
              <th className="p-4">Tanggal</th>
              <th className="p-4">Pelanggan</th>
              <th className="p-4 text-right">Total</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-semibold text-blue-600 tracking-tight">{invoice.id}</td>
                <td className="p-4 text-slate-500">{invoice.created_at}</td>
                <td className="p-4 font-medium text-slate-900">{invoice.client_name}</td>
                <td className="p-4 text-right font-bold text-slate-900">{formatRupiah(invoice.total_amount)}</td>
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
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DETAIL & PEMBAYARAN */}
      {isModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="px-6 py-4 bg-slate-50 border-b flex items-center justify-between">
              <h3 className="font-bold text-slate-800 uppercase text-sm tracking-widest">Detail Tagihan</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500">✕</button>
            </div>

            <div className="p-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Invoice ID</span>
                <span className="font-bold text-slate-900">{selectedInvoice.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Pelanggan</span>
                <span className="font-bold text-slate-900">{selectedInvoice.client_name}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-bold text-blue-800">Total Tagihan</span>
                <span className="text-lg font-black text-blue-800">{formatRupiah(selectedInvoice.total_amount)}</span>
              </div>

              <hr className="my-4 border-slate-100" />

              {/* Form Bayar jika Unpaid */}
              {selectedInvoice.status === 'Unpaid' ? (
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Pilih Metode Pembayaran</label>
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
                    className="w-full mt-4 bg-blue-600 text-white py-3 rounded-md font-bold text-xs uppercase tracking-widest hover:bg-blue-700 shadow-md active:scale-95 transition"
                  >
                    Konfirmasi & Bayar
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-md border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Metode Pembayaran</span>
                  <p className="text-sm font-bold text-slate-700">{selectedInvoice.payment_method || 'N/A'}</p>
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