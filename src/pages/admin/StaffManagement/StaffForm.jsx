import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { showSuccess, showError } from '../../../utils/alertUtils';
import api from '../../../services/api';

const StaffForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '', 
    email: '', 
    phone_number: '',
    role: '', 
    password: '', 
    status: 'Aktif',
    address: '', 
  });

  useEffect(() => {
  if (isEditMode) {
    console.log("Mencoba mengambil data untuk ID:", id); 

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/users/${id}`);
        const result = response.data;
        
        console.log("Hasil dari API:", result); // Cek isi data dari API

        if (result.success) {
          setFormData({ 
            name: result.data.name || '',
            email: result.data.email || '',
            phone_number: result.data.phone_number || '',
            role: result.data.role || '',
            status: result.data.status || 'Aktif',
            address: result.data.address || '',
            password: '' 
          });
        }
      } catch (error) {
        console.error("Error Fetch:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }
}, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = { ...formData };
      if (isEditMode && !payload.password) {
        delete payload.password;
      }

      const response = isEditMode 
        ? await api.put(`/users/${id}`, payload)
        : await api.post('/users', payload);

      const result = response.data;

      if (result.success) {
        await showSuccess('Berhasil!', isEditMode ? 'Data berhasil diperbarui!' : 'Staf berhasil ditambahkan!');
        navigate('/admin/staff');
      } else {
        showError('Gagal', Object.values(result).flat().join('\n'));
      }
    } catch (error) {
      showError('Kesalahan', 'Terjadi kesalahan koneksi ke server.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex h-60 items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/admin/staff" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isEditMode ? 'Edit Data Staf' : 'Tambah Staf Baru'}
          </h1>
          <p className="text-sm text-slate-500">
            {isEditMode ? 'Perbarui informasi pegawai klinik.' : 'Daftarkan akun pegawai baru beserta hak aksesnya.'}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              
              {/* Nama */}
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-800">Nama Lengkap *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-600 outline-none" required />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-800">Alamat Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-600 outline-none" required />
              </div>

              {/* Nomor HP */}
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-800">Nomor WhatsApp/HP *</label>
                <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-600 outline-none" required />
              </div>

              {/* Role */}
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-800">Hak Akses (Role) *</label>
                <select name="role" value={formData.role} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-600 outline-none" required>
                  <option value="">Pilih Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Dokter">Dokter</option>
                  <option value="Resepsionis">Resepsionis</option>
                  <option value="Apoteker">Apoteker</option>
                  <option value="Kasir">Kasir</option>
                  <option value="Owner">Owner (Pemilik Hewan)</option>
                </select>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-800">Kata Sandi {isEditMode && <span className="text-xs font-normal text-slate-400">(Opsional)</span>}</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-600 outline-none" required={!isEditMode} placeholder={isEditMode ? "Kosongkan jika tidak diubah" : "Masukkan kata sandi"} />
              </div>

              {/* Status */}
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-800">Status Akun *</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-600 outline-none">
                  <option value="Aktif">Aktif</option>
                  <option value="Tidak Aktif">Tidak Aktif</option>
                </select>
              </div>
            </div>

            {/* Alamat - TAMBAHAN WAJIB */}
            <div>
              <label className="mb-2.5 block text-sm font-semibold text-slate-800">Alamat Tempat Tinggal *</label>
              <textarea name="address" value={formData.address} onChange={handleChange} rows="3" className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-600 outline-none" required placeholder="Masukkan alamat lengkap pegawai"></textarea>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:px-8">
            <button type="button" onClick={() => navigate('/admin/staff')} className="rounded-md px-6 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-200">Batal</button>
            <button type="submit" disabled={submitting} className="flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:bg-blue-400">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isEditMode ? 'Simpan Perubahan' : 'Daftarkan Staf'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffForm;