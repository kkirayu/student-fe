import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

const EReceiptForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', role: '', password: '', status: 'Aktif',
  });

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        name: 'Drh. Bunga', email: 'bunga@zetaconnect.com', phone: '081298765432', role: 'Dokter', password: '', status: 'Aktif',
      });
    }
  }, [isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Data disimpan:', formData);
    navigate('/admin/staff');
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          to="/admin/staff" 
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isEditMode ? 'Edit Data Staf' : 'Tambah Staf Baru'}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {isEditMode ? 'Perbarui informasi pegawai klinik.' : 'Daftarkan akun pegawai baru beserta hak aksesnya.'}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <form onSubmit={handleSubmit}>
          
          {/* Area Input Utama */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              
              {/* Nama Lengkap */}
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-800">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" name="name" value={formData.name} onChange={handleChange}
                  placeholder="Masukkan nama lengkap"
                  className="w-full rounded-md border border-slate-300 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-800">
                  Alamat Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email" name="email" value={formData.email} onChange={handleChange}
                  placeholder="email@zetaconnect.com"
                  className="w-full rounded-md border border-slate-300 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  required
                />
              </div>

              {/* Nomor HP */}
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-800">
                  Nomor WhatsApp/HP <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" name="phone" value={formData.phone} onChange={handleChange}
                  placeholder="08xxxxxxxxxx"
                  className="w-full rounded-md border border-slate-300 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  required
                />
              </div>

              {/* Role / Hak Akses */}
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-800">
                  Hak Akses (Role) <span className="text-red-500">*</span>
                </label>
                <select
                  name="role" value={formData.role} onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  required
                >
                  <option value="" disabled>Pilih Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Dokter">Dokter</option>
                  <option value="Resepsionis">Resepsionis</option>
                  <option value="Apoteker">Apoteker / Kasir</option>
                </select>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-800">
                  Kata Sandi 
                  {isEditMode ? (
                    <span className="ml-1 text-xs font-normal text-slate-400">(Opsional)</span>
                  ) : (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <input
                  type="password" name="password" value={formData.password} onChange={handleChange}
                  placeholder={isEditMode ? "Kosongkan jika tidak diubah" : "Masukkan kata sandi"}
                  className="w-full rounded-md border border-slate-300 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  required={!isEditMode}
                />
              </div>

              {/* Status Aktif */}
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-800">
                  Status Akun <span className="text-red-500">*</span>
                </label>
                <select
                  name="status" value={formData.status} onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Tidak Aktif">Tidak Aktif</option>
                </select>
              </div>

            </div>
          </div>

          {/* Area Footer / Tombol Aksi */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:px-8">
            <button
              type="button"
              onClick={() => navigate('/admin/staff')}
              className="rounded-md px-6 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-200 hover:text-slate-900"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              Simpan Data
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default EReceiptForm;