import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, PawPrint, User, Calendar, Activity } from 'lucide-react';

const PatientMedicalProfile = () => {
  const { id } = useParams();

  // Data Dummy Pasien (Gaya data statis seperti di FinancialReport)
  const patientData = {
    name: 'Mochi',
    species: 'Kucing',
    breed: 'Persia',
    gender: 'Betina',
    owner: 'Budi Santoso',
    weight: '4.2 kg',
    lastVisit: '08 Mei 2026'
  };

  const medicalHistory = [
    { date: '08 Mei 2026', diagnosis: 'Gastritis ringan', vet: 'drh. Bunga' },
    { date: '20 April 2026', diagnosis: 'Vaksinasi Tahunan F3', vet: 'drh. Bunga' },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      
      {/* Header - Identik dengan StaffForm */}
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
        <button className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Edit className="h-4 w-4" /> Edit Profil
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Kolom Kiri: Informasi Dasar (Card Style) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <PawPrint className="h-10 w-10" />
              </div>
            </div>
            <h2 className="text-center text-xl font-bold text-slate-800">{patientData.name}</h2>
            <p className="text-center text-sm text-slate-500 mb-6">{patientData.species} - {patientData.breed}</p>
            
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Pemilik</span>
                <span className="font-medium text-slate-800">{patientData.owner}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Berat</span>
                <span className="font-medium text-slate-800">{patientData.weight}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Kunjungan Terakhir</span>
                <span className="font-medium text-slate-800">{patientData.lastVisit}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Tabel Riwayat Medis (Gaya FinancialReport) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
              <h3 className="flex items-center gap-2 font-bold text-slate-700">
                <Activity className="h-4 w-4 text-blue-600" />
                Riwayat Medis
              </h3>
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
    </div>
  );
};

export default PatientMedicalProfile;