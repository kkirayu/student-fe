// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Popup from '../../components/Popup';
import axios from 'axios';
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [popup, setPopup] = useState({ isOpen: false, type: '', title: '', message: '', onConfirm: null });
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const errorMsg = searchParams.get('error');
    if (errorMsg === 'google_auth_not_owner') {
      setPopup({
        isOpen: true,
        type: 'error',
        title: 'Akses Ditolak',
        message: 'Maaf, Login dengan Google hanya diperuntukkan bagi Pemilik Hewan (Owner).',
        onConfirm: () => {
          setPopup((prev) => ({ ...prev, isOpen: false }));
          navigate('/login', { replace: true });
        }
      });
    } else if (errorMsg === 'google_auth_failed') {
      setPopup({
        isOpen: true,
        type: 'error',
        title: 'Login Gagal',
        message: 'Terjadi kesalahan saat memproses otentikasi Google.',
        onConfirm: () => {
          setPopup((prev) => ({ ...prev, isOpen: false }));
          navigate('/login', { replace: true });
        }
      });
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [searchParams, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaVerified) {
      setPopup({
        isOpen: true,
        type: 'error',
        title: 'Verifikasi Gagal',
        message: 'Silakan centang kotak reCAPTCHA untuk memastikan Anda bukan robot.',
        onConfirm: () => setPopup((prev) => ({ ...prev, isOpen: false }))
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('https://zeta-connect-api.vercel.app/api/auth/login', {
        username: formData.username,
        password: formData.password
      });

      const { access_token, user } = response.data;

      localStorage.setItem('auth_token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      const role = user.role;
      if (role === 'Admin') navigate('/admin');
      else if (role === 'Pemilik Hewan' || role === 'Owner') navigate('/owner');
      else if (role === 'Dokter') navigate('/doctor');
      else if (role === 'Farmasi' || role === 'Apoteker') navigate('/pharmacy');
      else if (role === 'Kasir') navigate('/cashier');
      else if (role === 'Resepsionis') navigate('/receptionist');
      else navigate('/');

    } catch (error) {
      console.error(error);
      setPopup({
        isOpen: true,
        type: 'error',
        title: 'Login Gagal',
        message: error.response?.data?.message || 'Terjadi kesalahan pada server.',
        onConfirm: () => setPopup((prev) => ({ ...prev, isOpen: false }))
      });
    } finally {
      setIsLoading(false);
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
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-3">Selamat Datang Kembali</h1>
            <p className="text-slate-600">Masuk ke akun Zeta Connect Anda.</p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10"></div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">

              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Username / Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <i className="fa-regular fa-user"></i>
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all"
                    placeholder="Masukkan username atau email"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-slate-800">Kata Sandi</label>
                  <Link to="/forgot-password" className="text-xs text-blue-600 font-semibold hover:underline">Lupa sandi?</Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <i className="fa-solid fa-lock"></i>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all"
                    placeholder="Masukkan kata sandi"
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

              <div className="flex justify-center">
                <ReCAPTCHA
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                  onChange={(val) => setCaptchaVerified(!!val)}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || isGoogleLoading}
                  className={`w-full text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 ${isLoading || isGoogleLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {isLoading ? (
                    <><i className="fa-solid fa-spinner animate-spin"></i> Memproses...</>
                  ) : (
                    <><i className="fa-solid fa-right-to-bracket"></i> Masuk</>
                  )}
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-slate-500">Atau masuk dengan</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    setIsGoogleLoading(true);
                    try {
                      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://zeta-connect-api.vercel.app/api';
                      const res = await axios.get(`${apiUrl}/auth/google`);
                      if (res.data.url) {
                        window.location.href = res.data.url;
                      }
                    } catch (e) {
                      setIsGoogleLoading(false);
                      setPopup({
                        isOpen: true,
                        type: 'error',
                        title: 'Gagal',
                        message: 'Login dengan Google sedang tidak tersedia.',
                        onConfirm: () => setPopup((prev) => ({ ...prev, isOpen: false }))
                      });
                    }
                  }}
                  disabled={isLoading || isGoogleLoading}
                  className={`w-full bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-3 shadow-sm mb-4 ${isLoading || isGoogleLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-slate-50'}`}
                >
                  {isGoogleLoading ? (
                    <><i className="fa-solid fa-spinner animate-spin text-slate-500"></i> Memproses...</>
                  ) : (
                    <><img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" /> Google</>
                  )}
                </button>

                {/* Dummy Login Section untuk Presentasi */}
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <p className="text-center text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider">Akses Cepat Demo</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <button type="button" onClick={() => navigate('/admin')} className="py-2 px-2 text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all text-center">Admin</button>
                    <button type="button" onClick={() => navigate('/owner')} className="py-2 px-2 text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all text-center">Pet Owner</button>
                    <button type="button" onClick={() => navigate('/doctor')} className="py-2 px-2 text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all text-center">Dokter</button>
                    <button type="button" onClick={() => navigate('/pharmacy')} className="py-2 px-2 text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200 transition-all text-center">Farmasi</button>
                    <button type="button" onClick={() => navigate('/cashier')} className="py-2 px-2 text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-all text-center">Kasir</button>
                    <button type="button" onClick={() => navigate('/receptionist')} className="py-2 px-2 text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all text-center">Resepsionis</button>
                  </div>
                </div>

                <p className="text-center text-sm text-slate-500 mt-6">
                  Belum punya akun? <Link to="/register" className="text-blue-600 font-bold hover:underline">Daftar sekarang</Link>
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

export default Login;
