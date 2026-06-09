import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Save, Lock, Camera } from 'lucide-react';

const OwnerProfile = () => {
  const [formData, setFormData] = useState({
    fullName: 'Cita Nurcahyani',
    email: 'cita.nurcahyani@example.com',
    phone: '081234567890',
    address: 'Yogyakarta',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Profil berhasil diperbarui!');
    }, 1000);
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Pengaturan Akun</h1>
        <p className="mt-1 text-sm text-slate-500">
          Kelola informasi identitas diri dan keamanan akun Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="col-span-1 md:col-span-4">
          <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm flex flex-col items-center">
            <div className="relative mb-4">
              <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-slate-50">
                <img 
                  src="https://ui-avatars.com/api/?name=Cita+Nurcahyani&background=3b82f6&color=fff&bold=true&size=128" 
                  alt="Profile" 
                  className="h-full w-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border border-white bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <h3 className="text-lg font-bold text-slate-800">{formData.fullName}</h3>
            <p className="text-sm text-slate-500">Pet Owner</p>
          </div>
        </div>

        <div className="col-span-1 md:col-span-8">
          <div className="rounded-sm border border-slate-200 bg-white shadow-sm">
            <form onSubmit={handleSubmit}>
              <div className="border-b border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Informasi Pribadi
                </h3>
                
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-800">Nama Lengkap</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <User className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full rounded border border-slate-300 bg-transparent py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">Alamat Email</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <Mail className="h-4 w-4" />
                      </span>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full rounded border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-500 outline-none cursor-not-allowed"
                        disabled
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">Nomor Telepon (WhatsApp)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <Phone className="h-4 w-4" />
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full rounded border border-slate-300 bg-transparent py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        required
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-800">Alamat Lengkap</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-slate-400">
                        <MapPin className="h-4 w-4" />
                      </span>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        className="w-full rounded border border-slate-300 bg-transparent py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-blue-600" />
                  Keamanan Akun
                </h3>
                
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-800">Password Saat Ini</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="Masukkan jika ingin mengubah password"
                      className="w-full rounded border border-slate-300 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">Password Baru</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Password baru"
                      className="w-full rounded border border-slate-300 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">Konfirmasi Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Ketik ulang password baru"
                      className="w-full rounded border border-slate-300 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 disabled:opacity-70"
                >
                  <Save className="h-4 w-4" />
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerProfile;