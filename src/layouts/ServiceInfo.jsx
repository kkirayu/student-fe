// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import dokter1 from '../assets/doctor_img/dokter1.webp';
import dokter2 from '../assets/doctor_img/dokter2.webp';
import dokter3 from '../assets/doctor_img/dokter3.webp';
import dokter4 from '../assets/doctor_img/dokter4.webp';
import dokter5 from '../assets/doctor_img/dokter5.webp';
import dokter6 from '../assets/doctor_img/dokter6.webp';
import dokter7 from '../assets/doctor_img/dokter7.webp';
import dokter8 from '../assets/doctor_img/dokter8.webp';
import dokter9 from '../assets/doctor_img/dokter9.webp';

const imageMap = {
  "/src/assets/doctor_img/dokter1.webp": dokter1,
  "/src/assets/doctor_img/dokter2.webp": dokter2,
  "/src/assets/doctor_img/dokter3.webp": dokter3,
  "/src/assets/doctor_img/dokter4.webp": dokter4,
  "/src/assets/doctor_img/dokter5.webp": dokter5,
  "/src/assets/doctor_img/dokter6.webp": dokter6,
  "/src/assets/doctor_img/dokter7.webp": dokter7,
  "/src/assets/doctor_img/dokter8.webp": dokter8,
  "/src/assets/doctor_img/dokter9.webp": dokter9,
};

const petTipsMetadata = [
  { category: "Kucing", icon: "fa-cat", color: "text-amber-600 bg-amber-50" },
  { category: "Anjing", icon: "fa-dog", color: "text-blue-600 bg-blue-50" },
  { category: "Kelinci", icon: "fa-rabbit", color: "text-emerald-600 bg-emerald-50" },
  { category: "Kesehatan", icon: "fa-heart-pulse", color: "text-rose-600 bg-rose-50" },
  { category: "Nutrisi", icon: "fa-apple-whole", color: "text-orange-600 bg-orange-50" },
];

