import React, { useState } from 'react';
import { Save, ArrowLeft, Search, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const VaccinationBook = () => {
  // State disesuaikan dengan kolom tabel vaccinations sesuai gambar 
  const [formData, setFormData] = useState({
    pet_id: '',
    vaccine_name: '',
    batch_number: '',
    next_due_date: ''
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
    console.log("Data Vaksinasi Disimpan:", formData);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Breadcrumb */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Form Buku Vaksin (Vaccine)</h1>
          <p className="text-sm text-slate-500">Pencatatan riwayat imunisasi hewan berdasarkan tabel vaccinations.</p>
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
          
          {/* Informasi Pasien (Otomatis) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-md border border-slate-100">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Nama Pasien</label>
              <p className="text-sm font-medium text-slate-800">
                {formData.pet_id 
                  ? petOptions.find(p => p.id === formData.pet_id)?.name + " (" + petOptions.find(p => p.id === formData.pet_id)?.species + ")"
                  : "Silahkan pilih hewan peliharaan"}
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Dokter Pemeriksa</label>
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
                  <option value="">-- Pilih Hewan --</option>
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

            {/* Nama Vaksin (Input Teks / Dropdown)  */}
            <div>
              <label className="mb-2.5 block font-medium text-slate-800">
                Nama Vaksin <span className="text-xs text-slate-400 font-normal">(vaccine_name)</span>
              </label>
              <input
                type="text"
                list="vaccine_suggestions"
                name="vaccine_name"
                placeholder="Contoh: Tricat atau Rabies"
                value={formData.vaccine_name}
                onChange={handleChange}
                className="w-full rounded border border-slate-300 bg-transparent py-2 px-4 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
              <datalist id="vaccine_suggestions">
                <option value="Tricat" />
                <option value="Tetracat" />
                <option value="Rabies" />
                <option value="Eurican" />
              </datalist>
            </div>

            {/* Nomor Batch (Input Teks)  */}
            <div>
              <label className="mb-2.5 block font-medium text-slate-800">
                Nomor Batch <span className="text-xs text-slate-400 font-normal">(batch_number)</span>
              </label>
              <input
                type="text"
                name="batch_number"
                placeholder="Masukkan kode seri/produksi botol vaksin..."
                value={formData.batch_number}
                onChange={handleChange}
                className="w-full rounded border border-slate-300 bg-transparent py-2 px-4 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {/* Tanggal Vaksin Berikutnya (Date Picker)  */}
            <div>
              <label className="mb-2.5 block font-medium text-slate-800">
                Tanggal Vaksin Berikutnya <span className="text-xs text-slate-400 font-normal">(next_due_date)</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="next_due_date"
                  value={formData.next_due_date}
                  onChange={handleChange}
                  className="w-full rounded border border-slate-300 bg-transparent py-2 px-4 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Tombol Simpan */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded bg-emerald-600 px-10 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-all shadow-sm"
              >
                <Save className="h-4 w-4" />
                Simpan Buku Vaksin
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VaccinationBook;