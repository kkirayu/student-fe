import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import dokter1 from '../assets/doctor_img/dokter1.webp';
import dokter2 from '../assets/doctor_img/dokter2.webp';
import dokter3 from '../assets/doctor_img/dokter3.webp';
import dokter4 from '../assets/doctor_img/dokter4.webp';
import dokter5 from '../assets/doctor_img/dokter5.webp';
import dokter6 from '../assets/doctor_img/dokter6.webp';
import dokter7 from '../assets/doctor_img/dokter7.webp';
import dokter8 from '../assets/doctor_img/dokter8.webp';
import dokter9 from '../assets/doctor_img/dokter9.webp';

const InfoLayanan = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  const daysMap = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const todayString = daysMap[new Date().getDay()];

  const [selectedDay, setSelectedDay] = useState(todayString);
  const [selectedSpecialty, setSelectedSpecialty] = useState("Semua");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const doctors = [
    {
      name: "Drh. Ananda Pratama",
      specialty: "Dokter Hewan Umum",
      schedule: "Senin, Selasa, Rabu (08:00 - 15:00)",
      days: ["Senin", "Selasa", "Rabu"],
      image: dokter2
    },
    {
      name: "Drh. Budi Santoso, M.Vet",
      specialty: "Ahli Bedah & Ortopedi",
      schedule: "Kamis, Jumat, Sabtu (10:00 - 18:00)",
      days: ["Kamis", "Jumat", "Sabtu"],
      image: dokter1
    },
    {
      name: "Drh. Citra Lestari",
      specialty: "Spesialis Penyakit Dalam",
      schedule: "Senin, Rabu, Jumat (09:00 - 16:00)",
      days: ["Senin", "Rabu", "Jumat"],
      image: dokter9
    },
    {
      name: "Drh. Dimas Anggara",
      specialty: "Perawatan Gigi & Mulut",
      schedule: "Selasa, Kamis, Sabtu (13:00 - 20:00)",
      days: ["Selasa", "Kamis", "Sabtu"],
      image: dokter3
    },
    {
      name: "Drh. Elena Putri, M.Si",
      specialty: "Dermatologi Veteriner",
      schedule: "Rabu, Jumat, Minggu (08:00 - 14:00)",
      days: ["Rabu", "Jumat", "Minggu"],
      image: dokter8
    },
    {
      name: "Drh. Faisal Rahman",
      specialty: "Dokter Hewan Umum",
      schedule: "Kamis, Jumat, Sabtu, Minggu (08:00 - 16:00)",
      days: ["Kamis", "Jumat", "Sabtu", "Minggu"],
      image: dokter5
    },
    {
      name: "Drh. Gita Savitri",
      specialty: "Spesialis Penyakit Dalam",
      schedule: "Selasa, Kamis, Sabtu (10:00 - 17:00)",
      days: ["Selasa", "Kamis", "Sabtu"],
      image: dokter7
    },
    {
      name: "Drh. Hendi Saputra, Sp.B.Vet",
      specialty: "Ahli Bedah & Ortopedi",
      schedule: "Senin, Selasa, Rabu (12:00 - 20:00)",
      days: ["Senin", "Selasa", "Rabu"],
      image: dokter4
    },
    {
      name: "Drh. Indah Permatasari",
      specialty: "Dokter Hewan Umum",
      schedule: "Senin - Jumat (15:00 - 21:00)",
      days: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"],
      image: dokter6
    }
  ];

  const specialties = ["Semua", ...new Set(doctors.map(doc => doc.specialty))];
  const allDays = ["Semua", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

  const filteredDoctors = doctors.filter(doc => {
    const matchDay = selectedDay === "Semua" || doc.days.includes(selectedDay);
    const matchSpecialty = selectedSpecialty === "Semua" || doc.specialty === selectedSpecialty;
    return matchDay && matchSpecialty;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-600 flex flex-col">
      <style jsx="true">{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Navbar */}
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

      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Jadwal Praktik Dokter</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Temukan jadwal dokter yang tersedia hari ini dan buat rencana kunjungan untuk hewan kesayangan Anda dengan mudah.
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-10 flex flex-col sm:flex-row gap-6 justify-between items-center">
            <div className="w-full sm:w-1/2">
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
                    <option key={day} value={day}>{day === todayString && day !== "Semua" ? `${day} (𝗛𝗮𝗿𝗶 𝗜𝗻𝗶)` : day}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <i className="fa-solid fa-chevron-down text-slate-400 text-xs"></i>
                </div>
              </div>
            </div>
            
            <div className="w-full sm:w-1/2 flex-shrink-0">
              <span className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 block"><i className="fa-solid fa-user-doctor text-blue-600 mr-2"></i> Spesialisasi</span>
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
          </div>

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

            {filteredDoctors.length > 0 ? (
              <div 
                className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar" 
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {filteredDoctors.map((doc, index) => (
                  <div key={index} className="min-w-[85vw] sm:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] snap-start bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col flex-shrink-0">
                    <div className="h-64 overflow-hidden relative p-2">
                      <div className="w-full h-full rounded-3xl overflow-hidden relative">
                        <img src={doc.image} alt={doc.name} className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <span className="inline-block px-3 py-1 bg-blue-600/80 backdrop-blur-sm rounded-full text-xs font-semibold mb-2">{doc.specialty}</span>
                          <h3 className="text-xl font-bold">{doc.name}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 pt-4 flex-grow flex flex-col justify-between">
                      <div className="bg-slate-50 p-4 rounded-2xl flex items-start gap-3 text-sm text-slate-600 border border-slate-100 group-hover:border-blue-100 group-hover:bg-blue-50/50 transition-colors">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <i className="fa-regular fa-calendar-check"></i>
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 mb-1">Jadwal Praktek</p>
                          <p className="leading-relaxed">{doc.schedule}</p>
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
                  onClick={() => { setSelectedDay("Semua"); setSelectedSpecialty("Semua"); }}
                  className="mt-6 px-6 py-2.5 bg-blue-50 text-blue-600 font-medium rounded-xl hover:bg-blue-100 transition-colors inline-flex items-center gap-2"
                >
                  <i className="fa-solid fa-rotate-right"></i> Reset Filter
                </button>
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
    </div>
  );
};

export default InfoLayanan;
