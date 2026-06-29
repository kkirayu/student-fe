import React, { useState, useEffect } from 'react';
import { Save, Database, Image as ImageIcon, Building, Phone, MapPin, Clock, Loader2 } from 'lucide-react';
import { getClinicSettings, updateClinicSettings } from '../../services/adminService';
import { showSuccess, showError } from '../../utils/alertUtils';

const ClinicSettings = () => {
  const [formData, setFormData] = useState({
    clinic_name: '',
    phone_number: '',
    email: '',
    address: '',
    operational_hours: '',
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const response = await getClinicSettings();
        const data = response?.data || {};
        
        setFormData({
          clinic_name: data.clinic_name || '',
          phone_number: data.phone_number || '',
          email: data.email || '',
          address: data.address || '',
          operational_hours: data.operational_hours || '',
        });
        
        if (data.logo_url) {
          // Assuming backend returns relative path like /storage/logos/xxx or absolute URL
          const baseUrl = import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace('/api', '') : 'https://zeta-connect-api.vercel.app';
          const fullLogoUrl = data.logo_url.startsWith('http') ? data.logo_url : `${baseUrl}${data.logo_url}`;
          setLogoPreview(fullLogoUrl);
        }
      } catch (error) {
        if (error.response && error.response.status !== 404) {
          console.error('Failed to fetch settings:', error);
          showError('Gagal memuat pengaturan klinik');
        }
        // If 404, it means settings are not set yet, which is fine
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showError('Ukuran gambar maksimal 2MB');
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const data = new FormData();
      data.append('clinic_name', formData.clinic_name);
      data.append('phone_number', formData.phone_number);
      data.append('email', formData.email);
      data.append('address', formData.address);
      data.append('operational_hours', formData.operational_hours);
      
      if (logoFile) {
        data.append('logo', logoFile);
      }

      await updateClinicSettings(data);
      showSuccess('Pengaturan berhasil disimpan');
    } catch (error) {
      console.error('Failed to update settings:', error);
      showError(error.response?.data?.message || 'Gagal menyimpan pengaturan');
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Pengaturan Sistem</h1>
        <p className="text-sm text-slate-500">Perbarui profil klinik yang akan muncul di struk dan nota pasien.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Kolom Kiri: Form Profil Klinik */}
        <div className="rounded-sm border border-slate-200 bg-white shadow-sm lg:col-span-2">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="font-bold text-black flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              Profil Klinik (Zeta Connect)
            </h3>
          </div>
          
          <div className="p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-2" />
                <p className="text-sm font-medium">Memuat pengaturan...</p>
              </div>
            ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-black">Nama Klinik</label>
                <input
                  type="text"
                  name="clinic_name"
                  value={formData.clinic_name}
                  onChange={handleChange}
                  placeholder="Klinik Hewan Zeta Connect"
                  required
                  className="w-full rounded border border-slate-300 bg-transparent px-4 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-black flex items-center gap-2">
                    <Phone className="h-4 w-4" /> Nomor Telepon / WA
                  </label>
                  <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="0812-3456-7890"
                    required
                    className="w-full rounded border border-slate-300 bg-transparent px-4 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-black">Email Klinik</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="hello@zetaconnect.com"
                    required
                    className="w-full rounded border border-slate-300 bg-transparent px-4 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Jam Operasional
                </label>
                <input
                  type="text"
                  name="operational_hours"
                  value={formData.operational_hours}
                  onChange={handleChange}
                  placeholder="Senin - Minggu (08:00 - 22:00)"
                  required
                  className="w-full rounded border border-slate-300 bg-transparent px-4 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Alamat Lengkap
                </label>
                <textarea
                  rows="3"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Jl. Adi Sucipto, Yogyakarta, Indonesia"
                  required
                  className="w-full rounded border border-slate-300 bg-transparent px-4 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                ></textarea>
                <p className="mt-1 text-xs text-slate-500">Alamat ini akan dicetak di bagian atas kop surat/nota tagihan.</p>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="mt-4 flex items-center gap-2 rounded bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-all disabled:bg-blue-400"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </form>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Logo & Backup Database */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Ubah Logo */}
          <div className="rounded-sm border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-4">
              <h3 className="font-bold text-black">Logo Klinik</h3>
            </div>
            <div className="p-6">
              <div className="mb-4 flex justify-center">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo Preview" className="h-24 w-24 rounded-full object-cover border-2 border-slate-200" />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
                    <ImageIcon className="h-10 w-10 text-blue-600" />
                  </div>
                )}
              </div>
              <div className="relative cursor-pointer rounded border-2 border-dashed border-slate-300 bg-slate-50 py-4 text-center hover:bg-slate-100 transition-all">
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/jpg" 
                  onChange={handleLogoChange}
                  className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none" 
                />
                <span className="text-sm font-medium text-blue-600">Klik untuk upload logo baru</span>
                <span className="block text-xs text-slate-500 mt-1">PNG, JPG (Maks. 2MB)</span>
              </div>
              <p className="text-xs text-center text-slate-500 mt-3">Logo akan tersimpan saat Anda menekan tombol <b>Simpan Perubahan</b> di formulir.</p>
            </div>
          </div>

          {/* Backup Database */}
          <div className="rounded-sm border border-red-200 bg-red-50 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                <Database className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-red-900">Backup Database</h3>
            </div>
            <p className="text-sm text-red-700 mb-5">
              Unduh salinan seluruh data klinik (pasien, rekam medis, transaksi) dalam format `.sql` untuk keamanan data.
            </p>
            <button className="w-full flex items-center justify-center gap-2 rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-all">
              Mulai Backup
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ClinicSettings;