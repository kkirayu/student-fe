import React, { useState } from 'react';
// Tambahkan Eye ke dalam import lucide-react
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const PetList = () => {
  const [petsData] = useState([
    { id: 1, name: 'Oren', species: 'Kucing', breed: 'Persia', gender: 'Betina', dob: '2022-01-01', color: 'Oranye', status: 'Aktif' },
    { id: 2, name: 'Troton', species: 'Kucing', breed: 'Chartreux', gender: 'Jantan', dob: '2020-03-01', color: 'Abu-abu', status: 'Aktif' },
    { id: 3, name: 'Bebek', species: 'Kucing', breed: 'Himalaya', gender: 'Betina', dob: '2022-01-01', color: 'Putih', status: 'Non-Aktif' },
    { id: 4, name: 'Mei-mei', species: 'Anjing', breed: 'Bichon Frise', gender: 'Betina', dob: '2022-01-01', color: 'Putih', status: 'Aktif' },
    { id: 5, name: 'Arifin', species: 'Anjing', breed: 'Cihuahua', gender: 'Jantan', dob: '2022-01-01', color: 'Hitam', status: 'Aktif' },
  ]);

  return (
    <div className="space-y-6">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Pets</h1>
          <p className="text-sm text-slate-500">Kelola Data Pets Anda</p>
        </div>

        <Link
          to="/owner/pets/add"
          className="inline-flex items-center justify-center gap-2 rounded bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90 transition-all shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Tambah Pets Baru
        </Link>
      </div>

      {/* Area Tabel Utama */}
      <div className="rounded-sm border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Toolbar Tabel */}
        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between bg-white">
          <div className="relative w-full max-w-md">
            <button className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="h-5 w-5" />
            </button>
            <input
              type="text"
              placeholder="Cari nama pet atau jenis..."
              className="w-full rounded border border-slate-300 bg-transparent py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <select className="w-full rounded border border-slate-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-blue-600 sm:w-auto">
            <option value="">Semua Spesies</option>
            <option value="Kucing">Kucing</option>
            <option value="Anjing">Anjing</option>
          </select>
        </div>

        {/* Tabel Data */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 border-b border-slate-100">
                <th className="px-6 py-4">Nama Pet</th>
                <th className="px-6 py-4">Species</th>
                <th className="px-6 py-4">Gender & Dob</th>
                <th className="px-6 py-4 text-center">Color</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {petsData.map((pet) => (
                <tr key={pet.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{pet.name}</div>
                    <div className={`text-[10px] font-bold uppercase ${pet.status === 'Aktif' ? 'text-emerald-500' : 'text-slate-400'}`}>
                      {pet.status}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-700">{pet.breed}</span>
                    <div className="text-xs text-slate-400">{pet.species}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="flex items-center gap-1">
                      <span>{pet.gender}</span>
                      <span className="text-slate-300">|</span>
                      <span>{pet.dob}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-slate-600">
                    {pet.color}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Tombol Lihat Detail */}
                      <Link 
                        to={`/admin/PetDetail`} 
                        className="p-1.5 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors" 
                        title="Lihat Detail"
                      >
                        <Eye className="h-5 w-5" />
                      </Link>

                      {/* Tombol Edit */}
                      <Link 
                        to={`/owner/pets/edit/${pet.id}`} 
                        className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition-colors" 
                        title="Edit Data"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>

                      {/* Tombol Hapus */}
                      <button 
                        className="p-1.5 rounded-md text-red-500 hover:bg-red-50 transition-colors" 
                        title="Hapus Data"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 p-4 text-right text-xs font-medium text-slate-400">
          Total: {petsData.length} data pet terdaftar.
        </div>
      </div>
    </div>
  );
};

export default PetList;