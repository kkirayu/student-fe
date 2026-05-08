import React from 'react';
import { Save, Database, Image as ImageIcon, Building, Phone, MapPin } from 'lucide-react';

const ClinicSettings = () => {
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
            <form className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-black">Nama Klinik</label>
                <input
                  type="text"
                  defaultValue="Klinik Hewan Zeta Connect"
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
                    defaultValue="0812-3456-7890"
                    className="w-full rounded border border-slate-300 bg-transparent px-4 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-black">Email Klinik</label>
                  <input
                    type="email"
                    defaultValue="hello@zetaconnect.com"
                    className="w-full rounded border border-slate-300 bg-transparent px-4 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Alamat Lengkap
                </label>
                <textarea
                  rows="3"
                  defaultValue="Jl. Adi Sucipto, Yogyakarta, Indonesia"
                  className="w-full rounded border border-slate-300 bg-transparent px-4 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                ></textarea>
                <p className="mt-1 text-xs text-slate-500">Alamat ini akan dicetak di bagian atas kop surat/nota tagihan.</p>
              </div>

              <button
                type="button"
                className="mt-4 flex items-center gap-2 rounded bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-all"
              >
                <Save className="h-4 w-4" />
                Simpan Perubahan
              </button>
            </form>
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
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
                   <ImageIcon className="h-10 w-10 text-blue-600" />
                </div>
              </div>
              <div className="relative cursor-pointer rounded border-2 border-dashed border-slate-300 bg-slate-50 py-4 text-center hover:bg-slate-100 transition-all">
                <input type="file" className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none" />
                <span className="text-sm font-medium text-blue-600">Klik untuk upload</span>
                <span className="block text-xs text-slate-500 mt-1">SVG, PNG, JPG (Maks. 2MB)</span>
              </div>
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