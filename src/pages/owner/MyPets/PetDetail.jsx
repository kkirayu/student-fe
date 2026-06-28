import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, AlertCircle, Activity, FileText, Pill, X, Eye } from 'lucide-react';
import { getPetById, getPetMedicalHistory } from '../../../services/ownerService';

const PetDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);

  useEffect(() => {
    const fetchPet = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [petData, historyData] = await Promise.all([
          getPetById(id),
          getPetMedicalHistory(id)
        ]);
        const petObj = petData.data ?? petData;
        setPet(petObj);

        let historyArray = historyData?.data?.data || historyData?.data || historyData || [];
        if (!Array.isArray(historyArray) || historyArray.length === 0) {
          historyArray = petObj.medical_history || [];
        }
        setMedicalHistory(historyArray);
      } catch (err) {
        console.error(err);
        setError('Gagal memuat detail pet. Silakan coba lagi.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPet();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-blue-500">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-sm text-slate-500">Memuat detail pet...</span>
        </div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 text-red-500">
        <AlertCircle className="h-8 w-8" />
        <span className="text-sm">{error ?? 'Data tidak ditemukan.'}</span>
        <button
          onClick={() => navigate(-1)}
          className="mt-2 text-xs font-medium text-blue-600 underline hover:text-blue-800"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto">

        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold text-sm uppercase tracking-widest"
        >
          ← Kembali ke Daftar
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-4 rounded-[2.5rem] shadow-sm border border-slate-200">
              <div className="aspect-square rounded-[2rem] overflow-hidden mb-6 bg-slate-100 flex items-center justify-center">
                {pet.photo_url ? (
                  <img src={pet.photo_url} alt={pet.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-7xl">🐾</span>
                )}
              </div>
              <div className="text-center px-2 pb-4">
                <h2 className="text-3xl font-black text-slate-800 mb-1">{pet.name}</h2>
                <p className="text-emerald-600 font-bold uppercase tracking-[0.2em] text-xs">
                  {pet.species} • {pet.breed}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-600 p-4 rounded-3xl text-white text-center">
                <p className="text-[10px] font-bold opacity-80 uppercase">Warna</p>
                <p className="text-lg font-black">{pet.color ?? '-'}</p>
              </div>
              <div className="bg-slate-800 p-4 rounded-3xl text-white text-center">
                <p className="text-[10px] font-bold opacity-80 uppercase">Gender</p>
                <p className="text-lg font-black">{pet.gender ?? '-'}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                <span className="p-2 bg-slate-100 rounded-lg text-sm">📄</span> Informasi Detail
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Tanggal Lahir</label>
                  <p className="font-bold text-slate-700">{pet.dob ? pet.dob.split('T')[0] : '-'}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Warna Bulu</label>
                  <p className="font-bold text-slate-700">{pet.color ?? '-'}</p>
                </div>
                {pet.distinctive_traits && (
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Ciri Khas</label>
                    <p className="font-bold text-slate-700">{pet.distinctive_traits}</p>
                  </div>
                )}
                {pet.allergies && (
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Alergi</label>
                    <p className="font-bold text-red-600">{pet.allergies}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Card Riwayat Medis */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                <span className="p-2 bg-slate-100 rounded-lg text-sm">🩺</span> Riwayat Medis
              </h3>

              <div className="space-y-4">
                {medicalHistory && medicalHistory.length > 0 ? (
                  medicalHistory.map((item, index) => (
                    <div key={index} onClick={() => setSelectedHistory(item)} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer">
                      <div className="flex gap-4 items-center">
                        <div className="bg-white px-3 py-1 rounded-xl text-center shadow-sm border border-slate-200">
                          <p className="text-[10px] font-black text-blue-600 leading-none py-1 uppercase">{item.created_at ? item.created_at.split('T')[0] : (item.date || item.appointment_date)}</p>
                        </div>
                        <p className="text-sm font-bold text-slate-700">{(item.diagnosis && item.diagnosis.disease_name) || item.subjective || item.note || 'Pemeriksaan Rutin'}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded uppercase tracking-wider">
                          {item.status || 'Selesai'}
                        </span>
                        <button className="text-blue-500 hover:text-blue-700 p-1 bg-white rounded shadow-sm">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 text-center py-4">Belum ada riwayat medis.</p>
                )}
              </div>

              <button className="w-full mt-6 py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold text-xs hover:border-blue-300 hover:text-blue-500 transition-all uppercase tracking-widest">
                + Tambah Catatan Medis
              </button>
            </div>
          </div>
        </div>
      </div>

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
              <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                <div>
                  <p className="text-sm font-bold text-slate-800">{selectedHistory.created_at ? selectedHistory.created_at.split('T')[0] : (selectedHistory.date || selectedHistory.appointment_date)}</p>
                  <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1">
                    <Activity className="h-3 w-3" /> Ditangani oleh: {selectedHistory.doctor?.name || selectedHistory.vet || selectedHistory.doctor_name || '-'}
                  </p>
                </div>
                <div className="rounded bg-red-50 px-3 py-1.5 border border-red-100 text-right">
                  <p className="text-[10px] uppercase font-bold text-red-500 tracking-wider mb-0.5">Diagnosa Utama</p>
                  <span className="text-xs font-bold text-red-700">{(selectedHistory.diagnosis && selectedHistory.diagnosis.disease_name) || (selectedHistory.soap && selectedHistory.soap.assessment) || '-'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg bg-slate-50 p-4 border border-slate-100">
                  <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">Subjective (Keluhan)</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">{selectedHistory.subjective || (selectedHistory.soap && selectedHistory.soap.subjective) || '-'}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 border border-slate-100">
                  <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">Objective (Pemeriksaan)</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">{selectedHistory.objective || (selectedHistory.soap && selectedHistory.soap.objective) || '-'}</p>
                </div>
                <div className="sm:col-span-2 rounded-lg bg-blue-50/50 p-4 border border-blue-100">
                  <h4 className="text-[10px] uppercase font-bold text-blue-600 tracking-wider mb-2">Plan (Tindakan & Edukasi)</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">{selectedHistory.plan || (selectedHistory.soap && selectedHistory.soap.plan) || '-'}</p>
                </div>
              </div>

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
                            <p className="text-sm font-bold text-slate-800">{med.name || med.medicine_name}</p>
                            <p className="text-xs font-medium text-slate-500 mt-0.5">{med.instructions || med.notes}</p>
                          </div>
                        </div>
                        <span className="rounded bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700 border border-emerald-100">
                          Qty: {med.qty || med.quantity}
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

export default PetDetail;