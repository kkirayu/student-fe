import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Printer, Save, FileText } from 'lucide-react';

const MedicalCertificate = () => {
  const navigate = useNavigate();

  // 1. State Data Surat (Struktur meniru formData di StaffForm)
  const [certData, setCertData] = useState({
    patientName: 'Mochi',
    ownerName: 'Budi Santoso',
    diagnosis: 'Gastritis Akut',
    restDays: '3',
    startDate: new Date().toISOString().split('T')[0],
    notes: 'Perlu istirahat total dan pemberian obat rutin.',
  });

  const handleChange = (e) => {
    setCertData({ ...certData, [e.target.name]: e.target.value });
  };

  const handlePrint = (e) => {
    e.preventDefault();
    window.print(); // Fungsi cetak browser
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      
      {/* Header - Identik dengan StaffForm */}
      <div className="flex items-center gap-4 no-print">
        <Link 
          to="/doctor/dashboard" 
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Surat Keterangan Medis</h1>
          <p className="mt-0.5 text-sm text-slate-500">Buat surat keterangan istirahat atau sehat untuk pasien.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {/* Sisi Kiri: Form Input (Gaya StaffForm) */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm no-print">
          <h3 className="mb-4 text-sm font-bold uppercase text-slate-700 border-b pb-2">Detail Surat</h3>
          <form className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-800">Nama Pasien</label>
              <input
                type="text" name="patientName" value={certData.patientName} onChange={handleChange}
                className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm outline-none focus:border-blue-600"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-800">Lama Istirahat (Hari)</label>
                <input
                  type="number" name="restDays" value={certData.restDays} onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-800">Tanggal Mulai</label>
                <input
                  type="date" name="startDate" value={certData.startDate} onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm outline-none focus:border-blue-600"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-800">Keterangan Tambahan</label>
              <textarea
                name="notes" value={certData.notes} onChange={handleChange}
                className="w-full h-24 rounded-md border border-slate-300 px-4 py-2 text-sm outline-none focus:border-blue-600"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                onClick={handlePrint}
                className="flex-1 flex items-center justify-center gap-2 rounded bg-slate-800 py-2.5 text-sm font-medium text-white hover:bg-slate-900 transition-all"
              >
                <Printer className="h-4 w-4" /> Cetak Surat
              </button>
              <button 
                type="button"
                className="flex-1 flex items-center justify-center gap-2 rounded bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-all"
              >
                <Save className="h-4 w-4" /> Simpan
              </button>
            </div>
          </form>
        </div>

        {/* Sisi Kanan: Preview Surat (Gaya Laporan yang rapi) */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 shadow-inner flex flex-col items-center">
          <div className="w-full max-w-md bg-white p-8 shadow-lg border-t-4 border-blue-600 min-h-[500px] text-slate-800">
            {/* Kop Surat Sederhana */}
            <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
              <h2 className="text-xl font-bold uppercase tracking-widest">Zeta Connect</h2>
              <p className="text-[10px]">Jl. Kesehatan Hewan No. 123, Indonesia | Telp: 0812-3456-789</p>
            </div>

            <h3 className="text-center font-bold underline mb-8">SURAT KETERANGAN MEDIS</h3>
            
            <div className="space-y-4 text-sm leading-relaxed">
              <p>Diberikan kepada pemilik hewan atas nama <strong>{certData.ownerName}</strong>, untuk pasien hewan (anabul) bernama:</p>
              
              <div className="pl-4">
                <p>Nama Pasien : <strong>{certData.patientName}</strong></p>
                <p>Diagnosa : <strong>{certData.diagnosis}</strong></p>
              </div>

              <p>Berdasarkan hasil pemeriksaan, pasien tersebut dinyatakan memerlukan istirahat selama <strong>{certData.restDays} hari</strong>, terhitung sejak tanggal <strong>{certData.startDate}</strong>.</p>
              
              <p className="mt-4 italic text-slate-600">Catatan: {certData.notes}</p>
            </div>

            <div className="mt-16 text-right text-sm">
              <p>Yogyakarta, {new Date().toLocaleDateString('id-ID')}</p>
              <div className="h-16"></div>
              <p className="font-bold border-t border-slate-400 inline-block pt-1">drh. Bunga</p>
              <p className="text-xs">SIP: 123/ZETA/2026</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-400 italic flex items-center gap-1">
            <FileText className="h-3 w-3" /> Tampilan di atas adalah simulasi hasil cetak.
          </p>
        </div>

      </div>
    </div>
  );
};

export default MedicalCertificate;