const InfoLayanan = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  const daysMap = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const todayString = daysMap[new Date().getDay()];

  const [selectedDay, setSelectedDay] = useState(todayString);
  const [selectedSpecialty, setSelectedSpecialty] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState('');

  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  const [tips, setTips] = useState([]);
  const [loadingTips, setLoadingTips] = useState(true);
  const [errorTips, setErrorTips] = useState(null);
  const [selectedTip, setSelectedTip] = useState(null);
  const tipsContainerRef = useRef(null);
  const isHoveredTips = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        setLoadingTips(true);
        const response = await axios.get('http://127.0.0.1:8000/api/pet-tips');
        setTips(response.data);
      } catch (err) {
        console.error("Error fetching tips:", err);
        setErrorTips("Gagal memuat tips kesehatan dari API.");
      } finally {
        setLoadingTips(false);
      }
    };

    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        const response = await axios.get('http://127.0.0.1:8000/api/doctors');
        setDoctors(response.data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchTips();
    fetchDoctors();
  }, []);

  useEffect(() => {
    const container = tipsContainerRef.current;
    if (!container || tips.length === 0) return;

    const handleLoop = () => {
      const children = container.children;
      const firstSetLength = tips.length;
      if (children.length <= firstSetLength) return;

      const loopStartOffset = children[firstSetLength].offsetLeft - children[0].offsetLeft;

      if (container.scrollLeft >= loopStartOffset) {
        container.scrollLeft -= loopStartOffset;
      }
    };
    
    container.addEventListener('scroll', handleLoop);
    return () => container.removeEventListener('scroll', handleLoop);
  }, [tips]);

  useEffect(() => {
    const container = tipsContainerRef.current;
    if (!container || tips.length === 0) return;

    const interval = setInterval(() => {
      if (!isHoveredTips.current && container.children.length > 1) {
        const itemWidth = container.children[1].offsetLeft - container.children[0].offsetLeft;
        container.scrollBy({ left: itemWidth, behavior: 'smooth' });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [tips]);

  // Dummy data removed. Doctors are now fetched from API.

  const specialties = ["Semua", ...new Set(doctors.map(doc => doc.spesialisasi))];
  const allDays = ["Semua", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

  const sessionToTime = {
    "Sesi 1": "08.00 - 10.00",
    "Sesi 2": "10.00 - 12.00",
    "Sesi 3": "13.00 - 15.00",
    "Sesi 4": "15.00 - 17.00",
    "Sesi 5": "18.30 - 20.30"
  };

  const filteredDoctors = doctors.filter(doc => {
    const docDays = doc.schedules ? [...new Set(doc.schedules.map(s => s.hari_praktik))] : [];
    const matchDay = selectedDay === "Semua" || docDays.includes(selectedDay);
    const matchSpecialty = selectedSpecialty === "Semua" || doc.spesialisasi === selectedSpecialty;
    const matchSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDay && matchSpecialty && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-600 flex flex-col">
      <style jsx="true">{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Navbar */}
      <header>
        <nav
          className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
              ? 'bg-white/90 backdrop-blur-md shadow-sm py-3'
              : 'bg-transparent py-5'
            }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <Link to="/" className="flex items-center gap-2 cursor-pointer">
                <div className="bg-blue-600 text-white w-10 h-10 flex items-center justify-center rounded-xl">
                  <i className="fa-solid fa-stethoscope text-xl"></i>
                </div>
                <span className="text-2xl font-bold text-blue-900">Zeta Pet Care</span>
              </Link>
              <Link to="/" className="text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-2">
                <i className="fa-solid fa-arrow-left"></i> Kembali ke Beranda
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Jadwal Praktik Dokter</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Temukan jadwal dokter yang tersedia hari ini dan buat rencana kunjungan untuk hewan kesayangan Anda dengan mudah.
            </p>
          </div>

          <form 
            className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Cari Nama Dokter */}
            <div className="w-full">
              <span className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 block"><i className="fa-solid fa-magnifying-glass text-blue-600 mr-2"></i> Cari Dokter</span>
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <i className="fa-solid fa-user-doctor text-slate-400"></i>
                </div>
                <input 
                  type="text" 
                  placeholder="Cari nama dokter..." 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-sm font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Hari */}
            <div className="w-full">
              <span className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 block"><i className="fa-regular fa-calendar-days text-blue-600 mr-2"></i> Filter Hari</span>
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <i className="fa-regular fa-calendar text-slate-400"></i>
                </div>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl pl-11 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-sm font-medium appearance-none cursor-pointer"
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                >
                  {allDays.map(day => (
                    <option key={day} value={day}>{day === todayString && day !== "Semua" ? `${day} (Hari Ini)` : day}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <i className="fa-solid fa-chevron-down text-slate-400 text-xs"></i>
                </div>
              </div>
            </div>
            
            {/* Filter Spesialisasi */}
            <div className="w-full">
              <span className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 block"><i className="fa-solid fa-stethoscope text-blue-600 mr-2"></i> Spesialisasi</span>
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <i className="fa-solid fa-stethoscope text-slate-400"></i>
                </div>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl pl-11 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-sm font-medium appearance-none cursor-pointer"
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                >
                  {specialties.map(spec => (
                    <option key={spec} value={spec}>{spec === "Semua" ? "Semua Spesialisasi" : spec}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <i className="fa-solid fa-chevron-down text-slate-400 text-xs"></i>
                </div>
              </div>
            </div>
          </form>

          {/* Doctor Cards */}
          <div className="mb-24 relative">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {selectedDay === todayString ? "Dokter Tersedia Hari Ini" : 
                  selectedDay === "Semua" ? "Semua Dokter" : 
                  `Dokter Tersedia di Hari ${selectedDay}`}
              </h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                {filteredDoctors.length} Dokter
              </span>
            </div>

            {loadingDoctors ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-slate-500 font-medium animate-pulse">Memuat data dokter...</p>
              </div>
            ) : filteredDoctors.length > 0 ? (
              <div 
                className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar" 
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {filteredDoctors.map((doc, index) => (
                  <div key={index} className="min-w-[85vw] sm:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] snap-start bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col flex-shrink-0">
                    <div className="h-64 overflow-hidden relative p-2">
                      <div className="w-full h-full rounded-3xl overflow-hidden relative">
                        <img src={imageMap[doc.image] || doc.image} alt={doc.name} className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <span className="inline-block px-3 py-1 bg-blue-600/80 backdrop-blur-sm rounded-full text-xs font-semibold mb-2">{doc.spesialisasi}</span>
                          <h3 className="text-xl font-bold">{doc.name}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-300">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-user-doctor text-3xl text-slate-300"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Tidak ada dokter tersedia</h3>
                <p className="text-slate-500 max-w-md mx-auto">Maaf, tidak ada dokter dengan spesialisasi tersebut yang tersedia pada hari yang dipilih. Silakan ubah filter pencarian Anda.</p>
                <button 
                  onClick={() => { setSelectedDay("Semua"); setSelectedSpecialty("Semua"); setSearchQuery(""); }}
                  className="mt-6 px-6 py-2.5 bg-blue-50 text-blue-600 font-medium rounded-xl hover:bg-blue-100 transition-colors inline-flex items-center gap-2"
                >
                  <i className="fa-solid fa-rotate-right"></i> Reset Filter
                </button>
              </div>
            )}
          </div>

          {/* Tips Kesehatan Hewan */}
          <div className="border-t border-slate-200 pt-20 mb-20">
            <div className="text-center mb-12">
              <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-4 block">Edukasi Peliharaan</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Tips Kesehatan Peliharaan</h2>
            </div>

            {loadingTips ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4 animate-duration-1000"></div>
                <p className="text-slate-500 font-medium animate-pulse">Mengambil data artikel dari API...</p>
              </div>
            ) : tips.length > 0 ? (
              <div 
                ref={tipsContainerRef}
                onMouseEnter={() => isHoveredTips.current = true}
                onMouseLeave={() => isHoveredTips.current = false}
                onTouchStart={() => isHoveredTips.current = true}
                onTouchEnd={() => isHoveredTips.current = false}
                className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar relative" 
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {[...tips, ...tips].map((tip, idx) => {
                  const meta = petTipsMetadata[idx % petTipsMetadata.length];
                  return (
                    <div 
                      key={`${tip.id}-${idx}`} 
                      className="w-[85vw] md:w-[calc(50%-12px)] lg:w-[calc(33.333333%-16px)] snap-start bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between flex-shrink-0"
                    >
                      <div>
                        {/* Header card */}
                        <div className="flex justify-between items-center mb-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${meta.color}`}>
                            {meta.category}
                          </span>
                          <span className="text-xs font-semibold text-slate-400">Tips #{tip.id}</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-3 line-clamp-2 capitalize hover:text-blue-600 transition-colors">
                          {tip.title}
                        </h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-4 text-justify">
                          {tip.body}
                        </p>
                      </div>
                      
                      <div className="border-t border-slate-50 pt-4 flex justify-between items-center text-xs text-slate-400">
                        <span className="flex items-center gap-1.5 font-medium">
                          <i className={`fa-solid ${meta.icon} text-blue-600`}></i> Zeta Pet Care Edu
                        </span>
                        <span 
                          onClick={() => setSelectedTip({...tip, meta})}
                          className="hover:text-blue-600 font-bold cursor-pointer transition-colors flex items-center gap-1"
                        >
                          Baca Selengkapnya <i className="fa-solid fa-arrow-right text-[10px]"></i>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-[2rem] border border-dashed border-slate-300">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-book-medical text-3xl text-slate-300"></i>
                </div>
                <p className="text-slate-500 font-medium">Belum ada tips kesehatan tersedia.</p>
              </div>
            )}
          </div>

          {/* Other Info */}
          <div className="border-t border-slate-200 pt-20">
            <div className="text-center mb-16">
              <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-4 block">Informasi Tambahan</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">Layanan & Fasilitas Klinik</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">Selain tim dokter hewan yang profesional, kami juga menyediakan berbagai layanan medis dan fasilitas modern untuk memastikan perawatan terbaik.</p>
            </div>

            {/* Layanan Medis Section */}
            <div className="mb-20">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: 'Konsultasi & Pemeriksaan', desc: 'Pemeriksaan kesehatan menyeluruh untuk mendeteksi dini masalah kesehatan pada hewan peliharaan Anda.', icon: 'fa-user-doctor' },
                  { title: 'Vaksinasi Lengkap', desc: 'Program vaksinasi rutin untuk anjing, kucing, dan hewan lainnya untuk mencegah virus berbahaya.', icon: 'fa-syringe' },
                  { title: 'Tindakan Bedah', desc: 'Layanan operasi minor hingga mayor dengan peralatan bedah steril dan anestesi yang aman.', icon: 'fa-band-aid' },
                  { title: 'Perawatan Gigi', desc: 'Pembersihan karang gigi (scaling) dan pencabutan gigi untuk menjaga kebersihan mulut hewan.', icon: 'fa-tooth' },
                  { title: 'Rawat Inap', desc: 'Fasilitas rawat inap intensif bagi hewan yang membutuhkan observasi dan perawatan medis lanjutan.', icon: 'fa-bed-pulse' },
                  { title: 'Layanan Darurat 24 Jam', desc: 'Penanganan cepat dan tepat untuk kondisi gawat darurat yang mengancam nyawa pasien.', icon: 'fa-truck-medical' }
                ].map((service, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 text-xl">
                      <i className={`fa-solid ${service.icon}`}></i>
                    </div>
                    <h3 className="font-bold text-lg text-slate-800 mb-2">{service.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed text-justify">{service.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Fasilitas Klinik */}
            <div className="mb-10">
              <div className="bg-blue-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/4"></div>
                <h2 className="text-2xl font-bold mb-8 relative z-10 flex items-center gap-3">
                  <i className="fa-solid fa-hospital"></i> Fasilitas Klinik Kami
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                  <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-sm">
                    <i className="fa-solid fa-x-ray text-2xl"></i>
                    <span className="font-semibold">Digital X-Ray</span>
                  </div>
                  <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-sm">
                    <i className="fa-solid fa-vial-circle-check text-2xl"></i>
                    <span className="font-semibold">Laboratorium Darah</span>
                  </div>
                  <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-sm">
                    <i className="fa-solid fa-bath text-2xl"></i>
                    <span className="font-semibold">Ruang Grooming</span>
                  </div>
                  <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-sm">
                    <i className="fa-solid fa-shop text-2xl"></i>
                    <span className="font-semibold">Pet Shop & Apotek</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm mt-auto">
        <p>&copy; {new Date().getFullYear()} Zeta Connect. All rights reserved.</p>
      </footer>

      {/* Tip Modal */}
      {selectedTip && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedTip(null)}></div>
          <div className="bg-white rounded-3xl w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-fade-in-up">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedTip.meta.color}`}>
                  <i className={`fa-solid ${selectedTip.meta.icon} text-lg`}></i>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{selectedTip.meta.category}</span>
                  <h3 className="font-bold text-slate-800 leading-tight">Detail Tips</h3>
                </div>
              </div>
              <button onClick={() => setSelectedTip(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <div className="p-6 md:p-8 overflow-y-auto hide-scrollbar">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 capitalize">{selectedTip.title}</h2>
              <div className="prose prose-slate prose-blue max-w-none">
                <p className="text-slate-600 leading-relaxed text-justify whitespace-pre-line">
                  {selectedTip.body}
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-slate-50 bg-slate-50/50 flex justify-end">
              <button onClick={() => setSelectedTip(null)} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors focus:outline-none">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoLayanan;
