// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { Volume2, Clock, Calendar, Heart, ArrowRight } from 'lucide-react';
import catImage from '../../assets/animals/cat.webp';
import dogImage from '../../assets/animals/dog.webp';
import birdImage from '../../assets/animals/bird.webp';

const QueueMonitor = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col overflow-hidden">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm px-8 py-4 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-blue-600 to-teal-400 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
            <Heart className="h-8 w-8 text-white" fill="currentColor" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-700 to-teal-600 bg-clip-text text-transparent">
              Zeta Pet Care
            </h1>
            <p className="text-slate-500 font-medium text-sm">Klinik Hewan & Perawatan</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-slate-600 font-medium bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
            <Calendar className="h-5 w-5 text-teal-500" />
            <span>{formatDate(currentTime)}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-800 font-bold text-2xl bg-white px-5 py-2 rounded-full shadow-sm border border-slate-100 min-w-[140px] justify-center">
            <Clock className="h-6 w-6 text-blue-600" />
            <span>{formatTime(currentTime)}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex p-8 gap-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[50%] bg-blue-300/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[60%] bg-teal-300/20 rounded-full blur-3xl"></div>
        </div>

        {/* Current Call */}
        <section className="flex-[3] flex flex-col">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl overflow-hidden flex flex-col h-full relative group transition-all duration-500">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 flex items-center justify-between text-white">
              <h2 className="text-3xl font-bold tracking-wide flex items-center gap-3">
                <Volume2 className="h-8 w-8 animate-pulse" />
                PANGGILAN SAAT INI
              </h2>
              <span className="bg-white/20 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wider">
                HARAP MENUJU RUANGAN
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center relative z-10">
              
              <div className="mb-8">
                <div className="inline-block bg-blue-100 text-blue-800 px-16 py-6 rounded-[2rem] text-8xl font-black tracking-widest border-4 border-blue-200 shadow-2xl">
                  {currentCall.id}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-6 mb-10 w-full px-8">
                <img 
                  src={currentCall.image} 
                  alt={currentCall.petName} 
                  className="w-60 h-60 rounded-full object-cover border-8 border-white shadow-2xl flex-shrink-0"
                />
                
                <div className="text-center flex flex-col items-center">
                  <h3 className="text-7xl xl:text-[6rem] font-black text-slate-800 tracking-tight leading-tight mb-4">
                    {currentCall.petName}
                  </h3>
                  <div className="bg-slate-100 inline-block px-8 py-3 rounded-full border border-slate-200 shadow-sm">
                    <p className="text-3xl text-slate-600 font-semibold">
                      Pemilik: <span className="text-slate-800">{currentCall.owner}</span> 
                      <span className="text-slate-400 mx-3">|</span> 
                      <span className="text-teal-600">{currentCall.species}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-3xl bg-slate-50 rounded-[2.5rem] p-10 border-2 border-slate-100 shadow-lg flex flex-col items-center gap-6 mt-auto">
                <div className="text-slate-500 font-bold text-2xl uppercase tracking-[0.2em]">Silakan Menuju</div>
                <div className="text-7xl font-extrabold text-teal-600 bg-teal-50 px-12 py-8 rounded-3xl border-2 border-teal-100 w-full text-center shadow-inner">
                  {currentCall.room}
                </div>
                <div className="text-4xl font-semibold text-slate-700 mt-2">
                  Bersama {currentCall.doctor}
                </div>
              </div>
            </div>

            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-gradient-to-br from-blue-100 to-transparent rounded-full opacity-50"></div>
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-gradient-to-br from-teal-100 to-transparent rounded-full opacity-50"></div>
          </div>
        </section>

        {/* Next in Queue & Info */}
        <section className="flex-[2] flex flex-col gap-6">
          
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl overflow-hidden flex-1 flex flex-col">
            <div className="bg-slate-800 p-5 flex items-center gap-3 text-white">
              <Clock className="h-6 w-6 text-teal-400" />
              <h2 className="text-xl font-bold">ANTRIAN SELANJUTNYA</h2>
            </div>
            
            <div className="p-5 flex-1 flex flex-col justify-around gap-4">
              {nextQueue.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-[1.5rem] p-5 border border-slate-100 shadow-md flex items-center gap-6 transition-transform hover:-translate-y-1"
                >
                  <div className="bg-slate-100 text-slate-800 w-24 h-24 flex items-center justify-center rounded-2xl font-black text-4xl shadow-inner">
                    {item.id.split('-')[1]}
                  </div>
                  
                  <img 
                    src={item.image} 
                    alt={item.petName} 
                    className="w-20 h-20 rounded-full object-cover border-4 border-slate-50 shadow-sm flex-shrink-0 hidden xl:block"
                  />
                  
                  <div className="flex-1">
                    <h4 className="text-3xl font-bold text-slate-800 mb-1">{item.petName}</h4>
                    <p className="text-slate-500 text-xl font-medium">{item.species}</p>
                  </div>
                  
                  <div className="text-right flex flex-col items-end gap-2">
                    <span className="text-sm font-bold text-teal-600 bg-teal-50 px-5 py-2 rounded-full uppercase tracking-wider border border-teal-100">
                      Menunggu
                    </span>
                    <p className="text-slate-600 text-xl font-medium">{item.doctor}</p>
                  </div>
                </div>
              ))}
              
              <div className="mt-auto pt-4 flex justify-center text-slate-400 font-medium text-sm gap-2 items-center">
                Ada 12 antrian lainnya di belakang <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl p-6 shadow-lg text-white relative overflow-hidden h-48 flex items-center">
            <div className="absolute right-0 top-0 opacity-10">
              <Heart className="h-48 w-48 -mr-10 -mt-10" fill="currentColor" />
            </div>
            
            <div className="relative z-10 w-full">
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
                Tips Kesehatan Hewan
              </span>
              <h3 className="text-xl font-bold leading-tight mb-2">
                Jangan lupa berikan vaksin tahunan untuk anabul kesayangan Anda!
              </h3>
              <p className="text-teal-100 text-sm">
                Vaksinasi rutin mencegah berbagai penyakit virus berbahaya. Tanyakan jadwal vaksin pada dokter hewan kami.
              </p>
            </div>
          </div>

        </section>
      </main>

    </div>
  );
};

export default QueueMonitor;
