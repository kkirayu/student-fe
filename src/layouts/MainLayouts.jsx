// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import kucingImg from '../assets/animals/cat.webp';
import anjingImg from '../assets/animals/dog.webp';
import kelinciImg from '../assets/animals/rabbit.webp';
import hamsterImg from '../assets/animals/hamster.webp';
import burungImg from '../assets/animals/bird.webp';
import homeBgImg from '../assets/home_bg.webp';
import aboutUsBgImg from '../assets/about_us.webp';

const MainLayouts = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeAnimalIndex, setActiveAnimalIndex] = useState(0);
  const [isAnimalHovered, setIsAnimalHovered] = useState(false);

  const animals = [
    { name: 'Kucing', image: kucingImg },
    { name: 'Anjing', image: anjingImg },
    { name: 'Kelinci', image: kelinciImg },
    { name: 'Hamster', image: hamsterImg },
    { name: 'Burung', image: burungImg }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAnimalHovered) return;

    const interval = setInterval(() => {
      setActiveAnimalIndex((prev) => (prev === animals.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [animals.length, isAnimalHovered]);

  const navigate = useNavigate();

  const handleNavClick = (id) => {
    setIsMobileMenuOpen(false);
    if (id === 'feedback') {
      navigate('/feedback');
    } else if (id === 'info-layanan') {
      navigate('/info-layanan');
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navLinks = [
    { name: 'Beranda', id: 'home' },
    { name: 'Tentang Kami', id: 'about-us' },
    { name: 'Layanan Kami', id: 'layanan' },
    { name: 'Daftar Hewan', id: 'list-hewan' },
    { name: 'Informasi Layanan', id: 'info-layanan' },
    { name: 'Umpan Balik', id: 'feedback' }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-600">

      {/* Navbar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-sm py-3'
            : 'bg-transparent py-5'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="bg-blue-600 text-white w-10 h-10 flex items-center justify-center rounded-xl">
                <i className="fa-solid fa-stethoscope text-xl"></i>
              </div>
              <span className="text-2xl font-bold text-blue-900">Zeta Pet Care</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
                >
                  {link.name}
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="bg-blue-600 text-white px-6 py-2.5 rounded-3xl font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">
                Masuk
              </Link>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
                <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-2xl`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 p-4 flex flex-col space-y-4 shadow-xl">
            {navLinks.map((link) => (
              <button key={link.id} onClick={() => handleNavClick(link.id)} className="text-left text-slate-600 font-medium py-2">
                {link.name}
              </button>
            ))}
            <Link to="/login" className="text-center font-semibold text-white bg-blue-600 py-2 rounded-3xl">Masuk</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex items-center justify-center min-h-[90vh]">
        <div className="absolute inset-0 z-0">
          <img
            src={homeBgImg}
            alt="Veterinary Background"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#F8FAFC]"></div>
        </div>

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-right w-full flex flex-col items-end">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm mb-6 border border-blue-200 shadow-sm">
            Klinik Hewan Terpercaya
          </span>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 mb-8 leading-tight">
            Perawatan Medis Terbaik <br />
            <span className="text-blue-600">Untuk Hewan Kesayangan Anda</span>
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl leading-relaxed">
            Klinik Zeta Pet Care hadir dengan dokter hewan berpengalaman dan fasilitas modern untuk memastikan kesehatan, kenyamanan, dan kebahagiaan peliharaan Anda.
          </p>
          <div className="flex flex-col sm:flex-row justify-end gap-4 w-full">
            <Link to="/register" className="bg-blue-600 text-white px-8 py-4 rounded-3xl font-bold text-lg hover:bg-blue-700 shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2">
              Daftar Sekarang
            </Link>
            <button onClick={() => handleNavClick('layanan')} className="bg-white/80 backdrop-blur-sm text-slate-700 border border-slate-200 px-8 py-4 rounded-3xl font-bold text-lg hover:bg-white flex items-center justify-center gap-2 transition-colors">
              Layanan Kami
            </button>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about-us" className="relative py-32 bg-blue-50/50 overflow-hidden flex items-center min-h-[60vh]">
        <div className="absolute inset-0 z-0 bg-blue-50">
          <img
            src={aboutUsBgImg}
            alt="About Us Background"
            className="w-full h-full object-cover opacity-40 mix-blend-multiply"
          />
          <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-blue-50 to-transparent"></div>
          <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-blue-50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-blue-50/90 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-4 block">Tentang Kami</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Mendedikasikan Diri untuk <br/>
              <span className="text-blue-600">Kesejahteraan Hewan</span>
            </h2>

            <p className="text-lg text-slate-700 leading-relaxed text-justify">
              Kisah Zeta Pet Care bermula dari kepedulian mendalam terhadap ikatan antara manusia dan hewan peliharaannya. Kami melihat kebutuhan akan layanan kesehatan hewan yang tidak hanya ahli secara medis, tapi juga penuh empati. Sejak saat itu, kami terus berkembang menjadi rumah kedua bagi setiap hewan yang membutuhkan pertolongan.
            </p>
          </div>
        </div>
      </section>

      {/* Layanan Section */}
      <section id="layanan" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Layanan Unggulan Kami</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Layanan kesehatan menyeluruh untuk memastikan hewan peliharaan Anda selalu dalam kondisi prima.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-all group text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 mx-auto group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-stethoscope text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">PEMERIKSAAN HEWAN</h3>
              <p className="text-slate-600">Layanan konsultasi dan pemeriksaan medis komprehensif oleh dokter hewan berpengalaman.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-all group text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 mx-auto group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-house-chimney-medical text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">PENITIPAN HEWAN</h3>
              <p className="text-slate-600">Fasilitas rawat inap dan penitipan yang aman dan nyaman dengan pengawasan tenaga medis.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-all group text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 mx-auto group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-syringe text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">VAKSINASI HEWAN</h3>
              <p className="text-slate-600">Program vaksinasi rutin dan lengkap untuk mencegah penyakit pada hewan kesayangan Anda.</p>
            </div>
          </div>
        </div>
      </section>

      {/* List Hewan */}
      <section id="list-hewan" className="py-24 bg-blue-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">Jenis Hewan yang Kami Layani</h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Klinik Zeta Pet Care dilengkapi dengan fasilitas dan tenaga medis yang ahli dalam menangani berbagai jenis hewan kesayangan Anda dengan penuh kasih sayang.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 font-medium text-slate-700">
                <div className="bg-blue-600 text-white w-7 h-7 flex items-center justify-center rounded-full text-xs">
                  <i className="fa-solid fa-check"></i>
                </div>
                Pemeriksaan Spesifik per Spesies
              </div>
              <div className="flex items-center gap-3 font-medium text-slate-700">
                <div className="bg-blue-600 text-white w-7 h-7 flex items-center justify-center rounded-full text-xs">
                  <i className="fa-solid fa-check"></i>
                </div>
                Fasilitas Perawatan yang Nyaman
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 w-full">
            <div 
              className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100 max-w-md ml-auto text-center relative group"
              onMouseEnter={() => setIsAnimalHovered(true)}
              onMouseLeave={() => setIsAnimalHovered(false)}
            >
              {/* Card Slider */}
              <div className="overflow-hidden rounded-[1.5rem] aspect-[4/3] mb-6 bg-slate-100 relative">
                <img
                  src={animals[activeAnimalIndex].image}
                  alt={animals[activeAnimalIndex].name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                </div>
              </div>
              <h4 className="text-2xl font-bold text-slate-800 mb-6">{animals[activeAnimalIndex].name}</h4>

              <div className="flex justify-center gap-2 mb-2">
                {animals.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveAnimalIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${activeAnimalIndex === index ? 'bg-blue-600 w-8' : 'bg-slate-300 hover:bg-blue-400 w-2'
                      }`}
                    aria-label={`Lihat ${animals[index].name}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setActiveAnimalIndex((prev) => (prev === 0 ? animals.length - 1 : prev - 1))}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white w-12 h-12 rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:scale-110 transition-all z-10 opacity-0 group-hover:opacity-100"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <button
                onClick={() => setActiveAnimalIndex((prev) => (prev === animals.length - 1 ? 0 : prev + 1))}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white w-12 h-12 rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:scale-110 transition-all z-10 opacity-0 group-hover:opacity-100"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            
            <div>
              <div className="flex items-center gap-2 mb-6 text-white cursor-pointer">
                <div className="bg-blue-600 text-white w-10 h-10 flex items-center justify-center rounded-xl">
                  <i className="fa-solid fa-stethoscope text-xl"></i>
                </div>
                <span className="text-2xl font-bold">Zeta Pet Care</span>
              </div>
              <p className="leading-relaxed mb-6 text-sm">
                Klinik hewan terpercaya yang berdedikasi memberikan pelayanan medis terbaik, penuh kasih sayang, dan profesional untuk hewan kesayangan Anda.
              </p>
              <div className="flex gap-4">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 text-white transition-colors shadow-lg">
                  <i className="fa-brands fa-instagram"></i>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 text-white transition-colors shadow-lg">
                  <i className="fa-brands fa-facebook-f"></i>
                </a>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 text-white transition-colors shadow-lg">
                  <i className="fa-brands fa-x"></i>
                </a>
              </div>
            </div>

            <div className="md:w-fit md:mx-auto">
              <h4 className="text-white font-bold mb-6 text-lg tracking-wide">Hubungi Kami</h4>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start text-sm">
                  <i className="fa-solid fa-location-dot text-blue-500 mt-1"></i> 
                  <span>Jl. Sudirman No. 123, <br/>Jakarta Pusat, Indonesia 10220</span>
                </li>
                <li className="flex gap-3 items-center text-sm">
                  <i className="fa-solid fa-phone text-blue-500"></i> 
                  <span>+62 812-3456-7890</span>
                </li>
                <li className="flex gap-3 items-center text-sm">
                  <i className="fa-solid fa-envelope text-blue-500"></i> 
                  <span>callmeaja@zetaconnect.id</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 text-lg tracking-wide">Lokasi Kami</h4>
              <div className="w-full h-40 bg-slate-800 rounded-2xl overflow-hidden shadow-lg border border-slate-700">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126920.24036494916!2d106.76410408544922!3d-6.229746199999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f436b8c94b07%3A0x6ea6d5398b7c82f6!2sJakarta%20Pusat%2C%20Kota%20Jakarta%20Pusat%2C%20Daerah%20Khusus%20Ibukota%20Jakarta!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi Zeta Pet Care"
                ></iframe>
              </div>
            </div>

          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>&copy; {new Date().getFullYear()} Zeta Pet Care. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-blue-500 transition-colors">Syarat & Ketentuan</a>
              <a href="#" className="hover:text-blue-500 transition-colors">Kebijakan Privasi</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayouts;
