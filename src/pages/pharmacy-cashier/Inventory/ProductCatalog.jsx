import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Package, X, Calendar, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCatalog = () => {
  // Dummy data ditambahkan properti 'description'
  const [productData] = useState([
    { 
      id: 1, name: 'Amoxicillin Sirup 125mg', category: 'Obat', purchasePrice: 15000, sellingPrice: 25000, stock: 50, status: 'Tersedia', 
      isExpired: true, nearestExp: '10 Mei 2026',
      description: 'Amoxicillin sirup kering adalah obat antibiotik golongan penisilin yang digunakan untuk mengobati berbagai macam infeksi bakteri pada hewan, seperti infeksi saluran pernapasan, saluran kemih, dan infeksi kulit.',
      batches: [
        { id: 'BCH-001', qty: 15, expDate: '10 Mei 2026', status: 'Kedaluwarsa' },
        { id: 'BCH-002', qty: 35, expDate: '20 Des 2026', status: 'Aman' }
      ]
    },
    { 
      id: 2, name: 'Bravecto Spot-On Cat', category: 'Obat', purchasePrice: 300000, sellingPrice: 380000, stock: 5, status: 'Hampir Habis', 
      isExpired: true, nearestExp: '14 Mei 2026',
      description: 'Bravecto Spot-On merupakan obat tetes kutu premium untuk kucing yang memberikan perlindungan jangka panjang hingga 12 minggu dari serangan pinjal (fleas) dan caplak (ticks).',
      batches: [
        { id: 'BCH-003', qty: 5, expDate: '14 Mei 2026', status: 'Kedaluwarsa' }
      ]
    },
    { 
      id: 3, name: 'Royal Canin Kitten 2kg', category: 'Makanan Hewan', purchasePrice: 200000, sellingPrice: 245000, stock: 12, status: 'Tersedia', 
      isExpired: false, nearestExp: '12 Ags 2027',
      description: 'Makanan kering lengkap dan seimbang yang diformulasikan khusus untuk memenuhi kebutuhan nutrisi anak kucing pada fase pertumbuhan kedua (usia hingga 12 bulan).',
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
          <h1 className="text-2xl font-bold text-slate-800">Master Katalog Produk</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">Kelola daftar obat, vaksin, makanan, dan aksesori klinik.</p>
        </div>
        <Link 
          to="/admin/pharmacy-cashier/inventory/FormRestockBarang" 
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
          <input type="text" placeholder="Cari nama produk atau SKU..." className="block w-full rounded-sm border border-slate-300 pl-10 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
        </div>
      </div>

      {/* 2. Area Katalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {productData.map((product) => (
          <div 
            key={product.id} 
            onClick={() => handleOpenModal(product)}
            className="group flex flex-col bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            {/* Area Gambar Produk Placeholder */}
            <div className="relative aspect-square bg-slate-50 border-b border-slate-100 flex items-center justify-center text-slate-400 p-6">
              <Package className="h-16 w-16 stroke-[1.5]" />
              
              {/* Badge Kategori */}
              <span className="absolute top-2 left-2 inline-flex rounded-sm bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700 border border-blue-200 uppercase tracking-wider">
                {product.category}
              </span>

              {/* Badge Status Stok */}
              <span className={`absolute bottom-2 left-2 inline-flex rounded-sm px-2 py-0.5 text-[11px] font-bold border shadow-sm ${
                product.status === 'Tersedia' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-orange-50 text-orange-700 border-orange-200'
              }`}>
                {product.status}
              </span>
            </div>

            {/* Konten/Informasi Produk */}
            <div className="p-4 flex flex-col flex-1 bg-white">
              <span className="text-[11px] font-semibold text-slate-400">ID: PRD-00{product.id}</span>
              
              {/* Nama Produk */}
              <h3 className="mt-1 font-medium text-slate-800 text-sm line-clamp-2 h-10 group-hover:text-blue-600 transition-colors">
                {product.name}
              </h3>
              
              {/* Harga Jual Produk */}
              <div className="mt-2 text-base font-bold text-slate-900">
                {formatRupiah(product.sellingPrice)}
              </div>

              <div className="my-3 border-t border-dashed border-slate-100" />

              {/* Info Exp Date */}
              <div className={`w-full inline-flex items-center justify-between rounded-sm p-2 text-xs font-medium border ${
                product.isExpired ? 'bg-red-50 text-red-700 border-red-100' : 'bg-slate-50 text-slate-600 border-slate-100'
              }`}>
                <div className="flex items-center gap-1.5 truncate">
                  <Calendar className="h-3.5 w-3.5 shrink-0 opacity-70" />
                  <span className="truncate">Exp: {product.nearestExp}</span>
                </div>
                <AlertCircle className="h-3.5 w-3.5 shrink-0 opacity-80" />
              </div>

              {/* Footer Kartu: Sisa Stok & Tombol Aksi */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="text-slate-500">
                  Stok: <span className="font-bold text-slate-700">{product.stock} Pcs</span>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={(e) => { e.stopPropagation(); }} 
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-sm transition-colors" 
                    title="Edit Produk"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); }} 
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

      {/* 3. POP-UP (MODAL) DESKRIPSI PRODUK */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md rounded-md bg-white shadow-xl ring-1 ring-slate-900/5">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Deskripsi Produk</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">{selectedProduct.name}</p>
              </div>
              <button onClick={handleCloseModal} className="rounded-sm p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5">
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 border border-slate-200 rounded-sm">
                {selectedProduct.description}
              </p>
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

export default ProductCatalog;