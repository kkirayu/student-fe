import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X, Phone, MapPin, User, Building2, ExternalLink, Loader2 } from 'lucide-react';

import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier
} from '../../../services/supplierService';

const SupplierManagement = () => {
  const [supplierData, setSupplierData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('detail'); // 'detail', 'add', 'edit'
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    company_name: '',
    sales_name: '',
    phone_number: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const data = await getSuppliers();
      setSupplierData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Gagal mengambil data supplier:', error);
      setSupplierData([]); // Fallback aman jika API error
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus supplier ini?');
    if (!confirmDelete) return;

    try {
      await deleteSupplier(id);
      await loadSuppliers();
    } catch (error) {
      console.error('Gagal menghapus supplier:', error);
    }
  };

  const handleOpenModal = (supplier = null, type = 'detail') => {
    setModalType(type);
    setSelectedSupplier(supplier);
    
    if (type === 'add') {
      setFormData({ company_name: '', sales_name: '', phone_number: '', image: null });
      setImagePreview(null);
    } else if (type === 'edit' && supplier) {
      setFormData({
        company_name: supplier.company_name,
        sales_name: supplier.sales_name,
        phone_number: supplier.phone_number,
        image: null
      });
      setImagePreview(supplier.image_url || null);
    }
    
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSupplier(null);
    setModalType('detail');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let payload = new FormData();
      payload.append('company_name', formData.company_name);
      payload.append('sales_name', formData.sales_name);
      payload.append('phone_number', formData.phone_number);
      if (formData.image) {
        payload.append('image', formData.image);
      }

      if (modalType === 'add') {
        await createSupplier(payload);
      } else if (modalType === 'edit') {
        await updateSupplier(selectedSupplier.id, payload);
      }

      handleCloseModal();
      await loadSuppliers();
    } catch (error) {
      console.error('Gagal menyimpan supplier:', error);
      alert('Gagal menyimpan data supplier.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredSuppliers = supplierData.filter((supplier) =>
    supplier.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.sales_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 relative">
      {/* 1. Header & Breadcrumb */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Supplier / Distributor</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">Daftar kontak vendor penyuplai obat dan kebutuhan operasional klinik.</p>
        </div>
        <button 
          onClick={() => handleOpenModal(null, 'add')}
          className="inline-flex items-center justify-center gap-2 rounded-sm bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Tambah Supplier
        </button>
      </div>

      {/* 2. Area Tabel Utama */}
      <div className="rounded-sm border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Toolbar Tabel */}
        <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between bg-white">
          <div className="relative w-full max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input 
              type="text" 
              placeholder="Cari nama PT atau nama sales..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-sm border border-slate-300 pl-10 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" 
            />
          </div>
        </div>

        {/* Tabel Data Supplier */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Nama Perusahaan / PT</th>
                <th className="px-6 py-4">Kontak Sales</th>
                <th className="px-6 py-4">Nomor WhatsApp</th>
                <th className="px-6 py-4">Alamat Distribusi</th>
                <th className="px-6 py-4 text-center">Kategori Pokok</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-400">
                    Memuat data supplier...
                  </td>
                </tr>
              ) : filteredSuppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-slate-50 transition-colors group">
                  {/* Nama PT */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border bg-slate-100 border-slate-200 text-slate-500 overflow-hidden">
                        {supplier.image_url ? (
                          <img src={supplier.image_url} alt={supplier.company_name} className="h-full w-full object-cover" />
                        ) : (
                          <Building2 className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <button 
                          onClick={() => handleOpenModal(supplier, 'detail')}
                          className="font-medium text-slate-900 hover:text-blue-600 hover:underline flex items-center gap-1 text-left"
                        >
                          {supplier.company_name}
                          <ExternalLink className="h-3 w-3 opacity-50" />
                        </button>
                        <div className="text-xs text-slate-500 mt-0.5">ID: VND-{String(supplier.id).padStart(3, '0')}</div>
                      </div>
                    </div>
                  </td>

                  {/* Nama Sales */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-700">
                      <User className="h-4 w-4 text-slate-400" />
                      <span className="font-medium">{supplier.sales_name}</span>
                    </div>
                  </td>
                  
                  {/* Nomor WA */}
                  <td className="px-6 py-4">
                    <a 
                      href={`https://wa.me/${supplier.phone_number.replace(/[^0-9]/g, '')}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-blue-600 hover:underline font-medium"
                      title="Hubungi via WhatsApp"
                    >
                      <Phone className="h-4 w-4 text-emerald-500 fill-emerald-500" />
                      +{supplier.phone_number}
                    </a>
                  </td>

                  {/* Alamat */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600 max-w-xs truncate" title={supplier.address || "Alamat belum diatur"}>
                      <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                      <span>{supplier.address || '-'}</span>
                    </div>
                  </td>

                  {/* Kategori */}
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex rounded-sm bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 border border-slate-200">
                      Supplier
                    </span>
                  </td>

                  {/* Aksi */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(supplier, 'edit')}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-sm transition-colors" 
                        title="Edit Supplier"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(supplier.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors"
                        title="Hapus Supplier"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && filteredSuppliers.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-400">
                    Data supplier tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. POP-UP (MODAL) FORM / DETAIL SUPPLIER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-lg rounded-md bg-white shadow-xl ring-1 ring-slate-900/5 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 p-5 shrink-0">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {modalType === 'add' ? 'Tambah Supplier Baru' : modalType === 'edit' ? 'Ubah Data Supplier' : 'Profil & Produk Supplier'}
                </h3>
                {modalType !== 'add' && selectedSupplier && (
                  <p className="text-sm font-medium text-slate-500 mt-1">{selectedSupplier.company_name}</p>
                )}
              </div>
              <button onClick={handleCloseModal} className="rounded-sm p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 overflow-y-auto">
              {(modalType === 'add' || modalType === 'edit') ? (
                <div className="space-y-4">
                  {/* Foto Upload */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Foto / Logo (Maks 1MB)</label>
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 shrink-0 bg-slate-100 border border-slate-300 border-dashed rounded-md flex items-center justify-center overflow-hidden">
                        {imagePreview ? (
                          <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                        ) : (
                          <Building2 className="h-8 w-8 text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <input 
                          type="file" 
                          accept="image/*"
                          className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
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
                        <p className="text-[11px] text-slate-400 mt-1">Format didukung: JPG, PNG, WEBP.</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nama Perusahaan / PT <span className="text-red-500">*</span></label>
                    <input 
                      type="text"
                      className="w-full rounded-sm border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                      value={formData.company_name}
                      onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nama Sales <span className="text-red-500">*</span></label>
                    <input 
                      type="text"
                      className="w-full rounded-sm border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                      value={formData.sales_name}
                      onChange={(e) => setFormData({...formData, sales_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nomor WhatsApp <span className="text-red-500">*</span></label>
                    <input 
                      type="text"
                      className="w-full rounded-sm border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                      value={formData.phone_number}
                      onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                      placeholder="Contoh: 6281234567890"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="rounded-sm border border-slate-200 bg-slate-50 p-4 flex items-start gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-sm border bg-white border-slate-200 text-slate-500 overflow-hidden">
                      {selectedSupplier.image_url ? (
                        <img src={selectedSupplier.image_url} alt={selectedSupplier.company_name} className="h-full w-full object-cover" />
                      ) : (
                        <Building2 className="h-8 w-8" />
                      )}
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">Informasi Kontak Pemesanan</div>
                      <div className="text-sm text-slate-700">
                        <span className="font-semibold text-slate-900">Nama Sales:</span> {selectedSupplier.sales_name}
                      </div>
                      <div className="text-sm text-slate-700">
                        <span className="font-semibold text-slate-900">Alamat:</span> {selectedSupplier.address || '-'}
                      </div>
                    </div>
                  </div>

                  {/* Rincian Produk */}
                  <div>
                    <h4 className="mb-3 text-sm font-bold text-slate-700">Katalog Produk yang Disuplai:</h4>
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-sm">
                      {selectedSupplier.supplied_products && selectedSupplier.supplied_products.length > 0 ? (
                        selectedSupplier.supplied_products.map((product, index) => (
                          <div key={index} className="p-3 bg-white text-sm text-slate-800 font-medium flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                            {product}
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-sm text-slate-500 text-center">
                          Data produk supplier belum tersedia.
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 rounded-b-md border-t border-slate-200 bg-slate-50 p-4 shrink-0">
              <button onClick={handleCloseModal} className="rounded-sm bg-white border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Tutup
              </button>
              {(modalType === 'add' || modalType === 'edit') ? (
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="rounded-sm bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Simpan Perubahan
                </button>
              ) : (
                <a 
                  href={`https://wa.me/${selectedSupplier.phone_number.replace(/[^0-9]/g, '')}?text=Halo%20${selectedSupplier.sales_name},%20saya%20ingin%20melakukan%20pemesanan%20ulang%20stok%20klinik.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5"
                >
                  <Phone className="h-4 w-4" />
                  Hubungi Sales Sekarang
                </a>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierManagement;