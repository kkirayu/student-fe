import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const PetDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [pet] = useState({
    id: 1,
    name: "Milo",
    species: "Kucing",
    breed: "Persia",
    gender: "Jantan",
    weight: "4.5 kg",
    birth_date: "12 Maret 2024",
    color: "Putih Abu-abu",
    owner_name: "Rizky Amelia",
    owner_phone: "0812-3456-7890",
    owner_address: "Jl. Melati No. 12, Klaten",
    medical_history: [
      { date: "10 Mei 2026", note: "Vaksinasi Rabies Tahunan", status: "Selesai" },
      { date: "15 April 2026", note: "Pembersihan Karang Gigi", status: "Selesai" },
    ],
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2043&auto=format&fit=crop"
  });

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
              <div className="aspect-square rounded-[2rem] overflow-hidden mb-6">
                <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
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
                <p className="text-[10px] font-bold opacity-80 uppercase">Berat</p>
                <p className="text-lg font-black">{pet.weight}</p>
              </div>
              <div className="bg-slate-800 p-4 rounded-3xl text-white text-center">
                <p className="text-[10px] font-bold opacity-80 uppercase">Gender</p>
                <p className="text-lg font-black">{pet.gender}</p>
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
                  <p className="font-bold text-slate-700">{pet.birth_date}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Warna Bulu</label>
                  <p className="font-bold text-slate-700">{pet.color}</p>
                </div>
                <div className="md:col-span-2 pt-4 border-t border-slate-50">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Nama Pemilik</label>
                  <p className="font-black text-slate-800 text-xl">{pet.owner_name}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Kontak</label>
                  <p className="font-bold text-slate-700">{pet.owner_phone}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Alamat</label>
                  <p className="font-bold text-slate-700 leading-tight">{pet.owner_address}</p>
                </div>
              </div>
            </div>

            {/* Card Riwayat Medis */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                <span className="p-2 bg-slate-100 rounded-lg text-sm">🩺</span> Riwayat Medis
              </h3>

              <div className="space-y-4">
                {pet.medical_history.map((item, index) => (
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
                ))}
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