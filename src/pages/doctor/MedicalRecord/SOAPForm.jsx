import React, { useState } from 'react';
import { Save, ArrowLeft, Search } from 'lucide-react';
import { Link } from 'react-router-dom';



const SOAPForm = () => {
  // State untuk menangani input form sesuai kolom tabel medical_records
  const [formData, setFormData] = useState({
    weight: '',
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
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
 
  return (
    <div className="space-y-6">
      {/* 1. Header & Breadcrumb */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Form Rekam Medis (SOAP)</h1>
          <p className="text-sm text-slate-500">Pencatatan hasil pemeriksaan terstruktur oleh Dokter Hewan.</p>
        </div>
        
        <Link 
          to="/doctor" 
          className="inline-flex items-center justify-center gap-2 rounded border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>
      </div>

      {/* 2. Form Area Utama */}
      <div className="rounded-sm border border-slate-200 bg-white shadow-sm">
        <div className="p-6 space-y-6">
          
          {/* Informasi Pasien (Otomatis) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-md border border-slate-100">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Nama Hewan</label>
              <p className="text-sm font-medium text-slate-800">Luna (Kucing)</p>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Dokter Bertugas</label>
              <p className="text-sm font-medium text-slate-800">Drh. Bunga</p>
            </div>
          </div>

          <form className="space-y-5">


            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Pilih Hewan</label>
              <div className="relative">
                <select
                  name="pet_id"
                  value={formData.pet_id}
                  onChange={handleChange}
                  className="w-full appearance-none rounded border border-slate-300 bg-white py-1.5 pl-3 pr-10 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                >
                  <option value="">-- Pilih Hewan --</option>
                  {petOptions.map(pet => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name} ({pet.species})
                    </option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Search className="h-3.5 w-3.5 text-slate-400" />
                </span>
              </div>
              </div>

            {/* Berat Badan (Input Angka) */}
            <div>
              <label className="mb-2.5 block font-medium text-slate-800">
                Berat Badan (kg) <span className="text-xs text-slate-400 font-normal">(weight)</span>
              </label>
              <input
                type="number"
                name="weight"
                step="0.1"
                placeholder="0.0"
                value={formData.weight}
                onChange={handleChange}
                className="w-full rounded border border-slate-300 bg-transparent py-2 px-4 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {/* Subjective (Text Area) */}
            <div>
              <label className="mb-2.5 block font-medium text-slate-800">
                Subjective <span className="text-xs text-slate-400 font-normal">(subjective)</span>
              </label>
              <textarea
                rows="3"
                name="subjective"
                placeholder="Catatan keluhan, riwayat, atau gejala dari pemilik..."
                value={formData.subjective}
                onChange={handleChange}
                className="w-full rounded border border-slate-300 bg-transparent py-2 px-4 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              ></textarea>
            </div>

            {/* Objective (Text Area) */}
            <div>
              <label className="mb-2.5 block font-medium text-slate-800">
                Objective <span className="text-xs text-slate-400 font-normal">(objective)</span>
              </label>
              <textarea
                rows="3"
                name="objective"
                placeholder="Hasil pemeriksaan fisik (suhu, detak jantung, dll)..."
                value={formData.objective}
                onChange={handleChange}
                className="w-full rounded border border-slate-300 bg-transparent py-2 px-4 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              ></textarea>
            </div>

            {/* Assessment (Dropdown / Search) */}
            <div>
              <label className="mb-2.5 block font-medium text-slate-800">
                Assessment <span className="text-xs text-slate-400 font-normal">(diagnosis_dictionary)</span>
              </label>
              <div className="relative">
                <select
                  name="assessment"
                  value={formData.assessment}
                  onChange={handleChange}
                  className="w-full appearance-none rounded border border-slate-300 bg-transparent py-2 pl-4 pr-10 text-sm outline-none focus:border-blue-600"
                >
                  <option value="">Pilih Diagnosis Penyakit...</option>
                  <option value="1">Feline Calicivirus</option>
                  <option value="2">Scabies</option>
                  <option value="3">Parvovirus</option>
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Search className="h-4 w-4 text-slate-400" />
                </span>
              </div>
            </div>

            {/* Plan (Text Area) */}
            <div>
              <label className="mb-2.5 block font-medium text-slate-800">
                Plan <span className="text-xs text-slate-400 font-normal">(plan)</span>
              </label>
              <textarea
                rows="3"
                name="plan"
                placeholder="Rencana pengobatan, resep, atau anjuran rawat inap..."
                value={formData.plan}
                onChange={handleChange}
                className="w-full rounded border border-slate-300 bg-transparent py-2 px-4 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              ></textarea>
            </div>

            {/* Tombol Simpan */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded bg-blue-600 px-10 py-2.5 text-sm font-medium text-white hover:bg-opacity-90 transition-all"
              >
                <Save className="h-4 w-4" />
                Simpan Rekam Medis
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SOAPForm;