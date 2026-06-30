import React, { useState, useEffect } from 'react';
import {
  User, Mail, Phone, MapPin, Save, Lock, Camera, Edit,
  AlertCircle, Loader2, Shield, CheckCircle, PawPrint
} from 'lucide-react';
import { getOwnerProfile, updateOwnerProfile } from '../../services/ownerService';


const SPECIES_EMOJI = { Anjing: '🐶', Kucing: '🐱' };

const OwnerProfile = () => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch data user saat komponen mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getOwnerProfile();
        // Response: data directly since /user returns the object directly
        setUserData(data);
        setFormData(prev => ({
          ...prev,
          fullName: data.name || '',
          email: data.email || '',
          phone: data.phone_number || '',
          address: data.address || '',
        }));
      } catch (err) {
        setError('Gagal memuat data profil. Pastikan server berjalan dan coba lagi.');
        console.error('Fetch user error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset ke data asli dari server
    setFormData(prev => ({
      ...prev,
      fullName: userData?.name || '',
      phone: userData?.phone_number || '',
      address: userData?.address || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }));
    setPhotoFile(null);
    setPhotoPreview(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('Password baru dan konfirmasi password tidak cocok.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMsg('');

    try {
      let payload;
      
      if (photoFile) {
        payload = new FormData();
        payload.append('name', formData.fullName);
        payload.append('phone_number', formData.phone);
        payload.append('address', formData.address);
        payload.append('photo', photoFile);

        if (formData.newPassword && formData.currentPassword) {
          payload.append('current_password', formData.currentPassword);
          payload.append('new_password', formData.newPassword);
        }
      } else {
        payload = {
          name: formData.fullName,
          phone_number: formData.phone,
          address: formData.address,
        };

        if (formData.newPassword && formData.currentPassword) {
          payload.current_password = formData.currentPassword;
          payload.new_password = formData.newPassword;
        }
      }

      const res = await updateOwnerProfile(payload);

      // Update local userData
      setUserData(prev => {
        const updatedUser = {
          ...prev,
          name: formData.fullName,
          phone_number: formData.phone,
          address: formData.address,
          photo: res?.data?.photo || prev?.photo,
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('userUpdated'));
        return updatedUser;
      });

      setSuccessMsg('Profil berhasil diperbarui!');
      setIsEditing(false);
      setPhotoFile(null);
      setPhotoPreview(null);
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (err) {
      const msg = err?.response?.data?.message || 'Gagal menyimpan perubahan. Coba lagi.';
      setError(msg);
      console.error('Update user error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAvatarUrl = () => {
    if (photoPreview) return photoPreview;
    if (userData?.photo) {
      if (userData.photo.startsWith('http')) {
        return userData.photo;
      }
      const baseUrl = import.meta.env.VITE_API_BASE_URL.replace('/api', '');
      return `${baseUrl}/${userData.photo}`;
    }
    return formData.fullName
      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName)}&background=3b82f6&color=fff&bold=true&size=128`
      : `https://ui-avatars.com/api/?name=Owner&background=3b82f6&color=fff&bold=true&size=128`;
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      setIsEditing(true); // Otomatis aktifkan mode edit jika ubah foto
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Profil Saya</h1>
          <p className="mt-1 text-sm text-slate-500">Kelola informasi identitas diri dan keamanan akun Anda.</p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-sm border border-slate-200 bg-white p-20 shadow-sm gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-slate-500">Memuat data profil...</p>
        </div>
      </div>
    );
  }

  const pets = userData?.pets || [];

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Profil Saya</h1>
        <p className="mt-1 text-sm text-slate-500">
          Kelola informasi identitas diri dan keamanan akun Anda.
        </p>
      </div>

      {/* Alert error */}
      {error && (
        <div className="flex items-center gap-3 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700 font-bold">&times;</button>
        </div>
      )}

      {/* Alert success */}
      {successMsg && (
        <div className="flex items-center gap-3 rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="ml-auto text-green-500 hover:text-green-700 font-bold">&times;</button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* ====== Kolom Kiri: Avatar + Info Singkat ====== */}
        <div className="col-span-1 md:col-span-4 space-y-4">
          {/* Card Avatar */}
          <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-blue-50 shadow">
                <img
                  src={getAvatarUrl()}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <label
                htmlFor="photo-upload"
                className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow hover:bg-blue-700 transition-colors"
                title="Ubah Foto"
              >
                <Camera className="h-3.5 w-3.5" />
                <input 
                  id="photo-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handlePhotoChange} 
                />
              </label>
            </div>

            <h3 className="text-base font-bold text-slate-800">{formData.fullName || '—'}</h3>
            <p className="text-sm text-slate-500 mt-0.5">{formData.email || '—'}</p>

            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {/* Badge Role */}
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                <Shield className="h-3 w-3" />
                {userData?.role || 'Owner'}
              </span>
              {/* Badge Status */}
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                userData?.status === 'Aktif'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${userData?.status === 'Aktif' ? 'bg-green-500' : 'bg-red-500'}`} />
                {userData?.status || '—'}
              </span>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Member sejak {userData?.created_at ? new Date(userData.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' }) : '—'}
            </p>
          </div>

          {/* Card Hewan Peliharaan */}
          {pets.length > 0 && (
            <div className="rounded-sm border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4 flex items-center gap-2">
                <PawPrint className="h-4 w-4 text-blue-600" />
                <h4 className="text-sm font-bold text-slate-800">Hewan Peliharaan</h4>
                <span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-600">
                  {pets.length}
                </span>
              </div>
              <ul className="divide-y divide-slate-100">
                {pets.map(pet => (
                  <li key={pet.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg">
                      {SPECIES_EMOJI[pet.species] || '🐾'}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">{pet.name}</p>
                      <p className="truncate text-xs text-slate-500">{pet.breed} · {pet.gender}</p>
                    </div>
                    <span className="ml-auto flex-shrink-0 rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                      {pet.species}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ====== Kolom Kanan: Form ====== */}
        <div className="col-span-1 md:col-span-8">
          <div className="rounded-sm border border-slate-200 bg-white shadow-sm">
            <form onSubmit={handleSubmit}>
              {/* Header form */}
              <div className="border-b border-slate-100 p-6 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  Informasi Pribadi
                </h3>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 rounded bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    Edit Profil
                  </button>
                )}
              </div>

              {/* Field-field profil */}
              <div className="p-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* Nama Lengkap */}
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Nama Lengkap</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <User className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`w-full rounded border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600 ${
                          !isEditing ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : 'bg-transparent text-slate-800'
                        }`}
                        disabled={!isEditing}
                        required
                      />
                    </div>
                  </div>

                  {/* Email — selalu disabled */}
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Alamat Email</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <Mail className="h-4 w-4" />
                      </span>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        className="w-full rounded border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-500 outline-none cursor-not-allowed"
                        disabled
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-400">Email tidak dapat diubah</p>
                  </div>

                  {/* Nomor Telepon */}
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Nomor Telepon (WhatsApp)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <Phone className="h-4 w-4" />
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full rounded border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600 ${
                          !isEditing ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : 'bg-transparent text-slate-800'
                        }`}
                        disabled={!isEditing}
                        required
                      />
                    </div>
                  </div>

                  {/* Alamat */}
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Alamat Lengkap</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-slate-400">
                        <MapPin className="h-4 w-4" />
                      </span>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        className={`w-full rounded border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600 ${
                          !isEditing ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : 'bg-transparent text-slate-800'
                        }`}
                        disabled={!isEditing}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section password — hanya muncul saat editing */}
              {isEditing && (
                <>
                  <div className="p-6 border-t border-slate-100">
                    <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Lock className="h-4 w-4 text-blue-600" />
                      Ubah Password
                      <span className="ml-1 text-xs font-normal text-slate-400">(opsional)</span>
                    </h3>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Password Saat Ini</label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          placeholder="Kosongkan jika tidak ingin mengubah password"
                          className="w-full rounded border border-slate-300 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Password Baru</label>
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
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Konfirmasi Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Ulangi password baru"
                          className="w-full rounded border border-slate-300 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 rounded-b-sm">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="rounded px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 rounded bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerProfile;