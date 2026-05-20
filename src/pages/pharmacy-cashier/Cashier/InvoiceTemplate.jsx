import React from 'react';
import { Printer, ChevronLeft, Box } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- MOCK DATA DARI TRANSAKSI SEBELUMNYA ---
const transactionData = {
  invoiceNumber: 'INV-260520-001',
  date: '20 Mei 2026',
  time: '14:30 WIB',
  cashier: 'Muhammad Danil',
  customer: 'Bpk. Ahmad Subarjo',
  petName: 'Mochi (Kucing)',
  paymentMethod: 'QRIS',
  items: [
    { id: 'M1', name: 'Jasa Konsultasi Dokter', price: 150000, qty: 1 },
    { id: 'M2', name: 'Vaksinasi Rabies', price: 200000, qty: 1 },
    { id: 'M3', name: 'Amoxicillin Syrup 60ml', price: 65000, qty: 1 },
    { id: 'P2', name: 'Whiskas Tuna 1.2kg', price: 65000, qty: 2 },
  ],
  discount: 10000,
  amountGiven: 550000, // Nominal yang dibayar (untuk tunai/QRIS)
};

const InvoiceTemplate = () => {
  // --- PERHITUNGAN TOTAL ---
  const subtotal = transactionData.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const grandTotal = subtotal - transactionData.discount;
  const change = Math.max(0, transactionData.amountGiven - grandTotal);

  // --- FORMATTER ---
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  // Fungsi untuk trigger print browser
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] py-8 print:bg-white print:py-0">
      
      {/* ================== TOMBOL AKSI (Disembunyikan saat di-print) ================== */}
      <div className="mx-auto mb-6 flex max-w-sm items-center justify-between px-4 print:hidden">
        <Link 
          to="/admin/pharmacy-cashier/cashier/CashierDashboard" 
          className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <ChevronLeft className="h-4 w-4" /> Kembali
        </Link>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
        >
          <Printer className="h-4 w-4" /> Cetak Struk
        </button>
      </div>

      {/* ================== AREA KERTAS STRUK THERMAL ================== */}
      {/* max-w-[80mm] atau max-w-sm (sekitar 320px) ideal untuk simulasi printer POS */}
      <div className="mx-auto w-full max-w-[320px] bg-white p-4 text-sm text-black shadow-lg print:m-0 print:w-[80mm] print:max-w-full print:shadow-none font-mono">
        
        {/* HEADER KLINIK */}
        <div className="mb-4 flex flex-col items-center border-b border-dashed border-black pb-4 text-center">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white">
            <Box className="h-6 w-6" />
          </div>
          <h1 className="text-base font-bold uppercase tracking-wider">Zeta Pet Clinic</h1>
          <p className="mt-1 text-[11px] leading-tight">Jl. Satwa Sehat No. 88, Jakarta<br/>Telp: 0812-3456-7890</p>
        </div>

        {/* INFO TRANSAKSI */}
        <div className="mb-4 border-b border-dashed border-black pb-4 text-[11px]">
          <div className="flex justify-between">
            <span>Tgl</span>
            <span>{transactionData.date} {transactionData.time}</span>
          </div>
          <div className="flex justify-between">
            <span>No.</span>
            <span>{transactionData.invoiceNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>Kasir</span>
            <span>{transactionData.cashier}</span>
          </div>
          <div className="mt-2 flex justify-between">
            <span>Pelanggan</span>
            <span className="text-right">{transactionData.customer}<br/>{transactionData.petName}</span>
          </div>
        </div>

        {/* DAFTAR ITEM */}
        <div className="mb-4 border-b border-dashed border-black pb-4">
          <table className="w-full text-[11px]">
            <tbody>
              {transactionData.items.map((item, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td colSpan="3" className="pb-1 font-medium">{item.name}</td>
                  </tr>
                  <tr>
                    <td className="w-8 pb-2 text-left">{item.qty}x</td>
                    <td className="pb-2 text-left">{formatRupiah(item.price)}</td>
                    <td className="pb-2 text-right">{formatRupiah(item.price * item.qty)}</td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* RINGKASAN TOTAL */}
        <div className="mb-4 border-b border-dashed border-black pb-4 text-[12px]">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatRupiah(subtotal)}</span>
          </div>
          {transactionData.discount > 0 && (
            <div className="flex justify-between">
              <span>Diskon</span>
              <span>-{formatRupiah(transactionData.discount)}</span>
            </div>
          )}
          <div className="mt-1 flex justify-between text-[14px] font-bold">
            <span>TOTAL</span>
            <span>{formatRupiah(grandTotal)}</span>
          </div>
          
          <div className="mt-3 flex justify-between">
            <span>Metode Bayar</span>
            <span className="font-semibold">{transactionData.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span>Bayar</span>
            <span>{formatRupiah(transactionData.amountGiven)}</span>
          </div>
          <div className="flex justify-between">
            <span>Kembali</span>
            <span>{formatRupiah(change)}</span>
          </div>
        </div>

        {/* FOOTER UCAPAN TERIMA KASIH */}
        <div className="text-center text-[11px] leading-relaxed">
          <p className="font-bold">TERIMA KASIH</p>
          <p>Semoga peliharaan Anda lekas sembuh dan sehat selalu.</p>
          <p className="mt-2 text-[10px]">Barang/Obat yang sudah dibeli<br/>tidak dapat ditukar/dikembalikan.</p>
        </div>

      </div>
    </div>
  );
};

export default InvoiceTemplate;