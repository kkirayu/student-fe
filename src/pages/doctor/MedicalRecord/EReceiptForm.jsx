// src/pages/doctor/MedicalRecord/EReceiptForm.jsx
import React, { useState, useEffect } from 'react';
import { Pill, User, Plus, Trash2, FileText, Loader2, CheckCircle, Search } from 'lucide-react';

const EReceiptForm = () => {
  // State data dari API
  const [patients, setPatients] = useState([]);
  const [availableMedicines, setAvailableMedicines] = useState([]);
  
  // State UI & Loading
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [isLoadingMedicines, setIsLoadingMedicines] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // State Formulir Utama
  const [selectedPatient, setSelectedPatient] = useState('');
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('');
  const [prescriptionNotes, setPrescriptionNotes] = useState('');
  
  const [prescribedItems, setPrescribedItems] = useState([
    { medicineId: '', dosage: '', frequency: '', quantity: 1, instructions: '' }
  ]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('https://dummyjson.com/users?limit=10');
        const data = await response.json();
        
        const petNames = ['Milo', 'Luna', 'Kuro', 'Bella', 'Simba', 'Chloe', 'Max', 'Oreo', 'Coco', 'Rocky'];
        const petTypes = ['Kucing', 'Anjing', 'Kucing', 'Hamster', 'Anjing', 'Kelinci', 'Burung', 'Kucing', 'Musang', 'Anjing'];

        const mapped = data.users.map((user, idx) => ({
          id: user.id,
          ownerName: `${user.firstName} ${user.lastName}`,
          petName: petNames[idx],
          petType: petTypes[idx]
        }));
        setPatients(mapped);
      } catch (error) {
        console.error('Gagal mengambil data pasien:', error);
      } finally {
        setIsLoadingPatients(false);
      }
    };

    const fetchMedicines = async () => {
      try {
        const response = await fetch('https://dummyjson.com/products/category/beauty?limit=15');
        const data = await response.json();
        
        const medicalNames = [
          'Amoxicillin 150mg Vet', 'Ivermectin Anti-Parasit', 'Ketoconazole Jamur Drop', 
          'Enrofloxacin Antibiotik', 'Meloxicam Anti-Inflamasi', 'Vitamin B-Complex Vet', 
          'Obat Cacing Pyrantel', 'Ear Drop Otopain', 'Nutri-Plus Gel Supplement',
          'Shampoo Medicated Selsun', 'Prednisolone Anti-Alergi', 'Salep Mata Chloramphenicol'
        ];

        const mappedMedicines = data.products.map((item, idx) => ({
          id: item.id,
          name: medicalNames[idx] || item.title,
          unit: idx % 2 === 0 ? 'Tablet' : 'Botol/Sirup',
          stock: item.stock
        }));
        setAvailableMedicines(mappedMedicines);
      } catch (error) {
        console.error('Gagal mengambil data obat:', error);
      } finally {
        setIsLoadingMedicines(false);
      }
    };

    fetchPatients();
    fetchMedicines();
  }, []);

  const handlePatientChange = (patientId) => {
    setSelectedPatient(patientId);
    const patient = patients.find(p => p.id === parseInt(patientId));
    if (patient) {
      setPetName(patient.petName);
      setPetType(patient.petType);
    } else {
      setPetName('');
      setPetType('');
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...prescribedItems];
    updatedItems[index][field] = value;
    setPrescribedItems(updatedItems);
  };

  const addPrescriptionRow = () => {
    setPrescribedItems([
      ...prescribedItems,
      { medicineId: '', dosage: '', frequency: '', quantity: 1, instructions: '' }
    ]);
  };

  const removePrescriptionRow = (index) => {
    if (prescribedItems.length > 1) {
      const updatedItems = prescribedItems.filter((_, i) => i !== index);
      setPrescribedItems(updatedItems);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      setTimeout(() => {
        setSubmitSuccess(false);
        setSelectedPatient('');
        setPetName('');
        setPetType('');
        setPrescriptionNotes('');
        setPrescribedItems([{ medicineId: '', dosage: '', frequency: '', quantity: 1, instructions: '' }]);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-4xl flex flex-col gap-6">
      {/* Header Halaman */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Pembuatan E-Resep</h2>
        <p className="text-sm text-slate-500">Formulir digital pembuatan resep obat untuk pasien rawat jalan.</p>
      </div>

      {submitSuccess && (
        <div className="flex items-center gap-3 rounded bg-emerald-50 p-4 text-emerald-800 border border-emerald-200 shadow-sm animate-fadeIn">
          <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="font-semibold">E-Resep Berhasil Dibuat!</p>
            <p className="text-xs text-emerald-600">Data resep digital telah dikirimkan secara otomatis ke Modul Apotek.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* KARTU 1: INFORMASI PASIEN */}
        <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="h-5 w-5 text-blue-600" />
            <h3 className="font-bold text-slate-800">Pilih Pasien & Pemilik</h3>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Dropdown Owner */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Nama Pemilik (Owner)</label>
              {isLoadingPatients ? (
                <div className="flex h-10 items-center justify-center rounded border border-slate-200 bg-slate-50 text-xs text-slate-400">
                  <Loader2 className="h-4 w-4 animate-spin mr-2 text-blue-500" /> Memuat Owner...
                </div>
              ) : (
                <select
                  required
                  value={selectedPatient}
                  onChange={(e) => handlePatientChange(e.target.value)}
                  className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                >
                  <option value="">-- Pilih Pemilik --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.ownerName}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Nama Hewan (Auto) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Nama Hewan</label>
              <input
                type="text"
                disabled
                placeholder="Terisi otomatis..."
                value={petName}
                className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 outline-none"
              />
            </div>

            {/* Jenis Hewan (Auto) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Jenis Hewan</label>
              <input
                type="text"
                disabled
                placeholder="Terisi otomatis..."
                value={petType}
                className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 outline-none"
              />
            </div>
          </div>
        </div>

        {/* KARTU 2: DETAIL REKOMENDASI OBAT */}
        <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-blue-600" />
              <h3 className="font-bold text-slate-800">Daftar Obat / Racikan</h3>
            </div>
            <button
              type="button"
              onClick={addPrescriptionRow}
              className="flex items-center gap-1.5 rounded bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition"
            >
              <Plus className="h-4 w-4" /> Tambah Obat
            </button>
          </div>

          {isLoadingMedicines ? (
            <div className="flex flex-col items-center justify-center py-10 text-blue-500">
              <Loader2 className="h-7 w-7 animate-spin" />
              <p className="mt-2 text-xs text-slate-500">Sinkronisasi katalog obat via API...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {prescribedItems.map((item, index) => (
                <div 
                  key={index} 
                  className="relative grid grid-cols-1 gap-3 rounded border border-slate-100 bg-slate-50 p-4 pt-8 shadow-inner sm:grid-cols-12 sm:pt-4"
                >
                  {/* Tombol Hapus Pojok Kanan Atas */}
                  <button
                    type="button"
                    disabled={prescribedItems.length === 1}
                    onClick={() => removePrescriptionRow(index)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-rose-500 disabled:opacity-30 sm:static sm:col-span-1 sm:flex sm:items-center sm:justify-center sm:mt-6"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  {/* Dropdown Nama Obat */}
                  <div className="flex flex-col gap-1 sm:col-span-4">
                    <label className="text-xs font-semibold text-slate-600">Nama Obat</label>
                    <select
                      required
                      value={item.medicineId}
                      onChange={(e) => handleItemChange(index, 'medicineId', e.target.value)}
                      className="rounded border border-slate-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                    >
                      <option value="">-- Pilih Obat --</option>
                      {availableMedicines.map(med => (
                        <option key={med.id} value={med.id}>{med.name} ({med.unit})</option>
                      ))}
                    </select>
                  </div>

                  {/* Dosis (Contoh: 1/2, 1) */}
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-600">Takaran Dosis</label>
                    <input
                      type="text"
                      required
                      placeholder="Misal: 1 tab / 5ml"
                      value={item.dosage}
                      onChange={(e) => handleItemChange(index, 'dosage', e.target.value)}
                      className="rounded border border-slate-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Frekuensi (Contoh: 3x sehari) */}
                  <div className="flex flex-col gap-1 sm:col-span-3">
                    <label className="text-xs font-semibold text-slate-600">Frekuensi</label>
                    <input
                      type="text"
                      required
                      placeholder="Misal: 3x sehari (Sesudah Makan)"
                      value={item.frequency}
                      onChange={(e) => handleItemChange(index, 'frequency', e.target.value)}
                      className="rounded border border-slate-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Jumlah Kuantitas */}
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-600">Jumlah Qty</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className="rounded border border-slate-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* KARTU 3: CATATAN TAMBAHAN */}
        <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText className="h-5 w-5 text-blue-600" />
            <h3 className="font-bold text-slate-800">Instruksi Khusus Dokter</h3>
          </div>
          <div className="flex flex-col gap-1.5">
            <textarea
              rows="3"
              placeholder="Berikan instruksi tambahan jika diperlukan, misalnya: Simpan di dalam kulkas, habiskan antibiotik, dst."
              value={prescriptionNotes}
              onChange={(e) => setPrescriptionNotes(e.target.value)}
              className="w-full rounded border border-slate-300 p-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>

        {/* AKSI SUBMIT */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="rounded border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isLoadingMedicines || !selectedPatient}
            className="flex items-center gap-2 rounded bg-blue-600 px-6 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition shadow-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...
              </>
            ) : (
              'Simpan & Kirim E-Resep'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EReceiptForm;