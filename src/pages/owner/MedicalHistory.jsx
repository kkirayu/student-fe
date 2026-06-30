import React, { useState, useEffect } from 'react';
import { Activity, Stethoscope, Pill, Syringe, Calendar, FileText, Weight, Loader2, Info } from 'lucide-react';
import { getAllMedicalHistory } from '../../services/ownerService';

const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
const OWNER_ID = storedUser.id || 1;

const MedicalHistory = () => {
  const [historyRecords, setHistoryRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getAllMedicalHistory(OWNER_ID);
        // Tangani format respon paginasi dari Laravel resource
        const records = response?.data?.data || response?.data || response || [];
        
        // Ambil 5 record terakhir
        const last5Records = Array.isArray(records) ? records.slice(0, 5) : [];
        setHistoryRecords(last5Records);
      } catch (err) {
        console.error(err);
        setError('Gagal memuat riwayat medis.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-blue-500">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-sm text-slate-500">Memuat riwayat medis...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-center text-red-500">
        {error}
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold text-slate-800">Riwayat Medis Anabul</h1>
              <p className="text-sm font-medium text-slate-500">
                Menampilkan 5 kunjungan terakhir untuk semua hewan peliharaan Anda
              </p>
            </div>
          </div>
          <div className="rounded-md bg-orange-50 px-4 py-3 text-right">
            <p className="text-xs font-semibold uppercase text-orange-600">Total Kunjungan Terlihat</p>
            <p className="text-sm font-bold text-slate-800">{historyRecords.length} Riwayat</p>
          </div>
        </div>
      </div>

      {/* 2. Timeline Rekam Medis */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-slate-800">Riwayat Kunjungan (EMR)</h2>

        {historyRecords.length === 0 ? (
           <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
             <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 mb-4">
               <Info className="h-6 w-6 text-slate-500" />
             </div>
             <p className="text-slate-500 font-medium">Belum ada riwayat medis untuk anabul Anda.</p>
           </div>
        ) : (
          <div className="relative border-l-2 border-slate-200 pl-6 sm:pl-8">
            {historyRecords.map((record) => (
              <div key={record.id} className="relative mb-8 last:mb-0">
                
                {/* Timeline Bullet */}
                <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 ring-4 ring-slate-50"></div>

                {/* Card Kunjungan */}
                <div className="rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md overflow-hidden">
                  
                  {/* Bagian Atas: Info Dokter & Tanggal */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-3 sm:px-6 gap-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-blue-600 uppercase tracking-wide">
                      <Calendar className="h-4 w-4" />
                      {record.created_at ? record.created_at.split('T')[0] : record.date}
                    </div>
                    <div className="flex items-center flex-wrap gap-3 sm:gap-4 text-sm">
                      <span className="flex items-center gap-1.5 font-bold text-slate-700 bg-white px-2 py-1 rounded shadow-sm border border-slate-200">
                        🐾 {record.pet?.name || 'Hewan Tidak Diketahui'}
                      </span>
                      <span className="flex items-center gap-1.5 font-medium text-slate-600">
                        <Stethoscope className="h-4 w-4 text-slate-400" />
                        {record.doctor?.name || '-'}
                      </span>
                      <span className="flex items-center gap-1.5 rounded bg-white px-2 py-1 font-medium text-slate-600 shadow-sm border border-slate-200">
                        <Weight className="h-3.5 w-3.5 text-slate-400" />
                        {record.weight || '-'} Kg
                      </span>
                    </div>
                  </div>

                  {/* Bagian Isi: Konsep SOAP */}
                  <div className="p-5 sm:p-6 space-y-5">
                    
                    {/* Grid Subjective & Objective */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div className="rounded-md bg-slate-50 p-4 border border-slate-100">
                        <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Subjective (Keluhan)</h4>
                        <p className="text-sm text-slate-700 leading-relaxed">{record.subjective || '-'}</p>
                      </div>
                      <div className="rounded-md bg-slate-50 p-4 border border-slate-100">
                        <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Objective (Pemeriksaan)</h4>
                        <p className="text-sm text-slate-700 leading-relaxed">{record.objective || '-'}</p>
                      </div>
                    </div>

                    {/* Assessment (Diagnosa) */}
                    <div>
                      <h4 className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">Assessment (Diagnosa Utama)</h4>
                      <div className="inline-flex rounded-md bg-red-50 px-3 py-1.5 border border-red-100">
                        <span className="text-sm font-bold text-red-700">{record.assessment || '-'}</span>
                      </div>
                    </div>

                    {/* Plan (Tindakan) */}
                    <div>
                      <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5" /> Plan (Tindakan & Edukasi)
                      </h4>
                      <p className="text-sm text-slate-700 leading-relaxed">{record.plan || '-'}</p>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalHistory;