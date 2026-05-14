import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const InfoLayanan = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -current.offsetWidth / 2 : current.offsetWidth / 2;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const doctors = [
    {
      name: "Drh. Ananda Pratama",
      specialty: "Spesialis Hewan Kecil (Anjing & Kucing)",
      schedule: "Senin - Kamis (08:00 - 15:00)",
      image: "https://i.pravatar.cc/400?u=vet1"
    },
    {
      name: "Drh. Budi Santoso, M.Vet",
      specialty: "Ahli Bedah & Ortopedi Hewan",
      schedule: "Rabu - Minggu (10:00 - 18:00)",
      image: "https://i.pravatar.cc/400?u=vet2"
    },
    {
      name: "Drh. Citra Lestari",
      specialty: "Spesialis Hewan Eksotis",
      schedule: "Selasa - Sabtu (09:00 - 16:00)",
      image: "https://i.pravatar.cc/400?u=vet3"
    },
    {
      name: "Drh. Dimas Anggara",
      specialty: "Perawatan Gigi Hewan",
      schedule: "Senin, Rabu, Jumat (13:00 - 20:00)",
      image: "https://i.pravatar.cc/400?u=vet4"
    },
    {
      name: "Drh. Elena Putri",
      specialty: "Ahli Dermatologi Hewan",
      schedule: "Kamis - Minggu (08:00 - 14:00)",
      image: "https://i.pravatar.cc/400?u=vet5"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-600 flex flex-col">
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
              <span className="text-2xl font-bold text-blue-900">Zeta Connect</span>
            </Link>
            <Link to="/" className="text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-2">
              <i className="fa-solid fa-arrow-left"></i> Kembali ke Beranda
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-4 block">Informasi Lengkap</span>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">Layanan & Fasilitas Klinik</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Kami menyediakan berbagai layanan medis, fasilitas modern, serta tim dokter hewan profesional yang siap membantu merawat hewan peliharaan Anda.</p>
          </div>

          {/* Layanan Medis Section */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <i className="fa-solid fa-notes-medical text-blue-600"></i> Daftar Layanan Medis
            </h2>
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
          <div className="mb-20">
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

          {/* Profil Dokter Section */}
          <div className="mb-20 relative">
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <i className="fa-solid fa-user-doctor text-blue-600"></i> Profil & Jadwal Dokter
              </h2>
              <div className="hidden md:flex gap-3">
                <button onClick={() => scroll('left')} className="w-12 h-12 rounded-full border border-slate-200 bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-600 hover:shadow-md transition-all">
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
                <button onClick={() => scroll('right')} className="w-12 h-12 rounded-full border border-slate-200 bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-600 hover:shadow-md transition-all">
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>

            <div 
              ref={scrollRef}
              className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scroll-smooth" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {doctors.map((doc, index) => (
                <div key={index} className="min-w-[85vw] sm:min-w-[calc(50%-12px)] md:min-w-[calc(33.333%-16px)] snap-start bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all flex-shrink-0">
                  <div className="h-64 overflow-hidden relative p-2">
                    <div className="w-full h-full rounded-3xl overflow-hidden relative">
                      <img src={doc.image} alt={doc.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <span className="inline-block px-3 py-1 bg-blue-600/80 backdrop-blur-sm rounded-full text-xs font-semibold mb-2">{doc.specialty}</span>
                        <h3 className="text-xl font-bold">{doc.name}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 pt-4">
                    <div className="bg-slate-50 p-4 rounded-2xl flex items-start gap-3 text-sm text-slate-600 border border-slate-100">
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
            
            {/* Custom Scrollbar CSS hiding */}
            <style jsx="true">{`
              .flex::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          </div>

        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm mt-auto">
        <p>&copy; {new Date().getFullYear()} Zeta Connect. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default InfoLayanan;
