import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, PawPrint, Activity, X, Save, Eye, FileText, Pill } from 'lucide-react';

const PatientMedicalProfile = () => {
  const { id } = useParams();

  // State untuk mengontrol Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);

  const [patientData, setPatientData] = useState({
    appointment_id: 'APT-001',
    nama: 'Mochi',
    owner: 'Budhi',
    doctor_id: 'D-005',
    subjective: 'Kucing muntah bulu (hairball) 3 kali sejak kemarin, nafsu makan sedikit menurun.',
    assessment: 'Feline Trichobezoar (Hairball) ringan.',
    plan: 'Pemberian pasta hairball, edukasi owner untuk rutin menyisir bulu.',
    weight: '4.2',
    species: 'Kucing',
    breed: 'Persia Medium',
    gender: 'Jantan',
    age: '2 Tahun 1 Bulan',
    allergies: 'Tidak ada alergi obat',
    temperature: '38.5°C'
  });

  const medicalHistory = [
    {
      date: '08 Mei 2026',
      diagnosis: 'Gastritis ringan',
      vet: 'drh. Bunga',
      subjective: 'Kucing muntah 2x setelah makan dry food.',
      objective: 'Suhu 38.6°C, perut sedikit kembung.',
      plan: 'Ganti makanan ke wet food (Gastrointestinal).',
      prescriptions: [
        { name: 'Omeprazole 10mg', qty: 5, instructions: '1/4 tablet 2x sehari' },
        { name: 'RC Gastrointestinal Wet', qty: 2, instructions: 'Sesuai kebutuhan' }
      ]
    },
    {
      date: '20 April 2026',
      diagnosis: 'Vaksinasi Tahunan F3 (Felocell 3)',
      vet: 'drh. Bunga',
      subjective: 'Jadwal rutin vaksin tahunan. Kucing sehat.',
      objective: 'Suhu 38.2°C, mata cerah, telinga bersih.',
      plan: 'Vaksinasi Felocell 3 diberikan. Observasi 15 menit post-vaksin.',
      prescriptions: []
    },
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
            to="/doctor/waiting-list"
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
                <span className="text-slate-500">Spesies / Ras</span>
                <span className="font-semibold text-slate-800">{patientData.species} - {patientData.breed}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Jenis Kelamin</span>
                <span className="font-semibold text-slate-800">{patientData.gender}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Umur</span>
                <span className="font-semibold text-slate-800">{patientData.age}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Pemilik</span>
                <span className="font-semibold text-slate-800">{patientData.owner}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Berat / Suhu</span>
                <span className="font-semibold text-slate-800">{patientData.weight} Kg / {patientData.temperature}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Alergi</span>
                <span className="font-semibold text-red-600">{patientData.allergies}</span>
              </div>

              <div className="pt-2 mt-2 border-t border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1 tracking-wider">Keluhan Awal (Subjective)</span>
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
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3 font-semibold uppercase text-[10px]">Tanggal</th>
                  <th className="px-6 py-3 font-semibold uppercase text-[10px]">Diagnosa</th>
                  <th className="px-6 py-3 font-semibold uppercase text-[10px]">Dokter</th>
                  <th className="px-6 py-3 font-semibold uppercase text-[10px] text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {medicalHistory.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-600 font-medium">{row.date}</td>
                    <td className="px-6 py-4 text-slate-800">{row.diagnosis}</td>
                    <td className="px-6 py-4 text-slate-500">{row.vet}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedHistory(row)}
                        className="inline-flex items-center gap-1 rounded bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" /> Detail
                      </button>
                    </td>
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
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>

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
                    onChange={(e) => setPatientData({ ...patientData, nama: e.target.value })}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 outline-none transition-all"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase tracking-wider">Berat (Kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={patientData.weight}
                    onChange={(e) => setPatientData({ ...patientData, weight: e.target.value })}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase tracking-wider">Pemilik</label>
                <input
                  type="text"
                  value={patientData.owner}
                  onChange={(e) => setPatientData({ ...patientData, owner: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 outline-none transition-all"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase tracking-wider">Subjective (Keluhan)</label>
                <textarea
                  rows="3"
                  value={patientData.subjective}
                  onChange={(e) => setPatientData({ ...patientData, subjective: e.target.value })}
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

      {/* --- MODAL DETAIL RIWAYAT MEDIS --- */}
      {selectedHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedHistory(null)}></div>

          <div className="relative w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="border-b border-slate-100 px-6 py-4 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" /> Detail Rekam Medis
              </h3>
              <button onClick={() => setSelectedHistory(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Header Info */}
              <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                <div>
                  <p className="text-sm font-bold text-slate-800">{selectedHistory.date}</p>
                  <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1">
                    <Activity className="h-3 w-3" /> Ditangani oleh: {selectedHistory.vet}
                  </p>
                </div>
                <div className="rounded bg-red-50 px-3 py-1.5 border border-red-100 text-right">
                  <p className="text-[10px] uppercase font-bold text-red-500 tracking-wider mb-0.5">Diagnosa Utama</p>
                  <span className="text-xs font-bold text-red-700">{selectedHistory.diagnosis}</span>
                </div>
              </div>

              {/* SOAP Blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg bg-slate-50 p-4 border border-slate-100">
                  <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">Subjective (Keluhan)</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">{selectedHistory.subjective}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 border border-slate-100">
                  <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">Objective (Pemeriksaan)</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">{selectedHistory.objective}</p>
                </div>
                <div className="sm:col-span-2 rounded-lg bg-blue-50/50 p-4 border border-blue-100">
                  <h4 className="text-[10px] uppercase font-bold text-blue-600 tracking-wider mb-2">Plan (Tindakan & Edukasi)</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">{selectedHistory.plan}</p>
                </div>
              </div>

              {/* Prescriptions */}
              {selectedHistory.prescriptions && selectedHistory.prescriptions.length > 0 && (
                <div className="pt-2">
                  <h4 className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                    <Pill className="h-4 w-4 text-emerald-600" /> Resep Obat Diberikan
                  </h4>
                  <div className="grid gap-2">
                    {selectedHistory.prescriptions.map((med, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0"></div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{med.name}</p>
                            <p className="text-xs font-medium text-slate-500 mt-0.5">{med.instructions}</p>
                          </div>
                        </div>
                        <span className="rounded bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700 border border-emerald-100">
                          Qty: {med.qty}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientMedicalProfile;