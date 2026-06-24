import React, { useState, useMemo, useEffect } from 'react';
import { getSuppliers } from '../../../services/supplierService';
import { getProducts, createStockMutation } from '../../../services/pharmacyService';
import { 
  PackagePlus, Save, X, Calendar, DollarSign, Hash, 
  AlertCircle, Truck, ChevronRight, CheckCircle2, 
  Loader2, AlertTriangle, Info
} from 'lucide-react';

const FormRestockBarang = () => {
  const [formData, setFormData] = useState({
    supplier: '',
    tanggalMasuk: new Date().toISOString().split('T')[0], // Default hari ini
    barangId: '',
    jumlah: '',
    hargaBeli: '',
    expiredDate: '',
    catatan: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });

  const [suppliersList, setSuppliersList] = useState([]);
  const [productsList, setProductsList] = useState([]);

  // Kalkulasi Modal
  const totalHarga = useMemo(() => {
    const qty = parseInt(formData.jumlah) || 0;
    const price = parseInt(formData.hargaBeli) || 0;
    return qty * price;
  }, [formData.jumlah, formData.hargaBeli]);

  // Validasi Form Wajib
  const isFormValid = formData.supplier && formData.barangId && Number(formData.jumlah) > 0 && Number(formData.hargaBeli) > 0 && formData.expiredDate;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const triggerToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: '', message: '' }), 3000);
  };

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [suppliersData, productsData] = await Promise.all([
          getSuppliers(),
          getProducts()
        ]);
        setSuppliersList(suppliersData || []);
        setProductsList(Array.isArray(productsData) ? productsData : (productsData?.data || []));
      } catch (err) {
        triggerToast('error', 'Gagal memuat data supplier/produk');
      }
    };
    fetchMasterData();
  }, []);

  const suppliers = useMemo(() => {
    return suppliersList.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.name || curr.nama_supplier || curr.nama }), {});
  }, [suppliersList]);

  const products = useMemo(() => {
    return productsList.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.name || curr.nama_obat || curr.nama }), {});
  }, [productsList]);

  const handleSimpanClick = () => {
    if (!isFormValid) return;
    setShowConfirm(true);
  };

  const processSubmit = async () => {
    setShowConfirm(false);
    setIsSubmitting(true);
    
    try {
      const payload = {
        supplier_id: formData.supplier,
        product_id: formData.barangId,
        quantity: parseInt(formData.jumlah),
        buy_price: parseInt(formData.hargaBeli),
        expired_date: formData.expiredDate,
        mutation_type: 'In',
        notes: formData.catatan,
        date: formData.tanggalMasuk
      };
      
      await createStockMutation(payload);
      
      triggerToast('success', 'Barang berhasil direstock');
      setFormData({
        supplier: '',
        tanggalMasuk: new Date().toISOString().split('T')[0],
        barangId: '',
        jumlah: '',
        hargaBeli: '',
        expiredDate: '',
        catatan: ''
      });
    } catch (error) {
      triggerToast('error', error.message || 'Gagal menyimpan. Silakan coba lagi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  return (
    <div className="space-y-6 relative">
      {/* --- Toast Notification --- */}
      {toast.show && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded shadow-lg text-white animate-fade-in-down ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <X className="h-5 w-5" />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* --- Konfirmasi Modal --- */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center gap-3 mb-4 text-orange-600">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="text-lg font-bold text-slate-800">Apakah yakin menyimpan?</h3>
            </div>
            <div className="space-y-2 mb-6 text-sm text-slate-600 bg-slate-50 p-4 rounded-md border border-slate-100">
              <p><span className="font-semibold w-20 inline-block">Supplier:</span> {suppliers[formData.supplier]}</p>
              <p><span className="font-semibold w-20 inline-block">Barang:</span> {products[formData.barangId]}</p>
              <p><span className="font-semibold w-20 inline-block">Jumlah:</span> {formData.jumlah}</p>
              <p><span className="font-semibold w-20 inline-block">Total:</span> <span className="font-bold text-green-700">{formatRupiah(totalHarga)}</span></p>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowConfirm(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded">Batal</button>
              <button onClick={processSubmit} className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700">Ya, Simpan Restock</button>
            </div>
          </div>
        </div>
      )}

      {/* 1. Header & Breadcrumb */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center text-xs text-slate-500 mb-2">
            <span>Dashboard</span>
            <ChevronRight className="h-3 w-3 mx-1" />
            <span>Inventory</span>
            <ChevronRight className="h-3 w-3 mx-1" />
            <span className="font-semibold text-slate-700">Restock Barang</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Barang Masuk (Restock)</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Catat penerimaan stok baru dari supplier dan perbarui nilai modal inventaris.</p>
        </div>
        <div className="text-right text-xs text-slate-400 bg-slate-50 px-3 py-2 rounded border border-slate-100">
          Terakhir Restock:<br/>
          <span className="font-semibold text-slate-600">Hari ini 13:20</span>
        </div>
      </div>

      {/* Main Layout: Form (Kiri) & Summary (Kanan) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Kolom Kiri: Form Input */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 bg-slate-50/50 rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 shadow-sm">
                <PackagePlus className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Formulir Penerimaan</h2>
            </div>
          </div>

          <div className="p-6">
            <form className="space-y-8">
              
              {/* --- Informasi Transaksi --- */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Info className="h-4 w-4 text-slate-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Informasi Transaksi</h3>
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Tanggal Penerimaan</label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Calendar className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="date" name="tanggalMasuk" value={formData.tanggalMasuk} onChange={handleChange}
                        className="block w-full rounded-lg border border-slate-300 pl-10 px-3 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-blue-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Nama Supplier <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Truck className="h-4 w-4 text-slate-400" />
                      </div>
                      <select
                        name="supplier" value={formData.supplier} onChange={handleChange}
                        className={`block w-full rounded-lg border pl-10 px-3 py-2.5 text-sm text-slate-700 focus:ring-1 transition-colors ${!formData.supplier ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500 hover:border-blue-400'}`}
                      >
                        <option value="">-- Pilih Supplier --</option>
                        {Object.entries(suppliers).map(([key, val]) => (
                          <option key={key} value={key}>{val}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <hr className="flex-grow border-slate-200" />
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Detail Barang</span>
                <hr className="flex-grow border-slate-200" />
              </div>

              {/* --- Detail Barang Masuk --- */}
              <div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="sm:col-span-2 lg:col-span-4">
                    <label className="mb-2 block text-sm font-medium text-slate-700">Pilih Barang / Obat <span className="text-red-500">*</span></label>
                    <select
                      name="barangId" value={formData.barangId} onChange={handleChange}
                      className={`block w-full rounded-lg border px-3 py-2.5 text-sm text-slate-700 focus:ring-1 transition-colors ${!formData.barangId ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500 hover:border-blue-400'}`}
                    >
                      <option value="">-- Cari atau pilih barang --</option>
                      {Object.entries(products).map(([key, val]) => (
                        <option key={key} value={key}>{val}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Jumlah <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Hash className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="number" name="jumlah" value={formData.jumlah} onChange={handleChange} placeholder="Masukkan jumlah box" min="1"
                        className={`block w-full rounded-lg border pl-10 px-3 py-2.5 text-sm text-slate-700 focus:ring-1 transition-colors ${Number(formData.jumlah) <= 0 ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500 hover:border-blue-400'}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Harga Beli <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-sm font-bold text-slate-400">Rp</span>
                      </div>
                      <input
                        type="number" name="hargaBeli" value={formData.hargaBeli} onChange={handleChange} placeholder="0" min="1"
                        className={`block w-full rounded-lg border pl-10 px-3 py-2.5 text-sm text-slate-700 focus:ring-1 transition-colors ${Number(formData.hargaBeli) <= 0 ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500 hover:border-blue-400'}`}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-2 flex items-center text-sm font-medium text-slate-700">
                      Expired Date <span className="ml-1 text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                      </div>
                      <input
                        type="date" name="expiredDate" value={formData.expiredDate} onChange={handleChange} required
                        className="block w-full rounded-lg border border-orange-300 bg-orange-50/30 pl-10 px-3 py-2.5 text-sm text-slate-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        title="Tanggal ini digunakan untuk sistem notifikasi."
                      />
                    </div>
                  </div>

                  {/* Total Modal Besar & Menonjol */}
                  <div className="sm:col-span-2 lg:col-span-4 mt-2">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col justify-center items-center shadow-inner">
                      <span className="text-xs font-bold text-emerald-600 tracking-widest uppercase mb-1">TOTAL MODAL</span>
                      <span className="text-2xl lg:text-3xl font-extrabold text-emerald-700">{formatRupiah(totalHarga)}</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* --- Catatan --- */}
              <div>
                <label className="mb-2 flex justify-between text-sm font-medium text-slate-700">
                  <span>Catatan Tambahan</span>
                  <span className="text-xs text-slate-400 font-normal">{200 - formData.catatan.length} karakter tersisa</span>
                </label>
                <textarea
                  name="catatan" value={formData.catatan} onChange={handleChange} rows={2} maxLength={200}
                  placeholder="Misal: Kondisi kardus sedikit penyok namun isi aman..."
                  className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-blue-400 transition-colors"
                />
              </div>

            </form>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 rounded-b-xl border-t border-slate-200 bg-slate-50 p-5">
            <button type="button" className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              <X className="h-4 w-4" /> Batal
            </button>
            <button 
              type="button" 
              onClick={handleSimpanClick}
              disabled={!isFormValid || isSubmitting}
              className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold text-white transition-all 
                ${!isFormValid || isSubmitting ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
            >
              {isSubmitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
              ) : (
                <><Save className="h-4 w-4" /> Simpan Restock</>
              )}
            </button>
          </div>
        </div>

        {/* Kolom Kanan: Summary Card */}
        <div className="lg:col-span-1 rounded-xl border border-slate-200 bg-white shadow-md sticky top-6">
          <div className="border-b border-slate-100 p-4 bg-slate-800 rounded-t-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-center">Ringkasan</h3>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-sm text-slate-500">Supplier</span>
              <span className="text-sm font-semibold text-slate-800 text-right">{suppliers[formData.supplier] || '-'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-sm text-slate-500">Barang</span>
              <span className="text-sm font-semibold text-slate-800 text-right">{products[formData.barangId] || '-'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-sm text-slate-500">Jumlah</span>
              <span className="text-sm font-semibold text-slate-800">{formData.jumlah ? `${formData.jumlah} Box` : '-'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-sm text-slate-500">Harga/Box</span>
              <span className="text-sm font-semibold text-slate-800">{formData.hargaBeli ? formatRupiah(formData.hargaBeli) : '-'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-sm text-slate-500">Total Modal</span>
              <span className="text-sm font-bold text-blue-600">{totalHarga ? formatRupiah(totalHarga) : '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Expired</span>
              <span className="text-sm font-semibold text-orange-600">{formData.expiredDate || '-'}</span>
            </div>
          </div>
          {!isFormValid && (
            <div className="bg-orange-50 p-4 rounded-b-xl border-t border-orange-100 text-xs text-orange-700 flex gap-2 items-start">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>Harap lengkapi semua field wajib (bertanda merah) untuk mengaktifkan tombol simpan.</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default FormRestockBarang;