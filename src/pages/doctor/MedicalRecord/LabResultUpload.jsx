import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  FileText,
  X,
  Download,
  Eye,
  Search,
  Trash2,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import Swal from 'sweetalert2';
import { doctorService } from '../../../services/doctorService';

const LabResultUpload = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  // Menangkap context operan dari dashboard jika ada
  const { activeLab } = location.state || {};

  // State Riwayat & Master Pasien dari API
  const [history, setHistory] = useState([]);
  const [petOptions, setPetOptions] = useState([]);

  // State UI / Loading
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isLoadingPets, setIsLoadingPets] = useState(!activeLab);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Form Terikat 100% dengan LabResultResource
  const [selectedPetId, setSelectedPetId] = useState(activeLab?.pet_id || '');
  const [documentType, setDocumentType] = useState('Cek Darah');
  const [attachedFile, setAttachedFile] = useState(null);

  // Fetch data master pasien dan riwayat upload lab
  useEffect(() => {
    fetchHistoryData();
    if (activeLab) return;

    const fetchPetsData = async () => {
      try {
        setIsLoadingPets(true);
        const response = await doctorService.getPets();
        const petsData = response?.data?.data || response?.data || response;
        setPetOptions(Array.isArray(petsData) ? petsData : []);
      } catch (error) {
        console.error('Gagal mengambil daftar pasien:', error);
      } finally {
        setIsLoadingPets(false);
      }
    };
    fetchPetsData();
  }, [activeLab]);

  const fetchHistoryData = async () => {
    try {
      setIsLoadingHistory(true);
      const response = await doctorService.getLabResults();
      const historyData = response?.data?.data || response?.data || response;
      setHistory(Array.isArray(historyData) ? historyData : []);
    } catch (error) {
      console.error('Gagal memuat riwayat lab:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Handler Berkas (File Validation)
  const handleFileSelection = (file) => {
    if (!file) return;

    // Validasi Ukuran Maksimal (10MB)
    if (file.size > 10 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'Berkas Terlalu Besar',
        text: 'Ukuran berkas maksimal yang diperbolehkan adalah 10MB.',
        confirmButtonColor: '#2563eb'
      });
      return;
    }
    setAttachedFile(file);
  };

  // Handler Drag & Drop Event
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  // Submit via Multipart Form Data (Wajib untuk File Upload Laravel)
  const handleUploadSubmit = async (e) => {
    e.preventDefault();

    const targetPetId = activeLab?.pet_id || selectedPetId;
    if (!targetPetId) {
      Swal.fire({ icon: 'warning', title: 'Pasien Kosong', text: 'Pilih pasien terlebih dahulu.', confirmButtonColor: '#2563eb' });
      return;
    }
    if (!attachedFile) {
      Swal.fire({ icon: 'warning', title: 'Berkas Belum Ada', text: 'Silakan pilih berkas dokumen hasil laboratorium.', confirmButtonColor: '#2563eb' });
      return;
    }

    setIsSubmitting(true);

    const formDataPayload = new FormData();
    formDataPayload.append('pet_id', targetPetId);
    formDataPayload.append('doctor_id', 1); // ID Drh. Bunga
    formDataPayload.append('document_type', documentType);
    formDataPayload.append('document_file', attachedFile);
    // file_size dihitung otomatis oleh backend / opsional ditambahkan jika dibutuhkan:
    formDataPayload.append('file_size', `${(attachedFile.size / (1024 * 1024)).toFixed(2)} MB`);

    try {
      await doctorService.uploadLabResult(formDataPayload);

      Swal.fire({
        icon: 'success',
        title: 'Sukses Mengunggah!',
        text: 'Hasil laboratorium berhasil disimpan ke rekam medis pasien.',
        confirmButtonColor: '#2563eb'
      });

      // Reset Form Pengunggahan
      setAttachedFile(null);
      if (!activeLab) setSelectedPetId('');

      // Refresh daftar tabel history
      fetchHistoryData();
    } catch (error) {
      console.error('Gagal mengunggah berkas lab:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Mengunggah',
        text: error.response?.data?.message || 'Terjadi galat saat memproses dokumen ke server.',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteHistory = async (id) => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Data dokumen hasil laboratorium ini akan dihapus permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus!'
    });

    if (result.isConfirmed) {
      try {
        await doctorService.deleteLabResult(id);
        Swal.fire('Terhapus!', 'Dokumen lab telah berhasil dibersihkan.', 'success');
        fetchHistoryData();
        if (selectedDoc?.id === id) setSelectedDoc(null);
      } catch (error) {
        Swal.fire('Gagal!', 'Tidak dapat menghapus berkas dari server.', 'error');
      }
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
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-800">Pilih / Cari Pasien</label>
                {activeLab ? (
                  <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
                    {activeLab.pet_name} — Terkunci dari Dashboard
                  </div>
                ) : isLoadingPets ? (
                  <div className="text-xs text-slate-400 flex items-center py-2"><Loader2 className="h-3 w-3 animate-spin mr-1" /> Memuat daftar...</div>
                ) : (
                  <div className="relative">
                    <select
                      value={selectedPetId}
                      required
                      onChange={(e) => setSelectedPetId(e.target.value)}
                      className="w-full appearance-none rounded-md border border-slate-300 bg-white pl-4 pr-10 py-2 text-sm outline-none focus:border-blue-600"
                    >
                      <option value="">-- Pilih Pasien Hewan --</option>
                      {petOptions.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.species || 'N/A'})</option>
                      ))}
                    </select>
                    <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-800">Tipe Dokumen (document_type)</label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm outline-none focus:border-blue-600 bg-white"
                >
                  <option value="Cek Darah">Cek Darah</option>
                  <option value="Rontgen / X-Ray">Rontgen / X-Ray</option>
                  <option value="USG">USG</option>
                  <option value="Urinalisis">Urinalisis</option>
                  <option value="Patologi">Patologi Anatomi</option>
                </select>
              </div>

              {/* Dropzone */}
              <div
                className={`relative rounded-lg border-2 border-dashed p-6 transition-all cursor-pointer ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50'
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center text-center">
                  <Upload className={`h-8 w-8 mb-2 ${attachedFile ? 'text-emerald-600' : dragActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  {attachedFile ? (
                    <div className="text-xs">
                      <p className="font-semibold text-emerald-700">Berkas Terpilih:</p>
                      <p className="text-slate-600 line-clamp-1 text-[11px] mt-0.5">{attachedFile.name}</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs font-medium text-slate-600">Klik atau seret file ke sini</p>
                      <p className="text-[10px] text-slate-400 mt-1">PDF, JPG, PNG (Maks 10MB)</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => handleFileSelection(e.target.files[0])}
                  className="hidden"
                  accept=".pdf,image/png,image/jpeg,image/jpg"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-md bg-blue-600 py-2.5 text-sm font-bold text-white shadow-md hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Mengunggah...</>
                ) : (
                  "Mulai Unggah"
                )}
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
              {isLoadingHistory ? (
                <div className="p-12 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" /> Memuat riwayat berkas laboratorium...
                </div>
              ) : history.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-sm">
                  Belum ada rekam data berkas laboratorium diunggah.
                </div>
              ) : (
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
                          <span className="font-medium text-slate-800">{item.pet?.name || 'Pasien'}</span>
                          <span className="block text-[10px] text-slate-400">
                            {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{item.document_type}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setSelectedDoc(item)}
                              className="rounded-md p-2 text-blue-600 hover:bg-blue-100 transition-all"
                              title="Lihat Detail"
                            >
                              <FileText className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteHistory(item.id)}
                              className="rounded-md p-2 text-red-500 hover:bg-red-50 transition-all"
                              title="Hapus"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
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
 * Komponen Modal Detail terikat props LabResultResource 
 */
const DocumentModal = ({ doc, onClose }) => {

  const handleForceDownload = async (e, url, fileName) => {
    e.preventDefault();
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const tempLink = document.createElement('a');
      tempLink.href = blobUrl;
      tempLink.download = fileName || 'dokumen_lab.png';

      document.body.appendChild(tempLink);
      tempLink.click();

      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Gagal mengunduh berkas:', error);
      window.open(url, '_blank');
    }
  };

  const baseUrl = import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace('/api', '') : 'https://zeta-connect-api.vercel.app';
  const targetUrl = doc.document_url?.startsWith('http')
    ? doc.document_url
    : `${baseUrl}${doc.document_url}`;

  const fallbackFileName = doc.document_file ? doc.document_file.split('/').pop() : 'DOKUMEN_LAB.png';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>

      {/* Konten Modal */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">

        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Detail Dokumen Lab</h3>
              <p className="text-xs text-slate-500">{doc.document_type} - {doc.pet?.name}</p>
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
            <h4 className="text-sm font-bold text-slate-700 max-w-[80%] truncate">
              {doc.document_file ? doc.document_file.split('/').pop() : 'LAB_DOCUMENT.pdf'}
            </h4>
            <p className="mt-1 text-xs text-slate-400">Ukuran: {doc.file_size || 'N/A'}</p>

            <div className="mt-6 flex gap-3">
              <a
                href={doc.document_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
              >
                <Eye className="h-4 w-4" /> Pratinjau
              </a>
              <button
                type="button"
                onClick={(e) => handleForceDownload(e, targetUrl, fallbackFileName)}
                className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-sm transition-all"
              >
                <Download className="h-4 w-4" /> Unduh
              </button>
            </div>
          </div>

          {/* Info Tambahan */}
          <div className="space-y-3">
            <div className="flex justify-between border-b border-slate-50 pb-2 text-sm">
              <span className="text-slate-500">Status Penyimpanan</span>
              <span className="flex items-center gap-1 font-bold text-emerald-600">
                <CheckCircle2 className="h-4 w-4" /> Tersimpan di Storage
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-2 text-sm">
              <span className="text-slate-500">Dokter Penanggung Jawab</span>
              <span className="font-medium text-slate-700">{doc.doctor?.name || 'Drh. Bunga'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">ID Dokumen Database</span>
              <span className="font-mono text-xs font-medium text-slate-400">LAB-ID-{doc.id}</span>
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