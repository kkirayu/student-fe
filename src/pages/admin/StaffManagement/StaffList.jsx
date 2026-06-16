import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getUsers, deleteUser } from '../../../services/adminService';

const StaffList = () => {
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');

  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      try {
        const response = await getUsers();
        let data = [];
        if (Array.isArray(response)) {
          data = response;
        } else if (response && Array.isArray(response.data)) {
          data = response.data;
        } else if (response?.data?.data && Array.isArray(response.data.data)) {
          data = response.data.data;
        }

        // Filter out owners to only show staff
        const staffOnly = data.filter(user => user.role !== 'Owner');

        const mappedStaff = staffOnly.map((user) => ({
          id: user.id,
          name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Tanpa Nama',
          email: user.email || '-',
          phone_number: user.phone_number || user.phone || '-',
          role: user.role || 'Staff',
          status: user.status || 'Aktif'
        }));

        setStaffData(mappedStaff);
      } catch (err) {
        console.error('Failed to fetch staff:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const filteredStaff = staffData.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          staff.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === '' || staff.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleDelete = async (id, name) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus staf bernama ${name}?`)) {
      try {
        await deleteUser(id);
        const updatedData = staffData.filter(staff => staff.id !== id);
        setStaffData(updatedData);
        alert('Data staf berhasil dihapus.');
      } catch (error) {
        console.error('Failed to delete staff:', error);
        alert('Gagal menghapus data staf. Pastikan server berjalan dan ID valid.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Staf</h1>
          <p className="text-sm text-slate-500">Kelola hak akses dan data pegawai klinik Zeta Connect.</p>
        </div>
        
        <Link 
          to="/admin/staff/add" 
          className="inline-flex items-center justify-center gap-2 rounded bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90 transition-all shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Tambah Staf Baru
        </Link>
      </div>

      <div className="rounded-sm border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="h-5 w-5" />
            </span>
            <input
              type="text"
              placeholder="Cari nama atau email staf..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded border border-slate-300 bg-transparent py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>
          
          <select 
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="w-full rounded border border-slate-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-blue-600 sm:w-auto"
          >
            <option value="">Semua Role</option>
            <option value="Admin">Admin</option>
            <option value="Dokter">Dokter</option>
            <option value="Resepsionis">Resepsionis</option>
            <option value="Apoteker">Apoteker</option>
            <option value="Kasir">Kasir</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-2" />
              <p className="text-sm font-medium">Memuat data staf dari API...</p>
            </div>
          ) : (
            <table className="w-full table-auto text-left">
              <thead>
                <tr className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 border-b border-slate-200">
                  <th className="px-6 py-4">Nama Pegawai</th>
                  <th className="px-6 py-4">Role / Hak Akses</th>
                  <th className="px-6 py-4">Kontak</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredStaff.length > 0 ? (
                  filteredStaff.map((staff) => (
                    <tr key={staff.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-black">{staff.name}</div>
                        <div className="text-xs text-slate-500">{staff.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-700">{staff.role}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {staff.phone_number}
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
                          <Link 
                            to={`/admin/staff/edit/${staff.id}`} 
                            className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition-colors" 
                            title="Edit Data"
                          >
                            <Edit className="h-5 w-5" />
                          </Link>
                          <button 
                            onClick={() => handleDelete(staff.id, staff.name)}
                            className="p-1.5 rounded-md text-red-500 hover:bg-red-50 transition-colors" 
                            title="Hapus Akun"
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
                      Tidak ada data staf yang sesuai dengan pencarian.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        
        <div className="border-t border-slate-100 p-4 text-right text-xs text-slate-500 font-medium">
          Menampilkan {filteredStaff.length} data staf.
        </div>
      </div>
    </div>
  );
};

export default StaffList;