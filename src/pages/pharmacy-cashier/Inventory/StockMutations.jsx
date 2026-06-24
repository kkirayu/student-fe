import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Plus, Edit, Trash2, Copy, ArrowUpRight, 
  ArrowDownLeft, RefreshCw, Loader2, Calendar, 
  AlertCircle, Filter, FileText, X ,Package, Truck
} from 'lucide-react';
import { Link } from 'react-router-dom';
// Asumsi service yang akan dibuat
// import { getStockMutations, deleteMutation } from '../../../services/pharmacyService';

const StockMutations = () => {
  const [mutationData, setMutationData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // State untuk Detail Mutasi
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMutation, setSelectedMutation] = useState(null);

  // Fungsi untuk mengambil data (Mock data berdasarkan gambar yang Anda lampirkan)
  const fetchMutations = async (search = '') => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulasi API call - Ganti dengan await getStockMutations(search) nantinya
      const mockData = [
        { id: 1, product_id: 1, product_name: "Amoxicillin 500mg", supplier_id: 1, mutation_type: "In", quantity: 100, date: "2026-06-15 17:46:54", created_at: "2026-06-15 17:46:54" },
        { id: 2, product_id: 1, product_name: "Amoxicillin 500mg", supplier_id: 1, mutation_type: "In", quantity: 100, date: "2026-06-15 17:49:30", created_at: "2026-06-15 17:49:30" },
        { id: 3, product_id: 2, product_name: "Paracetamol Syrup", supplier_id: 2, mutation_type: "In", quantity: 50, date: "2026-06-15 17:49:30", created_at: "2026-06-15 17:49:30" },
        { id: 4, product_id: 3, product_name: "Vitamin C", supplier_id: 1, mutation_type: "In", quantity: 75, date: "2026-06-15 17:49:30", created_at: "2026-06-15 17:49:30" },
        { id: 5, product_id: 1, product_name: "Amoxicillin 500mg", supplier_id: null, mutation_type: "Out", quantity: 5, date: "2026-06-15 17:49:30", created_at: "2026-06-15 17:49:30" },
        { id: 6, product_id: 2, product_name: "Paracetamol Syrup", supplier_id: null, mutation_type: "Out", quantity: 3, date: "2026-06-15 17:49:30", created_at: "2026-06-15 17:49:30" },
        { id: 7, product_id: 3, product_name: "Vitamin C", supplier_id: null, mutation_type: "Out", quantity: 2, date: "2026-06-15 17:49:30", created_at: "2026-06-15 17:49:30" },
      ];

      // Filter sederhana untuk simulasi search
      const filtered = mockData.filter(item => 
        item.product_name.toLowerCase().includes(search.toLowerCase()) ||
        item.mutation_type.toLowerCase().includes(search.toLowerCase())
      );

      setMutationData(filtered);
    } catch (err) {
      setError('Gagal memuat data mutasi stok.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMutations();
  }, []);

  // Search Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMutations(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const cardStats = useMemo(() => {

  const totalMutation = mutationData.length;

  const totalIn = mutationData.filter(
    item => item.mutation_type === "In"
  ).length;

  const totalOut = mutationData.filter(
    item => item.mutation_type === "Out"
  ).length;

  const supplierCount = new Set(
    mutationData
      .filter(item => item.supplier_id)
      .map(item => item.supplier_id)
  ).size;

  return [
    {
      title: "Total Mutasi",
      value: totalMutation,
      icon: <Package className="h-6 w-6 text-blue-600" />,
      bgIcon: "bg-blue-100",
    },
    {
      title: "Barang Masuk",
      value: totalIn,
      icon: <ArrowUpRight className="h-6 w-6 text-emerald-600" />,
      bgIcon: "bg-emerald-100",
    },
    {
      title: "Barang Keluar",
      value: totalOut,
      icon: <ArrowDownLeft className="h-6 w-6 text-red-600" />,
      bgIcon: "bg-red-100",
    },
    {
      title: "Mutasi Hari Ini",
      value: mutationData.filter(item => {
        const today = new Date().toDateString();
        return new Date(item.date).toDateString() === today;
      }).length,
      icon: <Calendar className="h-6 w-6 text-purple-600" />,
      bgIcon: "bg-purple-100",
    }
  ];

}, [mutationData]);

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Mutasi Stok Produk</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">Riwayat barang masuk (In) dan barang keluar (Out) dari gudang farmasi.</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center justify-center gap-2 rounded-sm border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 shadow-sm">
            <FileText className="h-4 w-4" />
            Export Laporan
          </button>
          <Link 
            to="/pharmacy/add-mutation" 
            className="inline-flex items-center justify-center gap-2 rounded-sm bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Mutasi Baru
          </Link>
        </div>
      </div>

      {/* Card Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cardStats.map((stat, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            {/* Top Accent */}
            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600" />

            <div className="flex items-center justify-between p-6">
              {/* Left */}
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <h2 className="mt-3 text-5xl font-bold tracking-tight text-slate-800">
                  {stat.value}
                </h2>

                <div className="mt-4 inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                  Ringkasan Data
                </div>
              </div>

              {/* Right Icon */}
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-2xl ${stat.bgIcon} transition-transform duration-300 group-hover:scale-110`}
              >
                {React.cloneElement(stat.icon, {
                  className: stat.icon.props.className.replace("h-6 w-6", "h-9 w-9"),
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Main Table Area */}
      <div className="rounded-sm border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between bg-white">
          <div className="relative w-full max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari produk atau tipe (In/Out)..." 
              className="block w-full rounded-sm border border-slate-300 pl-10 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" 
            />
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              <Filter className="h-4 w-4" />
              Filter Tanggal
            </button>
            <button
              onClick={() => fetchMutations(searchTerm)}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <span className="mt-4 text-sm font-medium text-slate-500">Memuat riwayat mutasi...</span>
          </div>
        ) : mutationData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <RefreshCw className="h-12 w-12 mb-3" />
            <p className="text-sm font-medium">Data mutasi tidak ditemukan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-left whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Produk</th>
                  <th className="px-6 py-4">Supplier</th>
                  <th className="px-6 py-4 text-center">Tipe</th>
                  <th className="px-6 py-4 text-center">Jumlah</th>
                  <th className="px-6 py-4">Tanggal Mutasi</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {mutationData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-900">{item.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{item.product_name}</div>
                      <div className="text-xs text-slate-500">ID Produk: {item.product_id}</div>
                    </td>
                    <td className="px-6 py-4">
                      {item.supplier_id ? (
                        <div className="text-slate-600 font-medium">Supplier #{item.supplier_id}</div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-xs font-bold border ${
                        item.mutation_type === 'In' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {item.mutation_type === 'In' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownLeft className="h-3 w-3" />}
                        {item.mutation_type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-slate-700">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {formatDate(item.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => { setSelectedMutation(item); setIsModalOpen(true); }}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-sm" 
                          title="Ubah"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-sm" title="Salin">
                          <Copy className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-sm" title="Hapus">
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

      {/* Modal Detail Mutasi */}
      {isModalOpen && selectedMutation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-md bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <h3 className="text-lg font-bold text-slate-800">Detail Mutasi Stok</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 border border-slate-100 bg-slate-50 rounded-sm">
                  <div className="text-slate-500 text-xs font-bold uppercase">Produk</div>
                  <div className="text-slate-800 font-bold">{selectedMutation.product_name}</div>
                </div>
                <div className="p-3 border border-slate-100 bg-slate-50 rounded-sm">
                  <div className="text-slate-500 text-xs font-bold uppercase">Tipe Mutasi</div>
                  <div className={`font-bold ${selectedMutation.mutation_type === 'In' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {selectedMutation.mutation_type === 'In' ? 'Barang Masuk' : 'Barang Keluar'}
                  </div>
                </div>
                <div className="p-3 border border-slate-100 bg-slate-50 rounded-sm">
                  <div className="text-slate-500 text-xs font-bold uppercase">Jumlah</div>
                  <div className="text-slate-800 font-bold">{selectedMutation.quantity} Pcs</div>
                </div>
                <div className="p-3 border border-slate-100 bg-slate-50 rounded-sm">
                  <div className="text-slate-500 text-xs font-bold uppercase">ID Mutasi</div>
                  <div className="text-slate-800 font-mono">MUT-{selectedMutation.id}</div>
                </div>
              </div>
              
              <div className="p-3 border border-slate-100 bg-slate-50 rounded-sm">
                <div className="text-slate-500 text-xs font-bold uppercase">Keterangan Log</div>
                <div className="text-slate-600 text-sm mt-1">
                  Mutasi dilakukan pada {selectedMutation.date} oleh system administrator.
                </div>
              </div>
            </div>
            <div className="flex justify-end border-t border-slate-200 p-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="rounded-sm bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockMutations;