// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Popup from '../../components/Popup';
import axios from 'axios';

const OTPVerification = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const [popup, setPopup] = useState({ isOpen: false, type: '', title: '', message: '', onConfirm: null });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setPopup({
        isOpen: true,
        type: 'error',
        title: 'Kode Tidak Lengkap',
        message: 'Silakan masukkan 6 digit kode OTP.',
        onConfirm: () => setPopup((prev) => ({ ...prev, isOpen: false }))
      });
      return;
    }

    try {
      const response = await axios.post('https://zeta-connect-api.vercel.app/api/auth/verify-otp', {
        email: email,
        otp_code: otpCode
      });

      setPopup({
        isOpen: true,
        type: 'success',
        title: 'Verifikasi Berhasil!',
        message: 'Akun Anda berhasil dibuat. Silakan masuk untuk melanjutkan.',
        onConfirm: () => {
          setPopup((prev) => ({ ...prev, isOpen: false }));
          navigate('/login');
        }
      });
    } catch (error) {
      console.error(error);
      setPopup({
        isOpen: true,
        type: 'error',
        title: 'Verifikasi Gagal',
        message: error.response?.data?.message || 'Kode OTP tidak valid.',
        onConfirm: () => setPopup((prev) => ({ ...prev, isOpen: false }))
      });
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
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-3">Verifikasi Keamanan</h1>
            <p className="text-slate-600">Masukkan 6 digit kode OTP yang telah dikirim ke email atau nomor telepon Anda.</p>
          </div>

          <div className="bg-white p-8 rounded-4xl shadow-xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-50 rounded-br-full -z-10"></div>

            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">

              <div className="flex justify-center gap-2 sm:gap-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    ref={(el) => (inputRefs.current[index] = el)}
                    onChange={(e) => handleChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all"
                  />
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={otp.join('').length < 6}
                  className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 disabled:shadow-none"
                >
                  <i className="fa-solid fa-check-circle"></i> Verifikasi OTP
                </button>
                <p className="text-center text-sm text-slate-500 mt-6">
                  Belum menerima kode? <button type="button" className="text-blue-600 font-bold hover:underline">Kirim ulang</button>
                </p>
              </div>
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

export default OTPVerification;
