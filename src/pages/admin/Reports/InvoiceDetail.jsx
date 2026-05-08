import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Printer, ArrowLeft } from 'lucide-react';

const InvoiceDetail = () => {
  const { id } = useParams();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/admin/reports/transactions" className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Log Transaksi
        </Link>
        <button className="flex items-center gap-2 rounded bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">
          <Printer className="h-4 w-4" /> Cetak Struk
        </button>
      </div>

      <div className="rounded-md border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex justify-between border-b border-slate-200 pb-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-600">Zeta Connect</h2>
            <p className="mt-1 text-sm text-slate-500">Jl. Adi Sucipto, Yogyakarta</p>
          </div>
          <div className="text-right">
            <h3 className="text-lg font-bold text-black">INVOICE</h3>
            <p className="text-sm font-medium text-slate-500">#{id || 'INV-001'}</p>
            <span className="mt-2 inline-block rounded bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">LUNAS</span>
          </div>
        </div>

        <div className="py-6 flex justify-between text-sm">
          <div>
            <p className="text-slate-500 mb-1">Ditagihkan Kepada:</p>
            <p className="font-bold text-black">Caca</p>
            <p className="text-slate-600">Pasien: Mochi (Kucing)</p>
          </div>
          <div className="text-right">
            <p className="text-slate-500 mb-1">Tanggal Transaksi:</p>
            <p className="font-bold text-black">08 Mei 2026</p>
          </div>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="py-3 font-semibold">Deskripsi Layanan / Obat</th>
              <th className="py-3 text-center font-semibold">Qty</th>
              <th className="py-3 text-right font-semibold">Harga</th>
              <th className="py-3 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="py-3 text-black">Jasa Vaksinasi Kucing</td>
              <td className="py-3 text-center">1</td>
              <td className="py-3 text-right">Rp 150.000</td>
              <td className="py-3 text-right font-medium">Rp 150.000</td>
            </tr>
            <tr>
              <td className="py-3 text-black">Vitamin Bulu Olive Care</td>
              <td className="py-3 text-center">1</td>
              <td className="py-3 text-right">Rp 100.000</td>
              <td className="py-3 text-right font-medium">Rp 100.000</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className="pt-6 text-right font-bold text-black">Total Keseluruhan</td>
              <td className="pt-6 text-right font-bold text-blue-600 text-lg">Rp 250.000</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default InvoiceDetail;