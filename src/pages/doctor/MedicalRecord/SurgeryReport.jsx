import React, { useState } from 'react';
import { Save, ArrowLeft, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const SurgeryForm = () => {
  // State disesuaikan dengan kolom tabel surgeries sesuai gambar
  const [formData, setFormData] = useState({
    pet_id: '',
    surgery_type: '',
    anesthesia_notes: '',
    post_op_instructions: ''
  });

  const petOptions = [
    { id: '1', name: 'Luna', species: 'Kucing' },
    { id: '2', name: 'Bruno', species: 'Anjing' },
    { id: '3', name: 'Milo', species: 'Kelinci' },
    { id: '4', name: 'Choco', species: 'Hamster' }
  ];

  // Handler perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data Tindakan Bedah Disimpan:", formData);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Breadcrumb */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Form Tindakan Bedah (Surgery)</h1>
          <p className="text-sm text-slate-500">Pencatatan detail operasi dan instruksi pasca-bedah.</p>
        </div>
        
        <Link 
          to="/admin/DiagnosisReferenceList" 
          className="inline-flex items-center justify-center gap-2 rounded border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>
      </div>

      {/* 2. Form Area Utama */}
      <div className="rounded-sm border border-slate-200 bg-white shadow-sm">
        <div className="p-6 space-y-6">
          
          {/* Informasi Pasien (Otomatis berdasarkan pilihan) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-md border border-slate-100">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Nama Pasien (Otomatis)</label>
              <p className="text-sm font-medium text-slate-800">
                {formData.pet_id 
                  ? petOptions.find(p => p.id === formData.pet_id)?.name + " (" + petOptions.find(p => p.id === formData.pet_id)?.species + ")"
                  : "Silahkan pilih hewan di bawah"}
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Dokter Bedah</label>
              <p className="text-sm font-medium text-slate-800">Drh. Bunga</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Pilih Hewan */}
            <div>
              <label className="mb-2.5 block font-medium text-slate-800">
                Pilih Hewan <span className="text-xs text-slate-400 font-normal">(pet_id)</span>
              </label>
              <div className="relative">
                <select
                  name="pet_id"
                  value={formData.pet_id}
                  onChange={handleChange}
                  className="w-full appearance-none rounded border border-slate-300 bg-white py-2 pl-4 pr-10 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                >
                  <option value="">-- Pilih Hewan yang Dioperasi --</option>
                  {petOptions.map(pet => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name} ({pet.species})
                    </option>
                  ))}
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </span>
              </div>
            </div>

            {/* Jenis Operasi (Input Teks) */}
            <div>
              <label className="mb-2.5 block font-medium text-slate-800">
                Jenis Operasi <span className="text-xs text-slate-400 font-normal">(surgery_type)</span>
              </label>
              <input
                type="text"
                name="surgery_type"
                placeholder="Contoh: Sterilisasi, Pengangkatan Tumor, dll"
                value={formData.surgery_type}
                onChange={handleChange}
                className="w-full rounded border border-slate-300 bg-transparent py-2 px-4 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {/* Catatan Anestesi (Text Area) */}
            <div>
              <label className="mb-2.5 block font-medium text-slate-800">
                Catatan Anestesi <span className="text-xs text-slate-400 font-normal">(anesthesia_notes)</span>
              </label>
              <textarea
                rows="3"
                name="anesthesia_notes"
                placeholder="Detail jenis obat bius, dosis, dan reaksi pasien selama dibius..."
                value={formData.anesthesia_notes}
                onChange={handleChange}
                className="w-full rounded border border-slate-300 bg-transparent py-2 px-4 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              ></textarea>
            </div>

            {/* Instruksi Pasca-Operasi (Text Area) */}
            <div>
              <label className="mb-2.5 block font-medium text-slate-800">
                Instruksi Pasca-Operasi <span className="text-xs text-slate-400 font-normal">(post_op_instructions)</span>
              </label>
              <textarea
                rows="4"
                name="post_op_instructions"
                placeholder="Catatan perawatan, pantangan makan, atau cara membersihkan luka di rumah..."
                value={formData.post_op_instructions}
                onChange={handleChange}
                className="w-full rounded border border-slate-300 bg-transparent py-2 px-4 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              ></textarea>
            </div>

            {/* Tombol Simpan */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded bg-red-600 px-10 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-all shadow-sm"
              >
                <Save className="h-4 w-4" />
                Simpan Data Bedah
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SurgeryForm;