import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Package, X, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCatalog = () => {
  const [productData, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://dummyjson.com/products?limit=8');
        const data = await response.json();

        const vetNames = [
          'Amoxicillin Sirup 125mg', 'Bravecto Spot-On Cat', 'Royal Canin Kitten 2kg',
          'Vaksin Felocell 4', 'Obat Cacing Drontal Cat', 'Nutri-Plus Gel 120g',
          'Shampoo Sebazole 250ml', 'Kalung Kutu Seresto'
        ];
        
        const vetCategories = [
          'Obat', 'Obat', 'Makanan Hewan', 'Vaksin', 'Obat', 'Suplemen', 'Perawatan', 'Aksesoris'
        ];

        const mappedProducts = data.products.map((item, index) => {
          const isExp = index % 3 === 0;
          return {
            id: item.id,
            name: vetNames[index] || item.title,
            category: vetCategories[index] || 'Lainnya',
            purchasePrice: Math.round((item.price * 10000) * 0.7),
            sellingPrice: Math.round(item.price * 10000),
            stock: item.stock,
            status: item.stock > 20 ? 'Tersedia' : 'Hampir Habis',
            isExpired: isExp,
            nearestExp: isExp ? '10 Mei 2026' : '15 Des 2027',
            description: item.description,
            batches: [
              { id: `BCH-00${index + 1}`, qty: item.stock, expDate: isExp ? '10 Mei 2026' : '15 Des 2027', status: isExp ? 'Kedaluwarsa' : 'Aman' }
            ]
          };
        });

        setProductData(mappedProducts);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

  const filteredProducts = productData.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 relative">
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
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-blue-500">
          <Loader2 className="h-10 w-10 animate-spin" />
          <span className="mt-4 text-sm font-medium text-slate-500">Memuat data katalog...</span>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              onClick={() => handleOpenModal(product)}
              className="group flex flex-col bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <div className="relative aspect-square bg-slate-50 border-b border-slate-100 flex items-center justify-center text-slate-400 p-6">
                <Package className="h-16 w-16 stroke-[1.5]" />
                
                <span className="absolute top-2 left-2 inline-flex rounded-sm bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700 border border-blue-200 uppercase tracking-wider">
                  {product.category}
                </span>

                <span className={`absolute bottom-2 left-2 inline-flex rounded-sm px-2 py-0.5 text-[11px] font-bold border shadow-sm ${
                  product.status === 'Tersedia' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-orange-50 text-orange-700 border-orange-200'
                }`}>
                  {product.status}
                </span>
              </div>

              <div className="p-4 flex flex-col flex-1 bg-white">
                <span className="text-[11px] font-semibold text-slate-400">ID: PRD-00{product.id}</span>
                
                <h3 className="mt-1 font-medium text-slate-800 text-sm line-clamp-2 h-10 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                
                <div className="mt-2 text-base font-bold text-slate-900">
                  {formatRupiah(product.sellingPrice)}
                </div>

                <div className="my-3 border-t border-dashed border-slate-100" />

                <div className={`w-full inline-flex items-center justify-between rounded-sm p-2 text-xs font-medium border ${
                  product.isExpired ? 'bg-red-50 text-red-700 border-red-100' : 'bg-slate-50 text-slate-600 border-slate-100'
                }`}>
                  <div className="flex items-center gap-1.5 truncate">
                    <Calendar className="h-3.5 w-3.5 shrink-0 opacity-70" />
                    <span className="truncate">Exp: {product.nearestExp}</span>
                  </div>
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 opacity-80" />
                </div>

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
      ) : (
        <div className="flex items-center justify-center py-10 rounded-sm border border-slate-200 bg-white">
          <span className="text-sm text-slate-500">Tidak ada produk yang ditemukan.</span>
        </div>
      )}

      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md rounded-md bg-white shadow-xl ring-1 ring-slate-900/5">
            
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Deskripsi Produk</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">{selectedProduct.name}</p>
              </div>
              <button onClick={handleCloseModal} className="rounded-sm p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5">
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 border border-slate-200 rounded-sm">
                {selectedProduct.description}
              </p>
            </div>

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