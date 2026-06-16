import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X, Phone, MapPin, User, Building2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

import {
  getSuppliers,
  deleteSupplier
} from '../../../services/supplierService';

// Import assets jika masih diperlukan untuk fallback statis (opsional)
import logoPertamina from '../../../assets/company/pertamina.jpeg';
import logoKimiaFarma from '../../../assets/company/kimia_farma.jpeg';

const SupplierManagement = () => {
  const [supplierData, setSupplierData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
  setLoading(true);
  try {
    const data = await getSuppliers();
    // Karena service Anda sudah melakukan `return response.data.data`,
    // variabel `data` di sini sudah langsung berbentuk Array []
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
    await deleteSupplier(id); // 1. Menghapus di database lewat API
    await loadSuppliers();    // 2. Memanggil ulang data terbaru dari API
  } catch (error) {
    console.error('Gagal menghapus supplier:', error);
  }
};

  const handleOpenModal = (supplier) => {
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSupplier(null);
  };

  // Filter data berdasarkan data yang datang dari API (snake_case)
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
        <Link 
          to="/admin/pharmacy-cashier/inventory/FormTambahSupplier" 
          className="inline-flex items-center justify-center gap-2 rounded-sm bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Tambah Supplier
        </Link>
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
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <button 
                          onClick={() => handleOpenModal(supplier)}
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

                  {/* Alamat (Menggunakan Fallback karena belum ada di DB Laravel Anda) */}
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
                      <Link 
                        to={`/admin/pharmacy-cashier/inventory/FormEditSupplier/${supplier.id}`}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-sm transition-colors" 
                        title="Edit Supplier"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
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

      {/* 3. POP-UP (MODAL) DETAIL KATALOG PRODUK SUPPLIER */}
      {isModalOpen && selectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-lg rounded-md bg-white shadow-xl ring-1 ring-slate-900/5">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Profil & Produk Supplier</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">{selectedSupplier.company_name}</p>
              </div>
              <button onClick={handleCloseModal} className="rounded-sm p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <div className="rounded-sm border border-slate-200 bg-slate-50 p-4 flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-sm border bg-white border-slate-200 text-slate-500 overflow-hidden">
                  {selectedSupplier.logo ? (
                    <img src={selectedSupplier.logo} alt={selectedSupplier.company_name} className="h-full w-full object-contain p-1" />
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
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 rounded-b-md border-t border-slate-200 bg-slate-50 p-4">
              <button onClick={handleCloseModal} className="rounded-sm bg-white border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Tutup
              </button>
              <a 
                href={`https://wa.me/${selectedSupplier.phone_number.replace(/[^0-9]/g, '')}?text=Halo%20${selectedSupplier.sales_name},%20saya%20ingin%20melakukan%20pemesanan%20ulang%20stok%20klinik.`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5"
              >
                <Phone className="h-4 w-4" />
                Hubungi Sales Sekarang
              </a>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierManagement;