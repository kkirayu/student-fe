import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { getPetById } from '../../../services/ownerService';

const PetDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPet = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getPetById(id);
        // Support both direct object and { data: {...} } wrapper
        setPet(data.data ?? data);
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
                  <p className="font-bold text-slate-700">{pet.dob ?? '-'}</p>
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
                {pet.medical_history && pet.medical_history.length > 0 ? (
                  pet.medical_history.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex gap-4 items-center">
                        <div className="bg-white px-3 py-1 rounded-xl text-center shadow-sm border border-slate-200">
                          <p className="text-[10px] font-black text-blue-600 leading-none py-1 uppercase">{item.date}</p>
                        </div>
                        <p className="text-sm font-bold text-slate-700">{item.note}</p>
                      </div>
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded uppercase tracking-wider">
                        {item.status}
                      </span>
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
    </div>
  );
};

export default PetDetail;