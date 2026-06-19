// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-600 flex flex-col">
      <header>
        <nav className="bg-white/90 backdrop-blur-md shadow-sm py-3 fixed top-0 w-full z-50">
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
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Syarat dan Ketentuan</h1>
          
          <div className="space-y-6 text-slate-700 leading-relaxed">
            <p>
              Selamat datang di Zeta Pet Care. Syarat dan Ketentuan ini mengatur penggunaan layanan klinik hewan dan platform Zeta Connect kami. Dengan mengakses atau menggunakan layanan kami, Anda menyetujui seluruh ketentuan yang tercantum di bawah ini.
            </p>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">1. Pendaftaran dan Akun</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Pengguna diwajibkan memberikan informasi yang akurat dan lengkap saat mendaftarkan hewan peliharaannya.</li>
                <li>Pengguna bertanggung jawab atas kerahasiaan akun dan kata sandi yang digunakan pada platform Zeta Connect.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">2. Layanan Medis</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Semua tindakan medis yang dilakukan oleh Zeta Pet Care berdasarkan pada diagnosis dan standar operasional prosedur kedokteran hewan yang berlaku.</li>
                <li>Pihak klinik berhak menolak memberikan layanan jika hewan peliharaan menunjukkan agresivitas yang membahayakan staf medis tanpa adanya persetujuan tindakan khusus.</li>
                <li>Pemilik menyetujui setiap tindakan medis darurat (life-saving) yang harus diambil oleh dokter jika pemilik tidak dapat dihubungi.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">3. Sistem Pemesanan dan Pembatalan</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Pemesanan jadwal (booking) dapat dilakukan melalui platform Zeta Connect atau langsung di resepsionis.</li>
                <li>Pembatalan atau perubahan jadwal wajib dilakukan setidaknya 12 jam sebelum waktu yang telah ditentukan.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">4. Pembayaran</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Seluruh biaya layanan dan obat-obatan wajib dilunasi setelah tindakan selesai dilakukan.</li>
                <li>Rincian biaya (estimasi) untuk tindakan bedah atau rawat inap akan diinformasikan kepada pemilik sebelum tindakan dilakukan.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">5. Perubahan Ketentuan</h2>
              <p>
                Zeta Pet Care berhak untuk mengubah, memodifikasi, atau memperbarui Syarat dan Ketentuan ini sewaktu-waktu. Perubahan akan berlaku segera setelah dipublikasikan di platform ini.
              </p>
            </section>
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm mt-auto">
        <p>&copy; {new Date().getFullYear()} Zeta Pet Care. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default TermsAndConditions;
