import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Package, X, Calendar, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../../services/pharmacyService';

const StockMonitoring = () => {
  const [productData, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // State untuk Pop-up (Modal)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // State untuk konfirmasi hapus
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fungsi untuk mengambil data produk dari backend
  const fetchProducts = async (search = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProducts(search);
      setProductData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Stock Monitoring Error:', err);
      setError(err.message || 'Gagal memuat data produk.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Debounce pencarian agar tidak terlalu sering request
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Fungsi hapus produk
  const handleDelete = async (id) => {
    setIsDeleting(true);
    try {
      await deleteProduct(id);
      // Hapus dari state lokal tanpa perlu fetch ulang
      setProductData(prev => prev.filter(p => p.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      alert(err.message || 'Gagal menghapus produk.');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  // Format tanggal dari ISO ke format Indonesia
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6 relative">
      {/* 1. Header & Breadcrumb */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Master Stock Produk</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">Monitoring stok obat, vaksin, makanan, dan aksesori klinik.</p>
        </div>
        <Link 
          to="/pharmacy/restock" 
          className="inline-flex items-center justify-center gap-2 rounded-sm bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Tambah Produk
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama produk atau kategori..." 
              className="block w-full rounded-sm border border-slate-300 pl-10 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" 
            />
          </div>
          {/* Tombol Refresh */}
          <button
            onClick={() => fetchProducts(searchTerm)}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Konten berdasarkan state */}
        {isLoading ? (
          // State Loading
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <span className="mt-4 text-sm font-medium text-slate-500">Memuat data stok produk...</span>
          </div>
        ) : error ? (
          // State Error
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center max-w-md w-full">
              <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-red-800 mb-1">Gagal Memuat Data</h3>
              <p className="text-sm text-red-600 mb-4">{error}</p>
              <button
                onClick={() => fetchProducts(searchTerm)}
                className="inline-flex items-center gap-2 rounded-sm bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition shadow-sm"
              >
                <RefreshCw className="h-4 w-4" />
                Coba Lagi
              </button>
            </div>
          </div>
        ) : productData.length === 0 ? (
          // State Empty
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Package className="h-12 w-12 mb-3" />
            <p className="text-sm font-medium">
              {searchTerm ? 'Tidak ada produk yang sesuai pencarian.' : 'Belum ada data produk.'}
            </p>
          </div>
        ) : (
          // Tabel Data Produk
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-left whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Nama Produk</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4 text-center">Stok</th>
                  <th className="px-6 py-4">Exp. Date</th>
                  <th className="px-6 py-4 text-center">Status Stok</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {productData.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border bg-slate-100 border-slate-200 text-slate-400">
                          <Package className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{product.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5">ID: PRD-{String(product.id).padStart(3, '0')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-sm bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 border border-slate-200">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div>
                        <span className={`font-medium ${product.current_stock <= product.min_stock ? 'text-red-600' : 'text-slate-700'}`}>
                          {product.current_stock}
                        </span>
                        <span className="text-slate-400 text-xs ml-1">/ min {product.min_stock}</span>
                      </div>
                    </td>
                    
                    {/* Kolom Exp Date */}
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleOpenModal(product)}
                        className={`inline-flex items-center gap-1.5 font-semibold hover:underline focus:outline-none ${product.is_expired ? 'text-red-600' : 'text-slate-600 hover:text-blue-600'}`}
                      >
                        {formatDate(product.exp_date)}
                        {product.exp_date && <AlertCircle className="h-4 w-4 opacity-70" />}
                      </button>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex rounded-sm px-2.5 py-1 text-xs font-medium border ${
                        product.stock_status === 'Tersedia' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : product.stock_status === 'Habis'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-orange-50 text-orange-700 border-orange-200'
                      }`}>
                        {product.stock_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-sm transition-colors" title="Edit Produk">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => setDeleteConfirm(product)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors" 
                          title="Hapus Produk"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3. POP-UP (MODAL) DETAIL PRODUK */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-lg rounded-md bg-white shadow-xl ring-1 ring-slate-900/5">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Detail Stok & Kedaluwarsa</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">{selectedProduct.name}</p>
              </div>
              <button onClick={handleCloseModal} className="rounded-sm p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5">
              {/* Summary Box */}
              <div className="mb-5 flex items-center justify-between rounded-sm border border-slate-200 bg-slate-50 p-4">
                <div>
                  <div className="text-xs font-bold uppercase text-slate-500">Stok Saat Ini</div>
                  <div className="mt-1 text-xl font-bold text-slate-900">{selectedProduct.current_stock} Pcs</div>
                  <div className="text-xs text-slate-400 mt-0.5">Minimum: {selectedProduct.min_stock} Pcs</div>
                </div>
                {/* Info Alert jika ada yang expired */}
                {selectedProduct.is_expired && (
                  <div className="rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    <span className="font-bold">Perhatian:</span> Produk sudah kedaluwarsa!
                  </div>
                )}
              </div>

              {/* Detail Info */}
              <h4 className="mb-3 text-sm font-bold text-slate-700">Informasi Produk</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-sm border border-slate-200 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-slate-100">
                      <Package className="h-4 w-4 text-slate-500" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">Kategori</div>
                      <div className="text-xs text-slate-500">{selectedProduct.category}</div>
                    </div>
                  </div>
                  <span className={`inline-flex rounded-sm px-2.5 py-1 text-xs font-medium border ${
                    selectedProduct.stock_status === 'Tersedia' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : selectedProduct.stock_status === 'Habis'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-orange-50 text-orange-700 border-orange-200'
                  }`}>
                    {selectedProduct.stock_status}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-sm border border-slate-200 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-slate-100">
                      <Calendar className="h-4 w-4 text-slate-500" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">Tanggal Kedaluwarsa</div>
                      <div className="text-xs text-slate-500">{formatDate(selectedProduct.exp_date)}</div>
                    </div>
                  </div>
                  <div className={`text-xs font-medium ${selectedProduct.is_expired ? 'text-red-600' : 'text-emerald-600'}`}>
                    {selectedProduct.is_expired ? 'Sudah Expired' : 'Masih Aman'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-sm border border-slate-200 p-3">
                    <div className="text-xs font-bold uppercase text-slate-400">Harga Beli</div>
                    <div className="mt-1 text-sm font-bold text-slate-800">{formatRupiah(selectedProduct.base_price)}</div>
                  </div>
                  <div className="rounded-sm border border-slate-200 p-3">
                    <div className="text-xs font-bold uppercase text-slate-400">Harga Jual</div>
                    <div className="mt-1 text-sm font-bold text-slate-800">{formatRupiah(selectedProduct.selling_price)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 rounded-b-md border-t border-slate-200 bg-slate-50 p-4">
              <button onClick={handleCloseModal} className="rounded-sm bg-white border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Tutup</button>
            </div>

          </div>
        </div>
      )}

      {/* 4. MODAL KONFIRMASI HAPUS */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-md bg-white shadow-xl ring-1 ring-slate-900/5 p-6 text-center">
            <div className="flex justify-center mb-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Hapus Produk?</h3>
            <p className="text-sm text-slate-500 mb-6">
              Apakah Anda yakin ingin menghapus <span className="font-bold text-slate-700">"{deleteConfirm.name}"</span>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={isDeleting}
                className="rounded-sm border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-sm bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition shadow-sm disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockMonitoring;