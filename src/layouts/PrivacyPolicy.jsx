// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
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
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Kebijakan Privasi</h1>
          
          <div className="space-y-6 text-slate-700 leading-relaxed">
            <p>
              Di Zeta Pet Care dan platform Zeta Connect, privasi dan keamanan data Anda adalah prioritas kami. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda dan hewan peliharaan Anda.
            </p>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">1. Informasi yang Kami Kumpulkan</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Informasi Pribadi:</strong> Nama, alamat, nomor telepon, dan email pemilik hewan yang diberikan saat pendaftaran.</li>
                <li><strong>Informasi Medis Hewan:</strong> Rekam medis, riwayat vaksinasi, alergi, dan data kesehatan peliharaan lainnya.</li>
                <li><strong>Data Transaksi:</strong> Rincian pembayaran dan riwayat kunjungan ke klinik.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">2. Penggunaan Informasi</h2>
              <p className="mb-2">Informasi yang kami kumpulkan digunakan untuk:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Memberikan layanan medis terbaik dan diagnosis yang akurat bagi hewan peliharaan Anda.</li>
                <li>Mengelola jadwal janji temu dan mengirimkan pengingat (seperti jadwal vaksin atau kontrol).</li>
                <li>Memproses transaksi pembayaran dan administrasi klinik.</li>
                <li>Meningkatkan kualitas layanan melalui evaluasi dan pengelolaan data internal.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">3. Keamanan Data</h2>
              <p>
                Kami mengimplementasikan standar keamanan teknis dan organisasional untuk melindungi data rekam medis dan informasi pribadi Anda dari akses yang tidak sah, kebocoran, atau perubahan data yang tidak bertanggung jawab. Platform Zeta Connect dilindungi dengan enkripsi data standar industri.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">4. Pembagian Informasi</h2>
              <p>
                Zeta Pet Care tidak akan menjual, menyewakan, atau mendistribusikan informasi pribadi Anda kepada pihak ketiga untuk tujuan pemasaran. Kami hanya akan membagikan informasi jika diwajibkan oleh hukum atau untuk kepentingan rujukan medis ke pihak spesialis dengan persetujuan Anda.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">5. Hak Akses Pemilik</h2>
              <p>
                Anda berhak untuk mengakses, memperbarui, atau meminta penghapusan informasi pribadi Anda (dengan pengecualian untuk rekam medis hewan yang wajib kami simpan sesuai peraturan perundang-undangan kedokteran hewan).
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

export default PrivacyPolicy;
