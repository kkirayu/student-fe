import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Popup from '../../components/Popup';

const ForgotPassword = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const [popup, setPopup] = useState({ isOpen: false, type: '', title: '', message: '', onConfirm: null });
  
  const [step, setStep] = useState(1);
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email.includes('@')) {
      setError('Format email tidak valid atau email tidak terdaftar.');
      return;
    }
    setStep(2);
  };

  const handleOtpChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    setError('');
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setError('Silakan masukkan 6 digit kode secara lengkap.');
      return;
    }
    if (otpCode !== '123456') {
      setError('Kode reset tidak valid atau sudah kadaluarsa. (Hint: 123456)');
      return;
    }
    setStep(3);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) {
      setError('Kata sandi minimal 6 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    setPopup({
      isOpen: true,
      type: 'success',
      title: 'Sandi Diperbarui',
      message: 'Kata sandi berhasil diatur ulang! Silakan masuk dengan kata sandi baru Anda.',
      onConfirm: () => {
        setPopup((prev) => ({ ...prev, isOpen: false }));
        navigate('/login');
      }
    });
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
            <Link to="/login" className="text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-2">
              <i className="fa-solid fa-arrow-left"></i> Kembali ke Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto">
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
              <i className="fa-solid fa-key"></i>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-3">Lupa Kata Sandi</h1>
            <p className="text-slate-600">
              {step === 1 && "Masukkan email yang terdaftar untuk menerima kode reset sandi Anda."}
              {step === 2 && "Masukkan kode 6 digit yang telah kami kirimkan ke email Anda."}
              {step === 3 && "Buat kata sandi baru untuk mengamankan kembali akun Anda."}
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10"></div>
            
            {error && (
              <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-start gap-3 border border-red-100 relative z-10">
                <i className="fa-solid fa-circle-exclamation mt-0.5"></i>
                <p>{error}</p>
              </div>
            )}

            {/* Step 1: Input Email */}
            {step === 1 && (
              <form onSubmit={handleEmailSubmit} className="space-y-6 relative z-10">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">Email Terdaftar</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <i className="fa-regular fa-envelope"></i>
                    </div>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all"
                      placeholder="nama@email.com"
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
                    Kirim Kode Reset
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Input Code */}
            {step === 2 && (
              <form onSubmit={handleCodeSubmit} className="space-y-6 relative z-10">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-4 text-center">Masukkan 6 Digit Kode Reset</label>
                  <div className="flex justify-center gap-2 sm:gap-4">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength={1}
                        value={digit}
                        ref={(el) => (inputRefs.current[index] = el)}
                        onChange={(e) => handleOtpChange(index, e)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all"
                      />
                    ))}
                  </div>
                </div>
                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={otp.join('').length < 6}
                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 disabled:shadow-none"
                  >
                    Verifikasi Kode
                  </button>
                  <p className="text-center text-sm text-slate-500 mt-6">
                    <button type="button" onClick={() => setStep(1)} className="text-blue-600 font-bold hover:underline">Ganti Email</button>
                  </p>
                </div>
              </form>
            )}

            {/* Step 3: Input New Password */}
            {step === 3 && (
              <form onSubmit={handlePasswordSubmit} className="space-y-6 relative z-10">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">Kata Sandi Baru</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <i className="fa-solid fa-lock"></i>
                    </div>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                      className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all"
                      placeholder="Minimal 6 karakter"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-blue-600 focus:outline-none transition-colors"
                    >
                      <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">Konfirmasi Kata Sandi Baru</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <i className="fa-solid fa-check-double"></i>
                    </div>
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      required
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                      className={`w-full pl-11 pr-12 py-3 bg-slate-50 border rounded-xl focus:bg-white focus:ring-2 outline-none transition-all ${
                        confirmPassword && newPassword !== confirmPassword 
                          ? 'border-red-300 focus:ring-red-600/20 focus:border-red-500' 
                          : 'border-slate-200 focus:ring-blue-600/20 focus:border-blue-600'
                      }`}
                      placeholder="Ulangi kata sandi baru"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-blue-600 focus:outline-none transition-colors"
                    >
                      <i className={`fa-regular ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
                    <i className="fa-solid fa-floppy-disk"></i> Simpan Sandi Baru
                  </button>
                </div>
              </form>
            )}

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

export default ForgotPassword;
