import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Popup from '../components/Popup';

const Feedback = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    type: 'Pujian', 
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [popup, setPopup] = useState({ isOpen: false, type: '', title: '', message: '', onConfirm: null });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const token = localStorage.getItem('auth_token'); // Mengambil auth_token yang diset di Login
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      await axios.post('http://127.0.0.1:8000/api/feedbacks', formData, { headers });
      
      setPopup({
        isOpen: true,
        type: 'success',
        title: 'Berhasil',
        message: 'Terima kasih atas umpan balik Anda!',
        onConfirm: () => setPopup((prev) => ({ ...prev, isOpen: false }))
      });
      setFormData({ name: '', phone: '', type: 'Pujian', message: '' });
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setPopup({
        isOpen: true,
        type: 'error',
        title: 'Gagal',
        message: 'Terjadi kesalahan saat mengirim umpan balik. Silakan coba lagi.',
        onConfirm: () => setPopup((prev) => ({ ...prev, isOpen: false }))
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

      {/* Main Content */}
      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-3xl w-full mx-auto">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-4 block">Umpan Balik</span>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Suara Anda Sangat Berarti</h1>
            <p className="text-slate-600">Bantu kami meningkatkan kualitas layanan Zeta Connect dengan memberikan ulasan, saran, atau keluhan Anda.</p>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10"></div>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">Nama Lengkap</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <i className="fa-regular fa-user"></i>
                    </div>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all"
                      placeholder="Masukkan nama Anda"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">Nomor HP</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <i className="fa-solid fa-phone"></i>
                    </div>
                    <input 
                      type="tel" 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all"
                      placeholder="Contoh: 08123456789"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Jenis Umpan Balik</label>
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  {['Pujian', 'Saran', 'Keluhan'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({...formData, type})}
                      className={`py-3 rounded-xl font-semibold border transition-all text-sm sm:text-base ${
                        formData.type === type 
                          ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm' 
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Pesan Anda</label>
                <textarea 
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all resize-none"
                  placeholder="Ceritakan pengalaman Anda di sini..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Mengirim...
                  </>
                ) : (
                  <>
                    <i className="fa-regular fa-paper-plane"></i> Kirim Umpan Balik
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm mt-auto">
        <p>&copy; {new Date().getFullYear()} Zeta Connect. All rights reserved.</p>
      </footer>

      <Popup
        isOpen={popup.isOpen}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        onClose={() => setPopup((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={popup.onConfirm}
      />
    </div>
  );
};

export default Feedback;
