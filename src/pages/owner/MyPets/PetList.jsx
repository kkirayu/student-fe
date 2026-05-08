import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const PetList = () => {
  // Dummy data menggunakan nama anggota kelompok sebagai contoh
  const [staffData] = useState([
    { id: 1, name: 'Uyok', role: 'Admin', email: 'danil@vetcare.com', phone: '081234567890', status: 'Aktif' },
    { id: 2, name: 'Drh. Bunga', role: 'Dokter', email: 'bunga@vetcare.com', phone: '081298765432', status: 'Aktif' },
    { id: 3, name: 'Damar', role: 'Resepsionis', email: 'damar@vetcare.com', phone: '081255554444', status: 'Aktif' },
    { id: 4, name: 'Naufal', role: 'Apoteker', email: 'naufal@vetcare.com', phone: '081277778888', status: 'Aktif' },
    { id: 5, name: 'Joko Santoso', role: 'Kasir', email: 'joko@vetcare.com', phone: '081200001111', status: 'Tidak Aktif' },
  ]);

  return (
    <div className="space-y-6">
      {/* 1. Header & Breadcrumb */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Pets</h1>
          <p className="text-sm text-slate-500">Kelola hak akses dan data pegawai klinik VetCare Connect.</p>
        </div>
        
        {/* Tombol Tambah Staf (Mengarah ke Fitur 3) */}
        <Link 
          to="/admin/staff/add" 
          className="inline-flex items-center justify-center gap-2 rounded bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90 transition-all"
        >
          <Plus className="h-4 w-4" />
          Tambah Staf Baru
        </Link>
      </div>

      {/* 2. Area Tabel Utama */}
      <div className="rounded-sm border border-slate-200 bg-white shadow-sm">
        
        {/* Toolbar Tabel (Search & Filter) */}
        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md">
            <button className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600">
              <Search className="h-5 w-5" />
            </button>
            <input
              type="text"
              placeholder="Cari nama atau email staf..."
              className="w-full rounded border border-slate-300 bg-transparent py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>
          
          <select className="w-full rounded border border-slate-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-blue-600 sm:w-auto">
            <option value="">Semua Role</option>
            <option value="Dokter">Dokter</option>
            <option value="Resepsionis">Resepsionis</option>
            <option value="Apoteker">Apoteker</option>
            <option value="Kasir">Kasir</option>
          </select>
        </div>

        {/* Tabel Data Staf */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-6 py-4">Nama Pegawai</th>
                <th className="px-6 py-4">Role / Hak Akses</th>
                <th className="px-6 py-4">Kontak</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {staffData.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-black">{staff.name}</div>
                    <div className="text-xs text-slate-500">{staff.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-700">{staff.role}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {staff.phone}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      staff.status === 'Aktif' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {staff.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {/* Tombol Edit (Mengarah ke Fitur 3) */}
                      <Link to={`/admin/staff/edit/${staff.id}`} className="text-blue-600 hover:text-blue-800 transition-colors" title="Edit Data">
                        <Edit className="h-5 w-5" />
                      </Link>
                      {/* Tombol Hapus */}
                      <button className="text-red-500 hover:text-red-700 transition-colors" title="Hapus Akun">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination (Opsional) */}
        <div className="border-t border-slate-100 p-4 text-right text-xs text-slate-500">
          Menampilkan {staffData.length} data staf.
        </div>
      </div>
    </div>
  );
};

export default PetList;