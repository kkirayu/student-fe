import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { showSuccess } from '../../utils/alertUtils';

const ForgotPassword = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  
  // State for flow: 1 = Email, 2 = Code, 3 = New Password
  const [step, setStep] = useState(1);
  
  // Form Data
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Error state
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    // Mock validation: fail if email doesn't have @
    if (!email.includes('@')) {
      setError('Format email tidak valid atau email tidak terdaftar.');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1000);
  };

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    setError('');
    // Mock validation: fail if code is not '123456'
    if (code !== '123456') {
      setError('Kode reset tidak valid atau sudah kadaluarsa. (Hint: 123456)');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(3);
    }, 1000);
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
    
    setIsLoading(true);
    setTimeout(async () => {
      setIsLoading(false);
      await showSuccess('Sandi Diperbarui', 'Kata sandi berhasil diatur ulang! Silakan masuk dengan kata sandi baru Anda.');
      navigate('/login');
    }, 1500);
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
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className={`w-full text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    {isLoading ? (
                      <><i className="fa-solid fa-spinner animate-spin"></i> Memproses...</>
                    ) : (
                      'Kirim Kode Reset'
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Input Code */}
            {step === 2 && (
              <form onSubmit={handleCodeSubmit} className="space-y-6 relative z-10">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">Kode Reset</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <i className="fa-solid fa-hashtag"></i>
                    </div>
                    <input 
                      type="text" 
                      required
                      value={code}
                      onChange={(e) => { setCode(e.target.value); setError(''); }}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all text-center tracking-widest text-lg font-bold"
                      placeholder="123456"
                      maxLength={6}
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className={`w-full text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    {isLoading ? (
                      <><i className="fa-solid fa-spinner animate-spin"></i> Memproses...</>
                    ) : (
                      'Verifikasi Kode'
                    )}
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
                      type="password" 
                      required
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all"
                      placeholder="Minimal 6 karakter"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">Konfirmasi Kata Sandi Baru</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <i className="fa-solid fa-check-double"></i>
                    </div>
                    <input 
                      type="password" 
                      required
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                      className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl focus:bg-white focus:ring-2 outline-none transition-all ${
                        confirmPassword && newPassword !== confirmPassword 
                          ? 'border-red-300 focus:ring-red-600/20 focus:border-red-500' 
                          : 'border-slate-200 focus:ring-blue-600/20 focus:border-blue-600'
                      }`}
                      placeholder="Ulangi kata sandi baru"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className={`w-full text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    {isLoading ? (
                      <><i className="fa-solid fa-spinner animate-spin"></i> Menyimpan...</>
                    ) : (
                      <><i className="fa-solid fa-floppy-disk"></i> Simpan Sandi Baru</>
                    )}
                  </button>
                </div>
              </form>
            )}

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

export default ForgotPassword;
