import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  PawPrint, 
  Stethoscope, 
  Save, 
  Calendar,
  Info,
  ChevronRight
} from 'lucide-react';

const WalkInRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    petName: '',
    species: '',
    breed: '',
    gender: 'Jantan',
    weight: '',
    birthDate: '',
    ownerName: '',
    ownerPhone: '',
    ownerAddress: '',
    doctor: '',
    complaint: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    // Logic simpan data di sini
    alert('Pendaftaran Berhasil!');
    navigate('/receptionist');
  };

  return (
    <div className="space-y-6 pb-10">
      {/* 1. Header & Back Action */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/receptionist')}
          className="flex h-10 w-10 items-center justify-center rounded-sm border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pendaftaran Walk-In</h1>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <span>Dashboard</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-blue-600">Pendaftaran Pasien Baru</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* LEFT COLUMN: Patient & Owner Info */}
        <div className="space-y-6 lg:col-span-8">
          
          {/* Section: Data Hewan (Pet) */}
          <div className="rounded-sm border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-200 px-6 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <PawPrint className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Informasi Hewan Peliharaan</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Nama Hewan <span className="text-red-500">*</span></label>
                <input 
                  required
                  type="text" 
                  name="petName"
                  value={formData.petName}
                  onChange={handleChange}
                  placeholder="Contoh: Milo"
                  className="w-full rounded-sm border border-slate-300 px-4 py-2 text-sm outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Jenis Hewan <span className="text-red-500">*</span></label>
                <select 
                  required
                  name="species"
                  value={formData.species}
                  onChange={handleChange}
                  className="w-full rounded-sm border border-slate-300 px-4 py-2 text-sm outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Pilih Jenis</option>
                  <option value="Kucing">Kucing</option>
                  <option value="Anjing">Anjing</option>
                  <option value="Burung">Burung</option>
                  <option value="Kelinci">Kelinci</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Ras / Breed</label>
                <input 
                  type="text" 
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                  placeholder="Contoh: Persian"
                  className="w-full rounded-sm border border-slate-300 px-4 py-2 text-sm outline-none transition-all focus:border-blue-500" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Jenis Kelamin</label>
                  <select 
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full rounded-sm border border-slate-300 px-4 py-2 text-sm outline-none transition-all focus:border-blue-500"
                  >
                    <option value="Jantan">Jantan</option>
                    <option value="Betina">Betina</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Berat (Kg)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="0.0"
                    className="w-full rounded-sm border border-slate-300 px-4 py-2 text-sm outline-none transition-all focus:border-blue-500" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Data Pemilik (Owner) */}
          <div className="rounded-sm border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-200 px-6 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                <User className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Informasi Pemilik</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Nama Pemilik <span className="text-red-500">*</span></label>
                <input 
                  required
                  type="text" 
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  placeholder="Nama lengkap"
                  className="w-full rounded-sm border border-slate-300 px-4 py-2 text-sm outline-none transition-all focus:border-blue-500" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Nomor Telepon <span className="text-red-500">*</span></label>
                <input 
                  required
                  type="tel" 
                  name="ownerPhone"
                  value={formData.ownerPhone}
                  onChange={handleChange}
                  placeholder="0812xxxx"
                  className="w-full rounded-sm border border-slate-300 px-4 py-2 text-sm outline-none transition-all focus:border-blue-500" 
                />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Alamat</label>
                <textarea 
                  rows="2"
                  name="ownerAddress"
                  value={formData.ownerAddress}
                  onChange={handleChange}
                  placeholder="Alamat lengkap pemilik..."
                  className="w-full rounded-sm border border-slate-300 px-4 py-2 text-sm outline-none transition-all focus:border-blue-500"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Clinical Info & Action */}
        <div className="space-y-6 lg:col-span-4">
          
          {/* Section: Visit Details */}
          <div className="rounded-sm border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-200 px-6 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                <Stethoscope className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Detail Kunjungan</h3>
            </div>
            
            <div className="space-y-4 p-6">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Pilih Dokter <span className="text-red-500">*</span></label>
                <select 
                  required
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleChange}
                  className="w-full rounded-sm border border-slate-300 px-4 py-2 text-sm outline-none transition-all focus:border-blue-500"
                >
                  <option value="">Pilih Dokter</option>
                  <option value="Drh. Anisa">Drh. Anisa (Umum)</option>
                  <option value="Drh. Bima">Drh. Bima (Bedah)</option>
                  <option value="Drh. Cita">Drh. Cita (Internis)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Keluhan / Gejala <span className="text-red-500">*</span></label>
                <textarea 
                  required
                  rows="4"
                  name="complaint"
                  value={formData.complaint}
                  onChange={handleChange}
                  placeholder="Jelaskan keluhan hewan..."
                  className="w-full rounded-sm border border-slate-300 px-4 py-2 text-sm outline-none transition-all focus:border-blue-500"
                ></textarea>
              </div>
              
              <div className="rounded-sm bg-blue-50 p-4">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 flex-shrink-0 text-blue-600" />
                  <p className="text-xs leading-relaxed text-blue-700">
                    Pastikan semua data bertanda <span className="font-bold text-red-500">*</span> telah diisi dengan benar sebelum menyimpan pendaftaran.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button 
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-sm bg-blue-600 px-6 py-3 font-bold text-white shadow-md transition-all hover:bg-blue-700 active:scale-[0.98]"
            >
              <Save className="h-5 w-5" />
              Simpan & Cetak Antrian
            </button>
            <button 
              type="button"
              onClick={() => navigate('/receptionist')}
              className="w-full rounded-sm border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition-all hover:bg-slate-50"
            >
              Batalkan
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default WalkInRegistration;
