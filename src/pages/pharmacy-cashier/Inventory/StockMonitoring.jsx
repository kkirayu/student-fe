import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Package, X, Calendar, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const StockMonitoring = () => {
  // Dummy data diperbarui dengan simulasi "batches" (detail stok per tanggal kedaluwarsa)
  const [productData] = useState([
    { 
      id: 1, name: 'Amoxicillin Sirup 125mg', category: 'Obat', purchasePrice: 15000, sellingPrice: 25000, stock: 50, status: 'Tersedia', 
      isExpired: true, nearestExp: '10 Mei 2026',
      batches: [
        { id: 'BCH-001', qty: 15, expDate: '10 Mei 2026', status: 'Kedaluwarsa' },
        { id: 'BCH-002', qty: 35, expDate: '20 Des 2026', status: 'Aman' }
      ]
    },
    { 
      id: 2, name: 'Bravecto Spot-On Cat', category: 'Obat', purchasePrice: 300000, sellingPrice: 380000, stock: 5, status: 'Hampir Habis', 
      isExpired: true, nearestExp: '14 Mei 2026',
      batches: [
        { id: 'BCH-003', qty: 5, expDate: '14 Mei 2026', status: 'Kedaluwarsa' }
      ]
    },
    { 
      id: 3, name: 'Royal Canin Kitten 2kg', category: 'Makanan Hewan', purchasePrice: 200000, sellingPrice: 245000, stock: 12, status: 'Tersedia', 
      isExpired: false, nearestExp: '12 Ags 2027',
      batches: [
        { id: 'BCH-004', qty: 12, expDate: '12 Ags 2027', status: 'Aman' }
      ]
    },
  ]);

  // State untuk Pop-up (Modal)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
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
            <input type="text" placeholder="Cari nama produk atau SKU..." className="block w-full rounded-sm border border-slate-300 pl-10 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
        </div>

        {/* Tabel Data Produk */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Nama Produk</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4 text-center">Stok</th>
                <th className="px-6 py-4">Exp. Date Terdekat</th>
                <th className="px-6 py-4 text-center">Status Stok</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {productData.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {/* Warna Gambar dan Text Dikembalikan ke Normal (Slate) */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border bg-slate-100 border-slate-200 text-slate-400">
                        <Package className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{product.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">ID: PRD-00{product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-sm bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 border border-slate-200">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-medium text-slate-700">{product.stock}</span>
                  </td>
                  
                  {/* Kolom Exp Date yang bisa diklik untuk memunculkan modal */}
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleOpenModal(product)}
                      className={`inline-flex items-center gap-1.5 font-semibold hover:underline focus:outline-none ${product.isExpired ? 'text-red-600' : 'text-slate-600 hover:text-blue-600'}`}
                    >
                      {product.nearestExp}
                      <AlertCircle className="h-4 w-4 opacity-70" />
                    </button>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex rounded-sm px-2.5 py-1 text-xs font-medium border ${
                      product.status === 'Tersedia' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-orange-50 text-orange-700 border-orange-200'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-sm transition-colors" title="Edit Produk">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors" title="Hapus Produk">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. POP-UP (MODAL) DETAIL KEDALUWARSA */}
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
                  <div className="text-xs font-bold uppercase text-slate-500">Total Stok Sistem</div>
                  <div className="mt-1 text-xl font-bold text-slate-900">{selectedProduct.stock} Pcs</div>
                </div>
                {/* Info Alert jika ada yang expired */}
                {selectedProduct.isExpired && (
                  <div className="rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    <span className="font-bold">Perhatian:</span> Sebagian stok sudah kedaluwarsa!
                  </div>
                )}
              </div>

              {/* Rincian Batch */}
              <h4 className="mb-3 text-sm font-bold text-slate-700">Rincian per Batch / Tanggal Masuk</h4>
              <div className="space-y-3">
                {selectedProduct.batches.map((batch, index) => (
                  <div key={index} className="flex items-center justify-between rounded-sm border border-slate-200 p-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-sm bg-slate-100`}>
                        <Package className="h-4 w-4 text-slate-500" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800">{batch.qty} Pcs</div>
                        <div className="text-xs text-slate-500">Batch: {batch.id}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1.5 text-sm font-semibold text-slate-700">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {batch.expDate}
                      </div>
                      <div className={`mt-1 text-xs font-medium ${batch.status === 'Kedaluwarsa' ? 'text-red-600' : 'text-emerald-600'}`}>
                        {batch.status === 'Kedaluwarsa' ? 'Sudah Expired' : 'Masih Aman'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 rounded-b-md border-t border-slate-200 bg-slate-50 p-4">
              <button onClick={handleCloseModal} className="rounded-sm bg-white border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Tutup</button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default StockMonitoring;