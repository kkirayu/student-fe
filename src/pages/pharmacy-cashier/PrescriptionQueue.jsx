import React, { useState, useEffect } from 'react';
import { Search, Loader2, Pill, Clock, User, CheckCircle, FileText, AlertTriangle, X, RefreshCw, AlertCircle, Package } from 'lucide-react';
import { getPrescriptions, updatePrescriptionStatus } from '../../services/pharmacyService';

const PrescriptionQueue = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch data resep dari backend
  const fetchPrescriptions = async (search = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPrescriptions(search);
      setPrescriptions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Prescription Error:', err);
      setError(err.message || 'Gagal memuat data resep.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  // Debounce pencarian
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPrescriptions(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Proses resep: ubah status menjadi Ditebus
  const handleProcessPrescription = async () => {
    if (!selectedPrescription) return;

    setIsProcessing(true);
    try {
      await updatePrescriptionStatus(selectedPrescription.id, 'Ditebus');
      // Update state lokal
      setPrescriptions(prev =>
        prev.map(p =>
          p.id === selectedPrescription.id
            ? { ...p, status: 'Selesai', items: p.items.map(i => ({ ...i, status: 'Ditebus' })) }
            : p
        )
      );
      setSelectedPrescription(null);
    } catch (err) {
      alert(err.message || 'Gagal memproses resep.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Status badge styling
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'Sebagian Ditebus':
        return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'Selesai':
        return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-600 border border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <AlertTriangle className="h-3 w-3" />;
      case 'Sebagian Ditebus':
        return <Loader2 className="h-3 w-3 animate-spin" />;
      case 'Selesai':
        return <CheckCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

// Card Stats
const cardStats = [
  {
    title: 'Total Resep',
    value: prescriptions.length,
    icon: <FileText className="text-blue-600 h-6 w-6" />,
    bgIcon: 'bg-blue-100',
  },
  {
    title: 'Menunggu',
    value: prescriptions.filter(
      (p) => p.status === 'Pending'
    ).length,
    icon: <AlertTriangle className="text-amber-600 h-6 w-6" />,
    bgIcon: 'bg-amber-100',
  },
  {
    title: 'Sebagian Ditebus',
    value: prescriptions.filter(
      (p) => p.status === 'Sebagian Ditebus'
    ).length,
    icon: <Loader2 className="text-cyan-600 h-6 w-6" />,
    bgIcon: 'bg-cyan-100',
  },
  {
    title: 'Selesai',
    value: prescriptions.filter(
      (p) => p.status === 'Selesai'
    ).length,
    icon: <CheckCircle className="text-emerald-600 h-6 w-6" />,
    bgIcon: 'bg-emerald-100',
  },
];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Antrean Resep Masuk</h2>
          <p className="text-sm text-slate-500">Kelola E-Resep yang masuk dari dokter untuk disiapkan.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input 
              type="text" 
              placeholder="Cari No. Resep, Pasien, Pemilik..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-slate-300 py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:w-72 shadow-sm"
            />
          </div>
          {/* Refresh */}
          <button
            onClick={() => fetchPrescriptions(searchTerm)}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
  {cardStats.map((stat, index) => (
    <div
      key={index}
      className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Gradient Bottom */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500/20 via-cyan-400/20 to-transparent" />

      {/* Watermark */}
      <div className="absolute right-4 bottom-3 opacity-5 scale-[2.8] text-slate-700 pointer-events-none">
        {stat.icon}
      </div>

      <div className="relative flex items-center gap-4">
        {/* Icon */}
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${stat.bgIcon}`}
        >
          {stat.icon}
        </div>

        {/* Content */}
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500">
            {stat.title}
          </p>

          <h2 className="mt-1 text-4xl font-bold tracking-tight text-slate-800">
            {stat.value}
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            {index === 0 && "Semua resep"}
            {index === 1 && "Perlu diproses"}
            {index === 2 && "Sedang diproses"}
            {index === 3 && "Sudah selesai"}
          </p>
        </div>
      </div>
    </div>
  ))}
</div>

      {/* Konten */}
      {isLoading ? (
        // Loading
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          <span className="mt-4 text-sm font-medium text-slate-500">Memuat data resep...</span>
        </div>
      ) : error ? (
        // Error
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center max-w-md w-full">
            <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-red-800 mb-1">Gagal Memuat Data</h3>
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <button
              onClick={() => fetchPrescriptions(searchTerm)}
              className="inline-flex items-center gap-2 rounded-sm bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition shadow-sm"
            >
              <RefreshCw className="h-4 w-4" />
              Coba Lagi
            </button>
          </div>
        </div>
      ) : prescriptions.length === 0 ? (
        // Empty
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Package className="h-12 w-12 mb-3" />
            <p className="text-sm font-medium">
              {searchTerm ? 'Tidak ada resep yang sesuai pencarian.' : 'Belum ada antrean resep masuk.'}
            </p>
          </div>
        </div>
      ) : (
        // Tabel Data
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-bold">No. Resep / Waktu</th>
                  <th className="px-6 py-4 font-bold">Pasien & Pemilik</th>
                  <th className="px-6 py-4 font-bold">Dokter</th>
                  <th className="px-6 py-4 font-bold">Status Racik</th>
                  <th className="px-6 py-4 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {prescriptions.map((prescription) => (
                  <tr key={prescription.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{prescription.prescription_code}</div>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <Clock className="h-3 w-3" /> {prescription.date}, {prescription.time}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{prescription.patient_name}</div>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <User className="h-3 w-3" /> {prescription.owner_name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-700 font-medium">{prescription.doctor_name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${getStatusStyle(prescription.status)}`}>
                        {getStatusIcon(prescription.status)}
                        {prescription.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedPrescription(prescription)}
                        className="inline-flex items-center gap-1 rounded bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 hover:text-slate-800 transition-colors shadow-sm"
                      >
                        <FileText className="h-3.5 w-3.5" /> Detail Resep
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- MODAL DETAIL RESEP --- */}
      {selectedPrescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedPrescription(null)}></div>
          
          <div className="relative w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="border-b border-slate-100 px-6 py-4 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Pill className="h-5 w-5 text-blue-600" /> Detail Rincian Obat
              </h3>
              <button onClick={() => setSelectedPrescription(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Header Info */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">No. Resep</p>
                  <p className="font-bold text-slate-800">{selectedPrescription.prescription_code}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Waktu Masuk</p>
                  <p className="font-semibold text-slate-800">{selectedPrescription.date}, {selectedPrescription.time}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Pasien</p>
                  <p className="font-bold text-slate-800">{selectedPrescription.patient_name} <span className="text-xs font-normal text-slate-500">({selectedPrescription.owner_name})</span></p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Dokter Peresep</p>
                  <p className="font-semibold text-slate-800">{selectedPrescription.doctor_name}</p>
                </div>
              </div>

              {/* Daftar Obat */}
              <h4 className="text-sm font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">Daftar Obat (E-Resep)</h4>
              <div className="space-y-3 mb-8 max-h-[40vh] overflow-y-auto pr-2">
                {selectedPrescription.items && selectedPrescription.items.length > 0 ? (
                  selectedPrescription.items.map((item, idx) => (
                    <div key={item.id || idx} className="flex gap-4 p-3 border border-slate-200 rounded-lg bg-white shadow-sm hover:border-blue-200 transition-colors">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 flex-shrink-0">
                        <Pill className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h5 className="font-bold text-slate-800">{item.product_name}</h5>
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">Qty: {item.quantity}</span>
                        </div>
                        <p className="text-xs font-semibold text-blue-600 mt-1">Instruksi: {item.instructions}</p>
                        <div className="mt-1.5">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            item.status === 'Ditebus' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {item.status === 'Ditebus' ? <CheckCircle className="h-2.5 w-2.5" /> : <AlertTriangle className="h-2.5 w-2.5" />}
                            {item.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 italic text-center py-4">Tidak ada item obat pada resep ini.</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  onClick={() => setSelectedPrescription(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Tutup
                </button>
                {selectedPrescription.status !== 'Selesai' && (
                  <button 
                    onClick={handleProcessPrescription}
                    disabled={isProcessing}
                    className="flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2 text-sm font-bold text-white hover:bg-blue-700 shadow-md transition-all disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Memproses...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" /> Tandai Selesai Ditebus
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionQueue;
