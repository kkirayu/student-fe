import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Package, X, Calendar, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../../services/pharmacyService';

const ProductCatalog = () => {
  const [productData, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [modalType, setModalType] = useState('detail'); // 'detail' or 'edit'
  const [editFormData, setEditFormData] = useState({
    name: '', category: '', description: '', base_price: 0, selling_price: 0, min_stock: 0, exp_date: '', image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // State untuk konfirmasi hapus
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fungsi untuk mengambil data produk dari backend
  const fetchProducts = async (search = '', page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const responseData = await getProducts(search, page);
      setProductData(Array.isArray(responseData.data) ? responseData.data : []);
      setCurrentPage(responseData.current_page || 1);
      setLastPage(responseData.last_page || 1);
    } catch (err) {
      console.error('Product Catalog Error:', err);
      setError(err.message || 'Gagal memuat data katalog produk.');
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce pencarian
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(searchTerm, 1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleOpenModal = (product, type = 'detail') => {
    setSelectedProduct(product);
    setModalType(type);
    if (type === 'edit') {
      setEditFormData({
        name: product.name,
        category: product.category,
        description: product.description || '',
        base_price: product.base_price || 0,
        selling_price: product.selling_price || 0,
        min_stock: product.min_stock || 0,
        exp_date: product.exp_date ? product.exp_date.split(' ')[0] : '',
        image: null
      });
      setImagePreview(product.image_url || null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setModalType('detail');
  };

  const handleUpdate = async () => {
    if (!selectedProduct) return;
    setIsSaving(true);
    try {
      // Import updateProduct dari pharmacyService
      const { updateProduct } = await import('../../../services/pharmacyService');
      
      let payload = editFormData;
      if (editFormData.image) {
        payload = new FormData();
        Object.keys(editFormData).forEach(key => {
          if (editFormData[key] !== null && editFormData[key] !== undefined) {
            payload.append(key, editFormData[key]);
          }
        });
      }

      await updateProduct(selectedProduct.id, payload);
      setIsModalOpen(false);
      fetchProducts(searchTerm, currentPage);
    } catch (err) {
      alert(err.message || 'Gagal memperbarui produk.');
    } finally {
      setIsSaving(false);
    }
  };

  // Fungsi hapus produk
  const handleDelete = async (id) => {
    setIsDeleting(true);
    try {
      await deleteProduct(id);
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

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Master Katalog Produk</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">Kelola daftar obat, vaksin, makanan, dan aksesori klinik.</p>
        </div>
        <Link 
          to="/pharmacy/inventory/add" 
          className="inline-flex items-center justify-center gap-2 rounded-sm bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Tambah Produk
        </Link>
      </div>

      {/* Toolbar Pencarian */}
      <div className="flex flex-col gap-4 border border-slate-200 rounded-sm p-4 sm:flex-row sm:items-center sm:justify-between bg-white shadow-sm">
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
        <div className="flex flex-col items-center justify-center py-20 text-blue-500">
          <Loader2 className="h-10 w-10 animate-spin" />
          <span className="mt-4 text-sm font-medium text-slate-500">Memuat data katalog...</span>
        </div>
      ) : error ? (
        // State Error
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center max-w-md w-full">
            <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-red-800 mb-1">Gagal Memuat Katalog</h3>
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
        <div className="flex flex-col items-center justify-center py-16 rounded-sm border border-slate-200 bg-white">
          <Package className="h-12 w-12 text-slate-300 mb-3" />
          <span className="text-sm text-slate-500">
            {searchTerm ? 'Tidak ada produk yang sesuai pencarian.' : 'Belum ada data produk.'}
          </span>
        </div>
      ) : (
        // Grid Katalog Produk
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {productData.map((product) => (
            <div 
              key={product.id} 
              onClick={() => handleOpenModal(product, 'detail')}
              className="group flex flex-col bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <div className="relative aspect-square bg-slate-50 border-b border-slate-100 flex items-center justify-center text-slate-400 p-0 overflow-hidden">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <Package className="h-16 w-16 stroke-[1.5]" />
                )}
                
                <span className="absolute top-2 left-2 inline-flex rounded-sm bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700 border border-blue-200 uppercase tracking-wider shadow-sm">
                  {product.category}
                </span>

                <span className={`absolute bottom-2 left-2 inline-flex rounded-sm px-2 py-0.5 text-[11px] font-bold border shadow-sm ${
                  product.stock_status === 'Tersedia' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : product.stock_status === 'Habis'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-orange-50 text-orange-700 border-orange-200'
                }`}>
                  {product.stock_status}
                </span>
              </div>

              <div className="p-4 flex flex-col flex-1 bg-white">
                <span className="text-[11px] font-semibold text-slate-400">ID: PRD-{String(product.id).padStart(3, '0')}</span>
                
                <h3 className="mt-1 font-medium text-slate-800 text-sm line-clamp-2 h-10 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                
                <div className="mt-2 text-base font-bold text-slate-900">
                  {formatRupiah(product.selling_price)}
                </div>

                <div className="my-3 border-t border-dashed border-slate-100" />

                <div className={`w-full flex flex-col gap-1.5 rounded-sm p-2 text-xs font-medium border ${
                  product.is_expired ? 'bg-red-50 text-red-700 border-red-100' : 'bg-slate-50 text-slate-600 border-slate-100'
                }`}>
                  {(product.product_batches && product.product_batches.length > 0) ? (
                    product.product_batches.map((batch, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 truncate">
                          <Calendar className="h-3.5 w-3.5 shrink-0 opacity-70" />
                          <span className="truncate">Exp: {formatDate(batch.exp_date)} ({batch.stock} Pcs)</span>
                        </div>
                        {batch.exp_date && batch.exp_date < new Date().toISOString().split('T')[0] && <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0 opacity-80" />}
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-1.5 truncate">
                      <Calendar className="h-3.5 w-3.5 shrink-0 opacity-70" />
                      <span className="truncate">Exp: {formatDate(product.exp_date)}</span>
                      {product.exp_date && <AlertCircle className="h-3.5 w-3.5 shrink-0 opacity-80" />}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-slate-500">
                    Stok: <span className={`font-bold ${product.current_stock <= product.min_stock ? 'text-red-600' : 'text-slate-700'}`}>{product.current_stock} Pcs</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleOpenModal(product, 'edit'); }} 
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-sm transition-colors" 
                      title="Edit Produk"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setDeleteConfirm(product); }} 
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors" 
                      title="Hapus Produk"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Pagination Controls */}
      {lastPage > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button 
            onClick={() => fetchProducts(searchTerm, currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="px-4 py-2 rounded-sm border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-slate-600 font-medium px-4">
            Halaman {currentPage} dari {lastPage}
          </span>
          <button 
            onClick={() => fetchProducts(searchTerm, currentPage + 1)}
            disabled={currentPage === lastPage || isLoading}
            className="px-4 py-2 rounded-sm border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* MODAL DETAIL PRODUK */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md rounded-md bg-white shadow-xl ring-1 ring-slate-900/5">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {modalType === 'edit' ? 'Ubah Produk' : 'Detail Produk'}
                </h3>
                <p className="text-sm font-medium text-slate-500 mt-1">
                  {modalType === 'edit' ? 'Edit data produk' : selectedProduct.name}
                </p>
              </div>
              <button onClick={handleCloseModal} className="rounded-sm p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {modalType === 'edit' ? (
                // FORM EDIT
                <div className="space-y-4">
                  {/* Foto Upload */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Foto Produk (Maks 1MB)</label>
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 shrink-0 bg-slate-100 border border-slate-300 border-dashed rounded-md flex items-center justify-center overflow-hidden">
                        {imagePreview ? (
                          <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                        ) : (
                          <Package className="h-8 w-8 text-slate-300" />
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
                              setEditFormData({...editFormData, image: file});
                              setImagePreview(URL.createObjectURL(file));
                            }
                          }}
                        />
                        <p className="text-[11px] text-slate-400 mt-1">Format didukung: JPG, PNG, WEBP.</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nama Produk</label>
                    <input 
                      type="text"
                      className="w-full rounded-sm border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Kategori</label>
                    <select 
                      className="w-full rounded-sm border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                      value={editFormData.category}
                      onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                    >
                      <option value="Obat">Obat</option>
                      <option value="Vaksin">Vaksin</option>
                      <option value="Makanan">Makanan</option>
                      <option value="Aksesoris">Aksesoris</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Deskripsi</label>
                    <textarea 
                      className="w-full rounded-sm border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                      rows="3"
                      value={editFormData.description}
                      onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Harga Beli</label>
                      <input 
                        type="number" min="0"
                        className="w-full rounded-sm border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                        value={editFormData.base_price}
                        onChange={(e) => setEditFormData({...editFormData, base_price: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Harga Jual</label>
                      <input 
                        type="number" min="0"
                        className="w-full rounded-sm border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                        value={editFormData.selling_price}
                        onChange={(e) => setEditFormData({...editFormData, selling_price: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Minimal Stok</label>
                      <input 
                        type="number" min="0"
                        className="w-full rounded-sm border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                        value={editFormData.min_stock}
                        onChange={(e) => setEditFormData({...editFormData, min_stock: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tgl Kadaluarsa</label>
                      <input 
                        type="date"
                        className="w-full rounded-sm border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                        value={editFormData.exp_date}
                        onChange={(e) => setEditFormData({...editFormData, exp_date: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // DETAIL VIEW
                <div className="space-y-4">
                  {selectedProduct.image_url && (
                    <div className="w-full aspect-video rounded-sm overflow-hidden bg-slate-100 border border-slate-200">
                      <img src={selectedProduct.image_url} alt={selectedProduct.name} className="w-full h-full object-contain" />
                    </div>
                  )}

                  {/* Info Kategori & Status */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex rounded-sm bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 border border-blue-200 uppercase tracking-wider">
                      {selectedProduct.category}
                    </span>
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

                  {/* Penjelasan Singkat */}
                  <div>
                    <h4 className="text-xs font-bold uppercase text-slate-400 mb-1.5">Penjelasan Singkat</h4>
                    {selectedProduct.description ? (
                      <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 border border-slate-200 rounded-sm">
                        {selectedProduct.description}
                      </p>
                    ) : (
                      <p className="text-sm text-slate-400 italic bg-slate-50 p-3 border border-dashed border-slate-200 rounded-sm">
                        Belum ada deskripsi untuk produk ini.
                      </p>
                    )}
                  </div>

                  {/* Harga */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-sm border border-slate-200 p-3">
                      <div className="text-xs font-bold uppercase text-slate-400">Harga Beli</div>
                      <div className="mt-1 text-sm font-bold text-slate-800">{formatRupiah(selectedProduct.base_price)}</div>
                    </div>
                    <div className="rounded-sm border border-slate-200 p-3">
                      <div className="text-xs font-bold uppercase text-slate-400">Harga Jual</div>
                      <div className="mt-1 text-sm font-bold text-emerald-700">{formatRupiah(selectedProduct.selling_price)}</div>
                    </div>
                  </div>

                  {/* Stok */}
                  <div className="rounded-sm border border-slate-200 p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold uppercase text-slate-400">Stok Saat Ini</div>
                        <div className={`mt-1 text-xl font-bold ${selectedProduct.current_stock <= selectedProduct.min_stock ? 'text-red-600' : 'text-slate-900'}`}>
                          {selectedProduct.current_stock} Pcs
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold uppercase text-slate-400">Minimum Stok</div>
                        <div className="mt-1 text-xl font-bold text-slate-500">{selectedProduct.min_stock} Pcs</div>
                      </div>
                    </div>
                    {selectedProduct.current_stock <= selectedProduct.min_stock && (
                      <div className="mt-3 rounded-sm border border-orange-200 bg-orange-50 px-3 py-2 text-xs text-orange-700 font-medium">
                        ⚠️ Stok di bawah batas minimum! Segera lakukan restock.
                      </div>
                    )}
                  </div>

                  {/* Kedaluwarsa - Multi Batch */}
                  <div className={`rounded-sm border p-3 ${selectedProduct.is_expired ? 'border-red-200 bg-red-50' : 'border-slate-200'}`}>
                    <div className="text-xs font-bold uppercase text-slate-400 mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      Daftar Kedaluwarsa (Berdasarkan Batch)
                    </div>
                    <div className="space-y-2">
                      {(selectedProduct.product_batches && selectedProduct.product_batches.length > 0) ? (
                        selectedProduct.product_batches.map((batch, idx) => {
                          const isBatchExpired = batch.exp_date && batch.exp_date < new Date().toISOString().split('T')[0];
                          return (
                            <div key={idx} className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                              <div className="flex items-center gap-2">
                                <span className={`h-2 w-2 rounded-full ${isBatchExpired ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                                <div className="text-sm font-bold text-slate-800">{formatDate(batch.exp_date)}</div>
                                <div className="text-xs text-slate-500 ml-2">({batch.stock} Pcs)</div>
                              </div>
                              <span className={`text-xs font-medium ${isBatchExpired ? 'text-red-600' : 'text-emerald-600'}`}>
                                {isBatchExpired ? 'Expired' : 'Aman'}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-bold text-slate-800">{formatDate(selectedProduct.exp_date)}</div>
                          <span className={`text-xs font-medium ${selectedProduct.is_expired ? 'text-red-600' : 'text-emerald-600'}`}>
                            {selectedProduct.is_expired ? 'Sudah Expired' : 'Masih Aman'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer for Edit Mode */}
            {modalType === 'edit' && (
              <div className="border-t border-slate-200 p-5 flex justify-end gap-3 bg-slate-50 rounded-b-md">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-sm border border-slate-300 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-sm bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Simpan Perubahan
                </button>
              </div>
            )}

            {/* Modal Footer */}
            {modalType === 'detail' && (
              <div className="flex justify-end gap-3 rounded-b-md border-t border-slate-200 bg-slate-50 p-4">
                <button onClick={handleCloseModal} className="rounded-sm bg-white border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Tutup</button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS */}
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

export default ProductCatalog;