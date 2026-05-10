import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, PawPrint, Activity, X, Save } from 'lucide-react';

const PatientMedicalProfile = () => {
  const { id } = useParams();
  
  // State untuk mengontrol Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Data Dummy Pasien
  const [patientData, setPatientData] = useState({
    appointment_id: 'APT-001',
    nama: 'Mochi',
    owner: 'Budhi',
    doctor_id: 'D-005',
    subjective: 'Kucing terlihat lemas, kurang nafsu makan sejak kemarin malam.',
    assessment: 'Gastritis Akut, (Peradangan Lambung)',
    plan: 'Pemberian obat antasida, diet makanan basah khusus pencernaan, istirahat total.',
    weight: '4.2'
  });

  const medicalHistory = [
    { date: '08 Mei 2026', diagnosis: 'Gastritis ringan', vet: 'drh. Bunga' },
    { date: '20 April 2026', diagnosis: 'Vaksinasi Tahunan F3', vet: 'drh. Bunga' },
  ];

  // Handler untuk menyimpan perubahan profil
  const handleSaveProfile = (e) => {
    e.preventDefault();
    // Logika simpan data di sini
    setIsModalOpen(false);
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            to="/doctor/dashboard" 
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Profil Medis Pasien</h1>
            <p className="text-sm text-slate-500">Informasi detail dan riwayat kesehatan anabul.</p>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-all shadow-sm"
        >
          <Edit className="h-4 w-4" /> Edit Profil
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Kolom Kiri: Informasi Dasar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <PawPrint className="h-10 w-10" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-slate-800">{patientData.nama}</h2>
            <p className="text-sm text-slate-500 mb-6 font-medium">Pasien: {patientData.appointment_id}</p>
            
            <div className="space-y-3 border-t border-slate-100 pt-4 text-left">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Pemilik</span>
                <span className="font-semibold text-slate-800">{patientData.owner}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Berat</span>
                <span className="font-semibold text-slate-800">{patientData.weight} Kg</span>
              </div>
              <div className="pt-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1 tracking-wider">Subjective</span>
                <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 italic">
                  "{patientData.subjective}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Tabel Riwayat Medis */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <h3 className="font-bold text-slate-700">Riwayat Medis</h3>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-semibold uppercase text-[10px]">Tanggal</th>
                  <th className="px-6 py-3 font-semibold uppercase text-[10px]">Diagnosa</th>
                  <th className="px-6 py-3 font-semibold uppercase text-[10px]">Dokter</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {medicalHistory.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-600 font-medium">{row.date}</td>
                    <td className="px-6 py-4 text-slate-800">{row.diagnosis}</td>
                    <td className="px-6 py-4 text-slate-500">{row.vet}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- MODAL EDIT PROFIL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          {/* Konten Modal */}
          <div className="relative w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="border-b border-slate-100 px-6 py-4 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Edit className="h-4 w-4 text-blue-600" /> Edit Data Pasien
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase tracking-wider">Nama Anabul</label>
                  <input 
                    type="text" 
                    value={patientData.nama}
                    onChange={(e) => setPatientData({...patientData, nama: e.target.value})}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 outline-none transition-all"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase tracking-wider">Berat (Kg)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={patientData.weight}
                    onChange={(e) => setPatientData({...patientData, weight: e.target.value})}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase tracking-wider">Pemilik</label>
                <input 
                  type="text" 
                  value={patientData.owner}
                  onChange={(e) => setPatientData({...patientData, owner: e.target.value})}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 outline-none transition-all"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase tracking-wider">Subjective (Keluhan)</label>
                <textarea 
                  rows="3"
                  value={patientData.subjective}
                  onChange={(e) => setPatientData({...patientData, subjective: e.target.value})}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 outline-none transition-all resize-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2 text-sm font-bold text-white hover:bg-blue-700 shadow-md transition-all"
                >
                  <Save className="h-4 w-4" /> Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientMedicalProfile;