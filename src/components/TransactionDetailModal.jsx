import React from 'react';
import { X, Printer } from 'lucide-react';

const TransactionDetailModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const { id, type, raw_data, name, items, status, total_amount, payment_method } = data;

  // We unify the display based on type (invoice vs appointment vs logTransaction structure)
  const isDirectInvoice = data.hasOwnProperty('total_amount') && !data.hasOwnProperty('raw_data'); 
  const rawData = isDirectInvoice ? data : raw_data;
  const dataType = isDirectInvoice ? 'invoice' : type;

  const displayId = isDirectInvoice ? `#INV-${String(data.id).padStart(4, '0')}` : id;
  const displayStatus = status || (rawData?.status === 'Paid' ? 'Selesai' : rawData?.status === 'Unpaid' ? 'Menunggu' : 'Diproses');
  
  let ownerName = 'Umum';
  let petName = '-';
  if (dataType === 'invoice') {
    ownerName = rawData?.owner?.name || 'Umum';
    if (rawData?.appointment?.pet) {
      petName = `${rawData.appointment.pet.name} (${rawData.appointment.pet.species})`;
    }
  } else if (dataType === 'appointment') {
    ownerName = rawData?.pet?.owner?.name || 'Umum';
    if (rawData?.pet) {
      petName = `${rawData.pet.name} (${rawData.pet.species})`;
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount || 0);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Detail Transaksi</h3>
            <p className="text-sm text-blue-600 font-medium">{displayId}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto print-area">
          <div className="flex justify-between items-center mb-6">
            <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${displayStatus === 'Selesai' ? 'bg-emerald-100 text-emerald-700' : displayStatus === 'Menunggu' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
              {displayStatus}
            </span>
            <span className="text-xs text-slate-500">
              {new Date(rawData?.created_at).toLocaleString('id-ID')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-slate-400 text-xs mb-1">Pelanggan</p>
              <p className="font-semibold text-slate-800">{ownerName}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-slate-400 text-xs mb-1">Pasien (Hewan)</p>
              <p className="font-semibold text-slate-800">{petName}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-6">
            <h4 className="text-sm font-bold text-slate-700 mb-3">Rincian Item / Layanan</h4>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500">
                  <tr>
                    <th className="px-4 py-2 font-medium">Deskripsi</th>
                    <th className="px-4 py-2 font-medium text-center">Qty</th>
                    <th className="px-4 py-2 font-medium text-right">Harga</th>
                    <th className="px-4 py-2 font-medium text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {dataType === 'invoice' && rawData?.items ? (
                    rawData.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-3">{item.item_type ? item.item_type.split('\\').pop() : 'Item'}</td>
                        <td className="px-4 py-3 text-center">{item.quantity}</td>
                        <td className="px-4 py-3 text-right">{formatCurrency(item.unit_price)}</td>
                        <td className="px-4 py-3 text-right font-medium">{formatCurrency(item.subtotal)}</td>
                      </tr>
                    ))
                  ) : dataType === 'appointment' ? (
                    <tr>
                      <td className="px-4 py-3">{rawData?.service?.name || 'Konsultasi'}</td>
                      <td className="px-4 py-3 text-center">1</td>
                      <td className="px-4 py-3 text-right">-</td>
                      <td className="px-4 py-3 text-right font-medium">-</td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-3 text-center text-slate-400 italic">Data item tidak tersedia</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Summary */}
          {dataType === 'invoice' && (
            <div className="space-y-2 text-sm text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-slate-800">{formatCurrency(rawData.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Pajak (Tax)</span>
                <span className="font-medium text-slate-800">{formatCurrency(rawData.tax_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Diskon</span>
                <span className="font-medium text-emerald-600">-{formatCurrency(rawData.discount_amount)}</span>
              </div>
              <div className="pt-2 mt-2 border-t border-slate-200 flex justify-between font-bold text-lg text-slate-800">
                <span>Total Pembayaran</span>
                <span className="text-blue-600">{formatCurrency(rawData.total_amount)}</span>
              </div>
              <div className="flex justify-between pt-2 text-xs text-slate-400">
                <span>Metode Pembayaran</span>
                <span className="uppercase font-semibold text-slate-600">{rawData.payment_method || '-'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-white flex gap-3 justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors border border-transparent"
          >
            Tutup
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Printer size={16} />
            Cetak Struk
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailModal;
