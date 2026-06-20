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
import { showSuccess, showError } from '../../utils/alertUtils';

const WalkInRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ownerName: '',
    ownerPhone: '',
    ownerAddress: '',
    petName: '',
    species: '',
    service_id: '',
    schedule_date: '',
    schedule_time: '',
    initial_complaint: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['ownerName', 'petName'].includes(name)) {
      setFormData(prev => ({ ...prev, [name]: value.replace(/[^a-zA-Z\s]/g, '') }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^[a-zA-Z\s]+$/.test(formData.ownerName)) {
      showError('Validasi Gagal', 'Nama pemilik hanya boleh berisi huruf!');
      return;
    }

    if (!/^0\d{0,12}$/.test(formData.ownerPhone)) {
      showError('Validasi Gagal', 'Nomor HP maksimal 13 digit angka dan harus dimulai dengan 0!');
      return;
    }

    if (!/^[a-zA-Z\s]+$/.test(formData.petName)) {
      showError('Validasi Gagal', 'Nama hewan hanya boleh berisi huruf!');
      return;
    }

    if (formData.initial_complaint) {
      const wordCount = formData.initial_complaint.trim().split(/\s+/).filter(word => word.length > 0).length;
      if (wordCount < 10 || wordCount > 200) {
        showError('Validasi Gagal', 'Keluhan awal minimal 10 kata dan maksimal 200 kata.');
        return;
      }
    }
    console.log('Form Submitted:', formData);
    await showSuccess('Berhasil!', 'Pendaftaran Berhasil!');
    navigate('/receptionist');
  };

  return (
    <div className="space-y-6 pb-10">
      {/*  Header */}
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
        <div className="space-y-6 lg:col-span-8">

          {/* Data Hewan */}
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
            </div>
          </div>

          {/* Data Pemilik */}
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

        <div className="space-y-6 lg:col-span-4">

          {/* Visit Details */}
          <div className="rounded-sm border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-200 px-6 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                <Stethoscope className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Detail Kunjungan</h3>
            </div>

            <div className="space-y-4 p-6">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Layanan <span className="text-red-500">*</span></label>
                <select
                  name="service_id" value={formData.service_id} onChange={handleChange}
                  className="w-full rounded-sm border border-slate-300 bg-transparent px-4 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                >
                  <option value="" disabled>Pilih layanan</option>
                  <option value="1">Grooming Kucing</option>
                  <option value="2">Grooming Anjing</option>
                  <option value="3">Vaksinasi</option>
                  <option value="4">Penitipan Hewan</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Tanggal Jadwal <span className="text-red-500">*</span></label>
                <input
                  type="date" name="schedule_date" value={formData.schedule_date} onChange={handleChange}
                  className="w-full rounded-sm border border-slate-300 bg-transparent px-4 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Waktu Jadwal <span className="text-red-500">*</span></label>
                <select
                  name="schedule_time" value={formData.schedule_time} onChange={handleChange}
                  className="w-full rounded-sm border border-slate-300 bg-transparent px-4 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                >
                  <option value="" disabled>Pilih Waktu</option>
                  <option value="1">10.00 - 11.30</option>
                  <option value="2">13.00 - 14.30</option>
                  <option value="3">15.00 - 16.30</option>
                  <option value="4">19.00 - 20.30</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Keluhan Awal / Catatan <span className="text-red-500">*</span></label>
                <textarea
                  required
                  rows="4"
                  name="initial_complaint"
                  value={formData.initial_complaint}
                  onChange={handleChange}
                  placeholder="Contoh: Kucing saya muntah-muntah sejak pagi..."
                  className="w-full rounded-sm border border-slate-300 px-4 py-2 text-sm outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
