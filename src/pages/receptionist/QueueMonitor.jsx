// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
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
  const [appointments, setAppointments] = useState([]);
  const [currentCallIndex, setCurrentCallIndex] = useState(0);
  const [announcedIds, setAnnouncedIds] = useState(new Set());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const res = await api.get(`/appointments?date=${today}`);
        const data = res.data.data.data || [];
        setAppointments(data);
      } catch (err) {
        console.error("Error fetching queue", err);
      }
    };
    
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
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

  const getPetImage = (species) => {
    switch (species?.toLowerCase()) {
      case 'kucing': return catImage;
      case 'anjing': return dogImage;
      case 'burung': return birdImage;
      default: return catImage;
    }
  };

  // Effect for Carousel Rotation
  useEffect(() => {
    const activeCount = appointments.filter(a => a.status === 'Dalam Periksa').length;
    if (activeCount <= 1) return;
    const interval = setInterval(() => {
      setCurrentCallIndex((prevIndex) => (prevIndex + 1) % activeCount);
    }, 6000); // Rotate every 6 seconds
    return () => clearInterval(interval);
  }, [appointments]);

  // Find current call: only 'Dalam Periksa', sorted by updated_at ascending (oldest called first)
  const activeCalls = appointments
    .filter(a => a.status === 'Dalam Periksa')
    .sort((a, b) => new Date(a.updated_at) - new Date(b.updated_at));

  // 15-Minute Preparation Logic
  let isPreparationMode = false;
  let preparationSessionTime = '';

  if (activeCalls.length > 0) {
    const sessionTimeStr = activeCalls[0].schedule_time;
    const [hourStr] = sessionTimeStr.split(':');
    const sessionHour = parseInt(hourStr, 10);
    
    const currentH = currentTime.getHours();
    const currentM = currentTime.getMinutes();
    
    if ((currentH === sessionHour && currentM >= 45) || currentH > sessionHour) {
      isPreparationMode = true;
      preparationSessionTime = `${(sessionHour + 1).toString().padStart(2, '0')}:00`;
    }
  }

  // Find next queue: 'Disetujui' or ('Menunggu' && 'Walk-in')
  const waitingQueue = appointments
    .filter(a => a.status === 'Disetujui' || (a.status === 'Menunggu' && a.booking_type === 'Walk-in'))
    .sort((a, b) => a.schedule_time.localeCompare(b.schedule_time));

  let currentCall = null;
  let nextQueue = waitingQueue.map(a => ({
    id: a.queue_number,
    petName: a.pet?.name || '-',
    species: a.pet?.species || '-',
    doctor: a.doctor?.name || 'Dokter Umum',
    image: getPetImage(a.pet?.species)
  }));

  if (!isPreparationMode && activeCalls.length > 0) {
    const validIndex = currentCallIndex < activeCalls.length ? currentCallIndex : 0;
    const active = activeCalls[validIndex];
    currentCall = {
      id: active.queue_number,
      petName: active.pet?.name || '-',
      species: active.pet?.species || '-',
      owner: active.owner?.name || '-',
      doctor: active.doctor?.name || 'Dokter Umum',
      image: getPetImage(active.pet?.species),
      totalCalls: activeCalls.length,
      currentIndex: validIndex + 1
    };
  }

  // Effect to trigger text-to-speech for all newly called patients
  useEffect(() => {
    if (activeCalls.length > 0 && 'speechSynthesis' in window) {
      const newIds = new Set(announcedIds);
      let hasNew = false;
      
      activeCalls.forEach(call => {
        if (!newIds.has(call.queue_number)) {
          const queueNumberSpoken = call.queue_number.split('-').pop().split('').join(' ');
          const docName = call.doctor?.name?.replace('Drh. ', '') || 'umum';
          const text = `Nomor antrean, ${queueNumberSpoken}, pasien atas nama ${call.pet?.name || 'Hewan'}, silakan menuju ruang pemeriksaan dokter ${docName}.`;
          
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'id-ID';
          utterance.rate = 0.85; 
          
          window.speechSynthesis.speak(utterance);
          
          newIds.add(call.queue_number);
          hasNew = true;
        }
      });

      if (hasNew) {
        setAnnouncedIds(newIds);
      }
    }
  }, [activeCalls, announcedIds]);

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
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative">
              
              {isPreparationMode ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-800">
                  <div className="bg-blue-100 text-blue-600 p-4 rounded-full mb-6">
                    <Clock className="h-16 w-16 animate-pulse" />
                  </div>
                  <h3 className="text-3xl font-black mb-2 text-slate-800">Persiapan Sesi Berikutnya</h3>
                  <p className="text-xl font-medium text-slate-500">
                    Sesi Jam <span className="font-bold text-blue-600">{preparationSessionTime}</span> akan segera dipanggil.
                  </p>
                </div>
              ) : currentCall ? (
                <>
                  <div className="absolute top-6 right-6 bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-sm font-bold border border-slate-200">
                    {currentCall.currentIndex} dari {currentCall.totalCalls} Panggilan
                  </div>
                  <div className="mb-4 mt-8">
                    <span className={`inline-block px-12 py-3 rounded-2xl text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-tight break-all border-2 shadow-md ${
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

                  {/* Doctor Info */}
                  <div className={`w-full max-w-lg rounded-2xl p-5 border shadow-inner flex flex-col items-center gap-2 mt-auto ${
                    isFullscreen 
                      ? 'bg-[#1E293B]/50 border-slate-800' 
                      : 'bg-slate-50 border-slate-100'
                  }`}>
                    <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Pemeriksaan Oleh</span>
                    <div className="text-3xl font-extrabold text-teal-500 bg-teal-500/10 px-8 py-3 rounded-xl border border-teal-500/20 w-full text-center">
                      {currentCall.doctor}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-60">
                  <Heart className="h-24 w-24 mb-4" />
                  <p className="text-xl font-bold">Belum ada pasien</p>
                </div>
              )}
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
              {nextQueue.slice(0, 4).map((item, index) => (
                <div 
                  key={index} 
                  className={`rounded-xl p-3 border flex items-center gap-4 transition-all duration-300 ${
                    isFullscreen 
                      ? 'bg-[#1F2937]/50 border-slate-800/80 hover:bg-[#1F2937]' 
                      : 'bg-slate-50 border-slate-100 hover:bg-slate-100/70'
                  }`}
                >
                  {/* Nomor Antrean */}
                  <div className={`w-12 h-12 flex items-center justify-center rounded-xl font-black text-xs md:text-sm shadow-inner break-words ${
                    isFullscreen ? 'bg-[#111827] text-teal-400' : 'bg-white text-slate-850 border border-slate-200'
                  }`}>
                    {item.id.split('-').pop()}
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
              
              {nextQueue.length > 4 && (
                <div className="text-center pt-2 text-slate-450 font-medium text-[11px] flex justify-center items-center gap-1.5">
                  Ada {nextQueue.length - 4} antrian lainnya di belakang <ArrowRight className="h-3 w-3" />
                </div>
              )}
              {nextQueue.length === 0 && (
                <div className="text-center pt-4 text-slate-400 text-sm font-medium">
                  Tidak ada antrean berikutnya.
                </div>
              )}
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
