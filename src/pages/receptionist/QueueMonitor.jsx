// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  Clock, 
  Calendar, 
  Heart, 
  ArrowRight, 
  Maximize2, 
  Minimize2,
  Tv
} from 'lucide-react';
import catImage from '../../assets/animals/cat.webp';
import dogImage from '../../assets/animals/dog.webp';
import birdImage from '../../assets/animals/bird.webp';

const QueueMonitor = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const monitorRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!monitorRef.current) return;
    
    if (!document.fullscreenElement) {
      monitorRef.current.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) => console.error("Gagal mengaktifkan mode Fullscreen:", err));
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const currentCall = {
    id: 'Q-005',
    petName: 'Milo',
    species: 'Kucing',
    owner: 'Budi Santoso',
    doctor: 'Drh. Anisa',
    room: 'Ruang Periksa 1',
    image: catImage
  };

  const nextQueue = [
    { id: 'Q-006', petName: 'Bella', species: 'Anjing', doctor: 'Drh. Bima', image: dogImage },
    { id: 'Q-007', petName: 'Luna', species: 'Kucing', doctor: 'Drh. Anisa', image: catImage },
    { id: 'Q-008', petName: 'Rocky', species: 'Anjing', doctor: 'Drh. Cita', image: dogImage },
    { id: 'Q-009', petName: 'Kiko', species: 'Burung', doctor: 'Drh. Bima', image: birdImage },
  ];

  return (
    <div 
      ref={monitorRef}
      className={`font-sans flex flex-col overflow-hidden transition-colors duration-500 ${
        isFullscreen 
          ? 'h-screen w-screen bg-[#0B0F19] text-white p-6 justify-between' 
          : 'min-h-[85vh] rounded-2xl border border-slate-200 bg-slate-50 text-slate-800'
      }`}
    >
      
      {/* Header */}
      <header className={`px-6 py-4 flex items-center justify-between border-b ${
        isFullscreen 
          ? 'border-slate-800 bg-[#0F172A]/80 backdrop-blur-md rounded-2xl shadow-xl' 
          : 'border-slate-200 bg-white/90 backdrop-blur-md rounded-t-2xl shadow-sm'
      }`}>
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-blue-600 to-teal-400 p-2 rounded-xl shadow-md">
            <Heart className="h-6 w-6 text-white" fill="currentColor" />
          </div>
          <div>
            <h1 className={`font-extrabold ${isFullscreen ? 'text-2xl text-white' : 'text-xl bg-gradient-to-r from-blue-700 to-teal-600 bg-clip-text text-transparent'}`}>
              Zeta Pet Care
            </h1>
            <p className={`text-xs font-semibold ${isFullscreen ? 'text-slate-400' : 'text-slate-500'}`}>Monitor Antrean Pasien</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={`hidden sm:flex items-center gap-2 font-medium px-3.5 py-1.5 rounded-full text-xs border ${
            isFullscreen 
              ? 'bg-[#1E293B] text-slate-300 border-slate-800' 
              : 'bg-white text-slate-600 border-slate-200 shadow-sm'
          }`}>
            <Calendar className="h-4 w-4 text-teal-500" />
            <span>{formatDate(currentTime)}</span>
          </div>

          <div className={`flex items-center gap-2 font-bold text-lg px-4 py-1.5 rounded-full border ${
            isFullscreen 
              ? 'bg-[#1E293B] text-blue-400 border-slate-850' 
              : 'bg-white text-blue-600 border-slate-200 shadow-sm'
          }`}>
            <Clock className="h-5 w-5" />
            <span>{formatTime(currentTime)}</span>
          </div>

          <button 
            onClick={toggleFullscreen}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm border ${
              isFullscreen 
                ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-500' 
                : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500'
            }`}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="h-4 w-4" />
                <span>Kecilkan Layar</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-4 w-4" />
                <span>Layar Penuh (TV)</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col lg:flex-row gap-6 p-6 ${isFullscreen ? 'overflow-hidden' : ''}`}>
        
        {/* Bagian Panggilan Saat Ini (Left) */}
        <section className="flex-[5] flex flex-col min-h-0">
          <div className={`rounded-2xl shadow-xl overflow-hidden flex flex-col h-full border ${
            isFullscreen 
              ? 'bg-[#111827]/90 border-slate-800' 
              : 'bg-white border-slate-100'
          }`}>
            
            {/* Call Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between text-white">
              <h2 className="text-xl font-bold tracking-wide flex items-center gap-3">
                <Volume2 className="h-6 w-6 animate-pulse" />
                PANGGILAN AKTIF
              </h2>
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Silakan Masuk
              </span>
            </div>

            {/* Call Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              
              <div className="mb-4">
                <span className={`inline-block px-12 py-3 rounded-2xl text-6xl font-black tracking-widest border-2 shadow-md ${
                  isFullscreen 
                    ? 'bg-[#1F2937] text-blue-400 border-slate-800' 
                    : 'bg-blue-50 text-blue-800 border-blue-100'
                }`}>
                  {currentCall.id}
                </span>
              </div>

              <div className="flex flex-col items-center gap-4 mb-6">
                <img 
                  src={currentCall.image} 
                  alt={currentCall.petName} 
                  className={`rounded-full object-cover border-4 shadow-lg ${
                    isFullscreen ? 'w-44 h-44 border-slate-800' : 'w-36 h-36 border-white'
                  }`}
                />
                
                <div>
                  <h3 className={`font-black tracking-tight leading-none mb-2 ${
                    isFullscreen ? 'text-6xl text-white' : 'text-5xl text-slate-800'
                  }`}>
                    {currentCall.petName}
                  </h3>
                  
                  <span className={`inline-block px-4 py-1.5 rounded-full border text-xs font-semibold uppercase ${
                    isFullscreen 
                      ? 'bg-[#1E293B] border-slate-800 text-slate-350' 
                      : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}>
                    Pemilik: <span className="font-bold text-blue-500">{currentCall.owner}</span> | {currentCall.species}
                  </span>
                </div>
              </div>

              {/* Target Room */}
              <div className={`w-full max-w-lg rounded-2xl p-5 border shadow-inner flex flex-col items-center gap-2 mt-auto ${
                isFullscreen 
                  ? 'bg-[#1E293B]/50 border-slate-800' 
                  : 'bg-slate-50 border-slate-100'
              }`}>
                <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Arah Ruangan</span>
                <div className="text-3xl font-extrabold text-teal-500 bg-teal-500/10 px-8 py-3 rounded-xl border border-teal-500/20 w-full text-center">
                  {currentCall.room}
                </div>
                <div className={`text-sm font-semibold mt-1 ${isFullscreen ? 'text-slate-300' : 'text-slate-700'}`}>
                  Dokter: <span className="text-blue-500">{currentCall.doctor}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bagian Antrean Berikutnya & Edukasi (Right) */}
        <section className="flex-[4] flex flex-col gap-6 min-h-0">
          
          {/* List Antrean Berikutnya */}
          <div className={`rounded-2xl shadow-xl overflow-hidden flex-1 flex flex-col border ${
            isFullscreen 
              ? 'bg-[#111827]/90 border-slate-800' 
              : 'bg-white border-slate-100'
          }`}>
            <div className={`px-5 py-4 flex items-center gap-2 text-white border-b ${
              isFullscreen ? 'bg-slate-900 border-slate-800' : 'bg-slate-850 border-slate-200'
            }`}>
              <Tv className="h-5 w-5 text-teal-400" />
              <h2 className="text-sm font-bold tracking-wider">ANTREAN BERIKUTNYA</h2>
            </div>
            
            <div className="p-4 flex-1 flex flex-col gap-3 justify-center">
              {nextQueue.map((item, index) => (
                <div 
                  key={index} 
                  className={`rounded-xl p-3 border flex items-center gap-4 transition-all duration-300 ${
                    isFullscreen 
                      ? 'bg-[#1F2937]/50 border-slate-800/80 hover:bg-[#1F2937]' 
                      : 'bg-slate-50 border-slate-100 hover:bg-slate-100/70'
                  }`}
                >
                  {/* Nomor Antrean */}
                  <div className={`w-12 h-12 flex items-center justify-center rounded-xl font-black text-lg shadow-inner ${
                    isFullscreen ? 'bg-[#111827] text-teal-400' : 'bg-white text-slate-850 border border-slate-200'
                  }`}>
                    {item.id.split('-')[1]}
                  </div>
                  
                  {/* Avatar Hewan */}
                  <img 
                    src={item.image} 
                    alt={item.petName} 
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 flex-shrink-0"
                  />
                  
                  {/* Nama Hewan */}
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-bold truncate text-base ${isFullscreen ? 'text-white' : 'text-slate-800'}`}>{item.petName}</h4>
                    <p className="text-slate-450 text-xs truncate">{item.species}</p>
                  </div>
                  
                  {/* Status & Dokter */}
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-teal-500 bg-teal-500/10 px-2 py-0.5 rounded-full uppercase border border-teal-500/20">
                      Menunggu
                    </span>
                    <p className="text-slate-500 text-xs font-semibold mt-1">{item.doctor}</p>
                  </div>
                </div>
              ))}
              
              <div className="text-center pt-2 text-slate-450 font-medium text-[11px] flex justify-center items-center gap-1.5">
                Ada 12 antrian lainnya di belakang <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-5 shadow-lg text-white relative overflow-hidden flex-shrink-0">
            <div className="relative z-10 w-full">
              <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2.5 inline-block">
                Tips Kesehatan
              </span>
              <h3 className="text-sm font-bold leading-snug mb-1">
                Vaksinasi rutin tahunan melindungi hewan peliharaan Anda!
              </h3>
              <p className="text-teal-50/80 text-[11px] leading-normal">
                Tanyakan jadwal vaksinasi hewan Anda pada dokter hewan kami hari ini untuk perlindungan dari virus mematikan.
              </p>
            </div>
          </div>

        </section>
      </main>

    </div>
  );
};

export default QueueMonitor;
