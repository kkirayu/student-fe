import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Tag, Filter } from 'lucide-react';

const ServiceRatesList = () => {
  // Data layanan sesuai dengan perencanaan (Fitur 4)
  const [services] = useState([
    { id: 1, name: 'Konsultasi Dokter Umum', category: 'Medis', price: 'Rp 75.000', status: 'Tersedia' },
    { id: 2, name: 'Vaksinasi Kucing (Tricat)', category: 'Vaksin', price: 'Rp 200.000', status: 'Tersedia' },
    { id: 3, name: 'Rawat Inap (Per Hari)', category: 'Fasilitas', price: 'Rp 150.000', status: 'Tersedia' },
    { id: 4, name: 'Grooming Kutu & Jamur', category: 'Grooming', price: 'Rp 120.000', status: 'Tersedia' },
    { id: 5, name: 'Operasi Steril Kucing Jantan', category: 'Bedah', price: 'Rp 450.000', status: 'Tersedia' },
    { id: 6, name: 'Titip Sehat (Pet Hotel)', category: 'Fasilitas', price: 'Rp 50.000', status: 'Penuh' },
  ]);

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Daftar Layanan & Tarif</h1>
          <p className="text-sm text-slate-500">Kelola rincian layanan dan harga klinik hewan Zeta Connect.</p>
        </div>
        
        <button className="flex items-center justify-center gap-2 rounded bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-all shadow-sm">
          <Plus className="h-4 w-4" />
          Tambah Layanan Baru
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-sm border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama layanan..."
              className="w-full rounded border border-slate-300 bg-transparent py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <Filter className="h-4 w-4" />
              <span>Kategori:</span>
            </div>
            <select className="rounded border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-600">
              <option value="">Semua</option>
              <option value="Medis">Medis</option>
              <option value="Vaksin">Vaksin</option>
              <option value="Grooming">Grooming</option>
              <option value="Fasilitas">Fasilitas</option>
            </select>
          </div>
        </div>

        {/* Tabel Layanan */}
        <div className="overflow-x-auto">
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
              {services.map((service) => (
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
                      <button className="text-slate-400 hover:text-blue-600 transition-colors">
                        <Edit className="h-5 w-5" />
                      </button>
                      <button className="text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ServiceRatesList;