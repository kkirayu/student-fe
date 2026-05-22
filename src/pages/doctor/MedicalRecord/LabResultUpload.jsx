import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  X, 
  Download, 
  Eye, 
  Search, 
  Trash2,
  CheckCircle2
} from 'lucide-react';

const LabResultUpload = () => {
  const navigate = useNavigate();
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Data Dummy untuk Riwayat
  const [history, setHistory] = useState([
    { id: 1, patient: 'Mochi', type: 'Cek Darah', date: '10 Mei 2026', size: '1.2 MB', uploader: 'drh. Bunga' },
    { id: 2, patient: 'Bruno', type: 'Rontgen', date: '09 Mei 2026', size: '4.5 MB', uploader: 'drh. Bunga' },
    { id: 3, patient: 'Luna', type: 'Urinalisis', date: '07 Mei 2026', size: '0.8 MB', uploader: 'drh. Bunga' },
  ]);

  // Handler untuk Drag & Drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          to="/doctor" 
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Upload Hasil Lab</h1>
          <p className="mt-0.5 text-sm text-slate-500">Unggah dokumen hasil pemeriksaan laboratorium pasien.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Kolom Kiri: Form Upload */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-700">Form Unggah</h3>
            <form className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-800">Cari Pasien</label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Nama Pasien / ID..."
                    className="w-full rounded-md border border-slate-300 pl-10 pr-4 py-2 text-sm outline-none focus:border-blue-600"
                  />
                </div>
              </div>
              
              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-800">Tipe Dokumen</label>
                <select className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm outline-none focus:border-blue-600 bg-white">
                  <option>Cek Darah</option>
                  <option>Rontgen / X-Ray</option>
                  <option>USG</option>
                  <option>Urinalisis</option>
                </select>
              </div>

              {/* Dropzone */}
              <div 
                className={`relative rounded-lg border-2 border-dashed p-6 transition-all ${
                  dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={(e) => { handleDrag(e); setDragActive(false); }}
              >
                <div className="flex flex-col items-center text-center">
                  <Upload className={`h-8 w-8 mb-2 ${dragActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <p className="text-xs font-medium text-slate-600">Klik atau seret file ke sini</p>
                  <p className="text-[10px] text-slate-400 mt-1">PDF, JPG, PNG (Maks 10MB)</p>
                </div>
                <input type="file" className="absolute inset-0 cursor-pointer opacity-0" />
              </div>

              <button className="w-full rounded-md bg-blue-600 py-2.5 text-sm font-bold text-white shadow-md hover:bg-blue-700 transition-all">
                Mulai Unggah
              </button>
            </form>
          </div>
        </div>

        {/* Kolom Kanan: Tabel Riwayat */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
              <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Riwayat Upload Terakhir</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3 font-semibold uppercase text-[10px]">Pasien</th>
                    <th className="px-6 py-3 font-semibold uppercase text-[10px]">Tipe</th>
                    <th className="px-6 py-3 font-semibold uppercase text-[10px] text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-800">{item.patient}</span>
                        <span className="block text-[10px] text-slate-400">{item.date}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{item.type}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setSelectedDoc(item)}
                            className="rounded-md p-2 text-blue-600 hover:bg-blue-100 transition-all"
                            title="Lihat Detail"
                          >
                            <FileText className="h-5 w-5" />
                          </button>
                          <button className="rounded-md p-2 text-red-500 hover:bg-red-50 transition-all" title="Hapus">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Detail Dokumen */}
      {selectedDoc && (
        <DocumentModal doc={selectedDoc} onClose={() => setSelectedDoc(null)} />
      )}
    </div>
  );
};

/**
 * Komponen Modal Detail
 */
const DocumentModal = ({ doc, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Konten Modal */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Detail Dokumen</h3>
              <p className="text-xs text-slate-500">{doc.type} - {doc.patient}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body Modal */}
        <div className="p-6">
          <div className="mb-6 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50 py-10 text-center">
            <div className="mb-4 rounded-full bg-white p-4 shadow-sm">
              <FileText className="h-12 w-12 text-slate-300" />
            </div>
            <h4 className="text-sm font-bold text-slate-700">{doc.type.toUpperCase()}_{doc.patient.toUpperCase()}.pdf</h4>
            <p className="mt-1 text-xs text-slate-400">Ukuran: {doc.size} • Diunggah pada {doc.date}</p>
            
            <div className="mt-6 flex gap-3">
              <button className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all">
                <Eye className="h-4 w-4" /> Pratinjau
              </button>
              <button className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-sm transition-all">
                <Download className="h-4 w-4" /> Unduh
              </button>
            </div>
          </div>

          {/* Info Tambahan */}
          <div className="space-y-3">
            <div className="flex justify-between border-b border-slate-50 pb-2 text-sm">
              <span className="text-slate-500">Status Verifikasi</span>
              <span className="flex items-center gap-1 font-bold text-emerald-600">
                <CheckCircle2 className="h-4 w-4" /> Terverifikasi
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-2 text-sm">
              <span className="text-slate-500">Petugas Pengunggah</span>
              <span className="font-medium text-slate-700">{doc.uploader}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">ID Dokumen</span>
              <span className="font-mono text-xs font-medium text-slate-400">DOC-{doc.id}ZETA2026</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 flex justify-end">
          <button 
            onClick={onClose}
            className="rounded-md bg-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-300 transition-all"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default LabResultUpload;