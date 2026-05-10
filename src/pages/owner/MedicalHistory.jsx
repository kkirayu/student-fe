import React, { useState } from 'react';
import { Activity, Stethoscope, Pill, Syringe, Calendar, FileText, Weight } from 'lucide-react';

const MedicalHistory = () => {
  // Mock data yang mensimulasikan hasil JOIN dari tabel:
  // pets, appointments, medical_records, users (role: Dokter), dan e_prescriptions
  const [petData] = useState({
    id: 1,
    name: 'Mochi',
    species: 'Kucing',
    breed: 'Persia Medium',
    gender: 'Jantan',
    dob: '12 April 2024',
    allergies: 'Tidak ada alergi obat',
  });

  const [historyRecords] = useState([
    {
      record_id: 102,
      appointment_date: '08 Mei 2026',
      doctor_name: 'Drh. Bunga',
      weight: '4.2', // Dari tabel medical_records.weight
      
      // Data SOAP dari tabel medical_records
      soap: {
        subjective: 'Kucing muntah bulu (hairball) 3 kali sejak kemarin, nafsu makan sedikit menurun.',
        objective: 'Suhu tubuh 38.5°C (Normal). Detak jantung normal. Palpasi perut sedikit tegang.',
        assessment: 'Feline Trichobezoar (Hairball) ringan.',
        plan: 'Pemberian pasta hairball, edukasi owner untuk rutin menyisir bulu.',
      },
      
      // Data dari tabel e_prescriptions (Relasi ke products)
      prescriptions: [
        { name: 'GimCat Malt-Soft Paste', qty: 1, instructions: '2cm per hari selama 3 hari' },
      ],
      
      // Data dari tabel lab_results atau vaccinations (opsional per kunjungan)
      vaccine: null,
    },
    {
      record_id: 85,
      appointment_date: '10 April 2026',
      doctor_name: 'Drh. Bunga',
      weight: '4.0',
      
      soap: {
        subjective: 'Kunjungan rutin untuk jadwal vaksin tahunan. Kucing sehat dan aktif.',
        objective: 'Suhu 38.2°C. Mata jernih, telinga bersih. Kondisi tubuh fit untuk divaksin.',
        assessment: 'Sehat (Healthy).',
        plan: 'Pemberian vaksin Tricat. Observasi 15 menit pasca vaksinasi.',
      },
      prescriptions: [],
      
      // Data dari tabel vaccinations
      vaccine: {
        name: 'Felocell 3 (Tricat)',
        next_due_date: '10 April 2027',
      }
    }
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      
      {/* 1. Header Informasi Pasien (Tabel pets) */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <Activity className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{petData.name}</h1>
              <p className="text-sm font-medium text-slate-500">
                {petData.species} • {petData.breed} • {petData.gender}
              </p>
            </div>
          </div>
          <div className="rounded-md bg-orange-50 px-4 py-3 text-right">
            <p className="text-xs font-semibold uppercase text-orange-600">Catatan Medis</p>
            <p className="text-sm font-medium text-slate-800">Alergi: {petData.allergies}</p>
          </div>
        </div>
      </div>

      {/* 2. Timeline Rekam Medis */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-slate-800">Riwayat Kunjungan (EMR)</h2>

        <div className="relative border-l-2 border-slate-200 pl-6 sm:pl-8">
          {historyRecords.map((record, index) => (
            <div key={record.record_id} className="relative mb-8 last:mb-0">
              
              {/* Timeline Bullet */}
              <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 ring-4 ring-slate-50"></div>

              {/* Card Kunjungan */}
              <div className="rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                
                {/* Bagian Atas: Info Dokter & Tanggal */}
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-3 sm:px-6">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    {record.appointment_date}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1.5 font-medium text-slate-700">
                      <Stethoscope className="h-4 w-4 text-slate-400" />
                      {record.doctor_name}
                    </span>
                    <span className="flex items-center gap-1.5 rounded bg-white px-2 py-1 font-medium text-slate-600 shadow-sm border border-slate-200">
                      <Weight className="h-3.5 w-3.5 text-slate-400" />
                      {record.weight} Kg
                    </span>
                  </div>
                </div>

                {/* Bagian Isi: Konsep SOAP */}
                <div className="p-5 sm:p-6 space-y-5">
                  
                  {/* Grid Subjective & Objective */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="rounded-md bg-slate-50 p-4 border border-slate-100">
                      <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Subjective (Keluhan)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed">{record.soap.subjective}</p>
                    </div>
                    <div className="rounded-md bg-slate-50 p-4 border border-slate-100">
                      <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Objective (Pemeriksaan)</h4>
                      <p className="text-sm text-slate-700 leading-relaxed">{record.soap.objective}</p>
                    </div>
                  </div>

                  {/* Assessment (Diagnosa) */}
                  <div>
                    <h4 className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">Assessment (Diagnosa Utama)</h4>
                    <div className="inline-flex rounded-md bg-red-50 px-3 py-1.5 border border-red-100">
                      <span className="text-sm font-bold text-red-700">{record.soap.assessment}</span>
                    </div>
                  </div>

                  {/* Plan (Tindakan) */}
                  <div>
                    <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5" /> Plan (Tindakan & Edukasi)
                    </h4>
                    <p className="text-sm text-slate-700 leading-relaxed">{record.soap.plan}</p>
                  </div>

                  {/* Bagian Ekstra: Resep Obat (e_prescriptions) */}
                  {record.prescriptions.length > 0 && (
                    <div className="mt-4 border-t border-slate-100 pt-4">
                      <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Pill className="h-3.5 w-3.5" /> Resep Obat Diberikan
                      </h4>
                      <ul className="space-y-2">
                        {record.prescriptions.map((med, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm">
                            <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
                            <div>
                              <span className="font-semibold text-slate-800">{med.name}</span> <span className="text-slate-500">(Qty: {med.qty})</span>
                              <p className="text-xs text-slate-500 mt-0.5">Dosis: {med.instructions}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Bagian Ekstra: Vaksin (vaccinations) */}
                  {record.vaccine && (
                    <div className="mt-4 border-t border-slate-100 pt-4">
                      <div className="flex items-center gap-3 rounded-md bg-emerald-50 p-3 border border-emerald-100">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-200 text-emerald-700">
                          <Syringe className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-emerald-800">Vaksinasi: {record.vaccine.name}</p>
                          <p className="text-xs font-medium text-emerald-600">Jadwal berikutnya: {record.vaccine.next_due_date}</p>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicalHistory;