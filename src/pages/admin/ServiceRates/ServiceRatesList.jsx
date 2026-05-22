import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Tag, Filter, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServiceRatesList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://dummyjson.com/products?limit=10');
        const data = await response.json();

        const serviceNames = [
          'Konsultasi Dokter Umum', 'Vaksinasi Kucing (Tricat)', 'Rawat Inap (Per Hari)', 
          'Grooming Kutu & Jamur', 'Operasi Steril Kucing Jantan', 'Titip Sehat (Pet Hotel)',
          'USG Hewan', 'Pembersihan Karang Gigi', 'Cek Darah Lengkap', 'Vaksin Rabies'
        ];
        
        const serviceCategories = [
          'Medis', 'Vaksin', 'Fasilitas', 'Grooming', 'Bedah', 'Fasilitas', 'Medis', 'Medis', 'Laboratorium', 'Vaksin'
        ];

        const mappedServices = data.products.map((item, index) => ({
          id: item.id,
          name: serviceNames[index] || item.title,
          category: serviceCategories[index] || 'Lainnya',
          price: `Rp ${(item.price * 15000).toLocaleString('id-ID')}`,
          status: index % 4 === 0 ? 'Penuh' : 'Tersedia'
        }));

        setServices(mappedServices);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === '' || service.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Hapus layanan ${name} dari daftar tarif?`)) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Daftar Layanan & Tarif</h1>
          <p className="text-sm text-slate-500">Kelola rincian layanan dan harga klinik hewan Zeta Connect.</p>
        </div>
        
        <Link 
          to="/admin/services/add"
          className="flex items-center justify-center gap-2 rounded bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-all shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Tambah Layanan Baru
        </Link>
      </div>

      <div className="rounded-sm border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama layanan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded border border-slate-300 bg-transparent py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <Filter className="h-4 w-4" />
              <span>Kategori:</span>
            </div>
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="rounded border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-600"
            >
              <option value="">Semua Kategori</option>
              <option value="Medis">Medis</option>
              <option value="Vaksin">Vaksin</option>
              <option value="Grooming">Grooming</option>
              <option value="Fasilitas">Fasilitas</option>
              <option value="Bedah">Bedah</option>
              <option value="Laboratorium">Laboratorium</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-2" />
              <p className="text-sm font-medium">Memuat data tarif layanan...</p>
            </div>
          ) : (
            <table className="w-full table-auto text-left">
              <thead>
                <tr className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Nama Layanan</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Harga / Tarif</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <tr key={service.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 text-slate-500">
                            <Tag className="h-4 w-4" />
                          </div>
                          <span className="font-bold text-slate-800">{service.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {service.category}
                      </td>
                      <td className="px-6 py-4 font-bold text-blue-600">
                        {service.price}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          service.status === 'Tersedia' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {service.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link 
                            to={`/admin/services/edit/${service.id}`}
                            className="p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-sm"
                          >
                            <Edit className="h-5 w-5" />
                          </Link>
                          <button 
                            onClick={() => handleDelete(service.id, service.name)}
                            className="p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors rounded-sm"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-10 text-center text-slate-500">
                      Layanan tidak ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        
        <div className="border-t border-slate-100 p-4 text-right text-xs text-slate-500 font-medium">
          Total: {filteredServices.length} layanan terdaftar.
        </div>
      </div>
    </div>
  );
};

export default ServiceRatesList;