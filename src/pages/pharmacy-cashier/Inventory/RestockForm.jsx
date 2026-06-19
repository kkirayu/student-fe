import React, { useState } from 'react';
import { PackagePlus, Save, X, Calendar, DollarSign, Hash, AlertCircle, Truck } from 'lucide-react';

const FormRestockBarang = () => {
  // State sederhana untuk simulasi kalkulasi form
  const [formData, setFormData] = useState({
    supplier: '',
    tanggalMasuk: '',
    barangId: '',
    jumlah: 0,
    hargaBeli: 0,
    expiredDate: '',
    catatan: ''
  });

  const totalHarga = formData.jumlah * formData.hargaBeli;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Halaman */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Barang Masuk (Restock)</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Catat penerimaan stok baru dan perbarui modal</p>
        </div>
      </div>

      {/* 2. Main Form Card */}
      <div className="rounded-sm border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <PackagePlus className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-black">Formulir Penerimaan Barang</h2>
          </div>
        </div>

        <div className="p-6">
          <form className="space-y-8">
            
            {/* --- Bagian Informasi Transaksi --- */}
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Informasi Transaksi</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                
                {/* Tanggal Masuk */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Tanggal Penerimaan</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Calendar className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="date"
                      name="tanggalMasuk"
                      value={formData.tanggalMasuk}
                      onChange={handleChange}
                      className="block w-full rounded-sm border border-slate-300 pl-10 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Supplier */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Nama Supplier</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Truck className="h-4 w-4 text-slate-400" />
                    </div>
                    <select
                      name="supplier"
                      value={formData.supplier}
                      onChange={handleChange}
                      className="block w-full rounded-sm border border-slate-300 pl-10 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">-- Pilih Supplier --</option>
                      <option value="sup1">PT Medika Sejahtera</option>
                      <option value="sup2">CV Vet Pharma</option>
                      <option value="sup3">Supplier Umum</option>
                    </select>
                  </div>
                </div>

              </div>
            </div>

            <hr className="border-slate-100" />

            {/* --- Bagian Detail Restock --- */}
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Detail Barang Masuk</h3>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                
                {/* Pilih Barang */}
                <div className="sm:col-span-2 lg:col-span-4">
                  <label className="mb-2 block text-sm font-medium text-slate-700">Pilih Barang / Obat</label>
                  <select
                    name="barangId"
                    value={formData.barangId}
                    onChange={handleChange}
                    className="block w-full rounded-sm border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">-- Cari atau pilih barang --</option>
                    <option value="b1">Vaksin Felocell 4</option>
                    <option value="b2">Paracetamol Sirup (Hewan)</option>
                    <option value="b3">Perban Gulung 5cm</option>
                  </select>
                </div>

                {/* Jumlah Barang */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Jumlah Masuk</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Hash className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="number"
                      name="jumlah"
                      value={formData.jumlah || ''}
                      onChange={handleChange}
                      placeholder="0"
                      min="1"
                      className="block w-full rounded-sm border border-slate-300 pl-10 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Harga Beli */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Harga Beli Satuan</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-sm font-bold text-slate-400">Rp</span>
                    </div>
                    <input
                      type="number"
                      name="hargaBeli"
                      value={formData.hargaBeli || ''}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      className="block w-full rounded-sm border border-slate-300 pl-10 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Kalkulasi Total Harga (Disabled) */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Total Harga (Modal)</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <DollarSign className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      readOnly
                      value={`Rp ${totalHarga.toLocaleString('id-ID')}`}
                      className="block w-full rounded-sm border border-slate-200 bg-slate-50 pl-10 px-3 py-2 text-sm font-semibold text-slate-600 outline-none"
                    />
                  </div>
                </div>

                {/* Tanggal Kedaluwarsa (Paling Penting) */}
                <div>
                  <label className="mb-2 flex items-center text-sm font-medium text-slate-700">
                    Expired Date <span className="ml-1 text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                    </div>
                    <input
                      type="date"
                      name="expiredDate"
                      value={formData.expiredDate}
                      onChange={handleChange}
                      required
                      className="block w-full rounded-sm border border-orange-300 bg-orange-50/30 pl-10 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-orange-600">Wajib diisi untuk sistem notifikasi kedaluwarsa.</p>
                </div>

              </div>
            </div>

            <hr className="border-slate-100" />

            {/* --- Catatan Opsional --- */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Catatan Tambahan (Opsional)</label>
              <textarea
                name="catatan"
                value={formData.catatan}
                onChange={handleChange}
                rows={3}
                placeholder="Misal: Kondisi kardus sedikit penyok namun isi aman..."
                className="block w-full rounded-sm border border-slate-300 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

          </form>
        </div>

        {/* 3. Form Actions (Footer) */}
        <div className="flex items-center justify-end gap-3 rounded-b-sm border-t border-slate-200 bg-slate-50 p-6">
          <button 
            type="button" 
            className="flex items-center gap-2 rounded-sm border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-1"
          >
            <X className="h-4 w-4" />
            Batal
          </button>
          <button 
            type="button" 
            className="flex items-center gap-2 rounded-sm bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            <Save className="h-4 w-4" />
            Simpan & Update Modal
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default FormRestockBarang;