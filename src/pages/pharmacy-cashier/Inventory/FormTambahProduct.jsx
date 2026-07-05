import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../../../services/pharmacyService';
import { 
  PackagePlus, Save, X, Tag, FileText, LayoutList, 
  DollarSign, Hash, CheckCircle2, Loader2, Image as ImageIcon 
} from 'lucide-react';

const FormTambahProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Obat', // Default
    base_price: '',
    selling_price: '',
    current_stock: '0',
    min_stock: '5',
    image: null
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });

  // Validasi sederhana
  const isFormValid = formData.name && formData.category && formData.base_price && formData.selling_price;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const triggerToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: '', message: '' }), 3000);
  };

  const processSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setIsSubmitting(true);
    
    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('description', formData.description || '');
      payload.append('category', formData.category);
      payload.append('base_price', formData.base_price);
      payload.append('selling_price', formData.selling_price);
      payload.append('current_stock', formData.current_stock || 0);
      payload.append('min_stock', formData.min_stock || 0);
      
      if (formData.image) {
        payload.append('image', formData.image);
      }
      
      await createProduct(payload);
      triggerToast('success', 'Produk berhasil ditambahkan');
      setTimeout(() => navigate('/pharmacy/inventory'), 1500);
    } catch (error) {
      triggerToast('error', error.message || 'Gagal menyimpan produk.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 relative max-w-4xl mx-auto">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded shadow-lg text-white animate-fade-in-down ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <X className="h-5 w-5" />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tambah Produk Baru</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Registrasi data master untuk produk baru ke dalam katalog inventaris.</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 p-5 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 shadow-sm">
              <PackagePlus className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Formulir Data Produk</h2>
          </div>
        </div>

        <form onSubmit={processSubmit} className="p-6 space-y-8">
          
          {/* Foto Upload */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Foto / Gambar Produk (Maks 1MB)</label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="h-32 w-32 shrink-0 bg-slate-100 border border-slate-300 border-dashed rounded-lg flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon className="h-10 w-10 text-slate-300" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input 
                  type="file" 
                  accept="image/*"
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer transition-colors"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      if (file.size > 1024 * 1024) {
                        alert('Ukuran gambar tidak boleh melebihi 1MB');
                        e.target.value = '';
                        return;
                      }
                      setFormData({...formData, image: file});
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                />
                <p className="text-xs text-slate-400">Format yang didukung: JPG, PNG, WEBP. Menggunakan rasio persegi lebih disarankan.</p>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Data Utama */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">Nama Produk <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Tag className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Contoh: Paracetamol 500mg"
                  className="block w-full rounded-lg border border-slate-300 pl-10 px-3 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-blue-400 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Kategori <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <LayoutList className="h-4 w-4 text-slate-400" />
                </div>
                <select
                  name="category" value={formData.category} onChange={handleChange}
                  className="block w-full rounded-lg border border-slate-300 pl-10 px-3 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-blue-400 transition-colors"
                >
                  <option value="Obat">Obat</option>
                  <option value="Vaksin">Vaksin</option>
                  <option value="Makanan">Makanan</option>
                  <option value="Aksesoris">Aksesoris</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">Deskripsi / Kegunaan</label>
              <div className="relative">
                <div className="pointer-events-none absolute top-3 left-0 flex items-start pl-3">
                  <FileText className="h-4 w-4 text-slate-400" />
                </div>
                <textarea
                  name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Opsional: Tuliskan deskripsi singkat, indikasi, atau peringatan penggunaan."
                  className="block w-full rounded-lg border border-slate-300 pl-10 px-3 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-blue-400 transition-colors"
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Pricing & Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Harga Beli Dasar (Rp) <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <DollarSign className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="number" name="base_price" value={formData.base_price} onChange={handleChange} min="0" placeholder="0"
                  className="block w-full rounded-lg border border-slate-300 pl-10 px-3 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-blue-400 transition-colors"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Harga Jual (Rp) <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <DollarSign className="h-4 w-4 text-emerald-500" />
                </div>
                <input
                  type="number" name="selling_price" value={formData.selling_price} onChange={handleChange} min="0" placeholder="0"
                  className="block w-full rounded-lg border border-slate-300 pl-10 px-3 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-blue-400 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Stok Awal (Fisik)</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Hash className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="number" name="current_stock" value={formData.current_stock} onChange={handleChange} min="0"
                  className="block w-full rounded-lg border border-slate-300 pl-10 px-3 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-blue-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Batas Stok Minimum (Peringatan)</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Hash className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="number" name="min_stock" value={formData.min_stock} onChange={handleChange} min="0"
                  className="block w-full rounded-lg border border-slate-300 pl-10 px-3 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-blue-400 transition-colors"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
            <button 
              type="button" 
              onClick={() => navigate('/pharmacy/inventory')} 
              className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={!isFormValid || isSubmitting}
              className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-bold text-white transition-all 
                ${!isFormValid || isSubmitting ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
            >
              {isSubmitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...</>
              ) : (
                <><Save className="h-4 w-4" /> Simpan Produk</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormTambahProduct;
