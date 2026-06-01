import React, { useState } from 'react';
import { Search, Loader2, Pill, Clock, User, CheckCircle, FileText, AlertTriangle, X } from 'lucide-react';

const PrescriptionQueue = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  
  // Dummy data for prescriptions
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 'RX-20260601-001',
      time: '09:15 AM',
      patientName: 'Milo',
      ownerName: 'Emily Johnson',
      doctor: 'drh. Bunga',
      status: 'Menunggu',
      items: [
        { name: 'Omeprazole 10mg', qty: 5, dosage: '1/4 tablet 2x sehari', notes: 'Sesudah makan' },
        { name: 'RC Gastrointestinal Wet', qty: 2, dosage: 'Sesuai kebutuhan', notes: 'Campurkan sedikit air hangat' }
      ]
    },
    {
      id: 'RX-20260601-002',
      time: '09:45 AM',
      patientName: 'Luna',
      ownerName: 'Michael Williams',
      doctor: 'drh. Bunga',
      status: 'Sedang Diraba',
      items: [
        { name: 'Amoxicillin Drop 15ml', qty: 1, dosage: '0.5ml 2x sehari', notes: 'Habiskan' },
        { name: 'Vitamax Syrup', qty: 1, dosage: '1ml 1x sehari', notes: 'Suplemen tambahan' }
      ]
    },
    {
      id: 'RX-20260601-003',
      time: '10:30 AM',
      patientName: 'Kuro',
      ownerName: 'Sophia Brown',
      doctor: 'drh. Satria',
      status: 'Selesai',
      items: [
        { name: 'Bravecto Spot-On Cat', qty: 1, dosage: '1 tube', notes: 'Ditetskan di tengkuk, jangan dimandikan 3 hari' }
      ]
    }
  ]);

  const filteredPrescriptions = prescriptions.filter(p => 
    p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProcessPrescription = () => {
    if (!selectedPrescription) return;
    
    const updatedPrescriptions = prescriptions.map(p => {
      if (p.id === selectedPrescription.id) {
        if (p.status === 'Menunggu') return { ...p, status: 'Sedang Diraba' };
        if (p.status === 'Sedang Diraba') return { ...p, status: 'Selesai' };
      }
      return p;
    });
    
    setPrescriptions(updatedPrescriptions);
    setSelectedPrescription(null); // Close modal
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Antrean Resep Masuk</h2>
          <p className="text-sm text-slate-500">Kelola E-Resep yang masuk dari dokter untuk disiapkan.</p>
        </div>
        
        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input 
            type="text" 
            placeholder="Cari No. Resep, Pasien, Owner..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-slate-300 py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:w-72 shadow-sm"
          />
        </div>
      </div>

      {/* Tabel Data */}
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
              {filteredPrescriptions.length > 0 ? (
                filteredPrescriptions.map((prescription) => (
                  <tr key={prescription.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{prescription.id}</div>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <Clock className="h-3 w-3" /> {prescription.time}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{prescription.patientName}</div>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <User className="h-3 w-3" /> {prescription.ownerName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-700 font-medium">{prescription.doctor}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                        prescription.status === 'Menunggu' ? 'bg-amber-100 text-amber-700 border border-amber-200'
                        : prescription.status === 'Sedang Diraba' ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}>
                        {prescription.status === 'Menunggu' && <AlertTriangle className="h-3 w-3" />}
                        {prescription.status === 'Sedang Diraba' && <Loader2 className="h-3 w-3 animate-spin" />}
                        {prescription.status === 'Selesai' && <CheckCircle className="h-3 w-3" />}
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
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-slate-500">
                    Tidak ada antrean resep yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL DETAIL RESEP --- */}
      {selectedPrescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedPrescription(null)}></div>
          
          <div className="relative w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
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
                  <p className="font-bold text-slate-800">{selectedPrescription.id}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Waktu Masuk</p>
                  <p className="font-semibold text-slate-800">{selectedPrescription.time}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Pasien</p>
                  <p className="font-bold text-slate-800">{selectedPrescription.patientName} <span className="text-xs font-normal text-slate-500">({selectedPrescription.ownerName})</span></p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Dokter Peresep</p>
                  <p className="font-semibold text-slate-800">{selectedPrescription.doctor}</p>
                </div>
              </div>

              {/* Daftar Obat */}
              <h4 className="text-sm font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">Daftar Obat (E-Resep)</h4>
              <div className="space-y-3 mb-8 max-h-[40vh] overflow-y-auto pr-2">
                {selectedPrescription.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-3 border border-slate-200 rounded-lg bg-white shadow-sm hover:border-blue-200 transition-colors">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 flex-shrink-0">
                      <Pill className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h5 className="font-bold text-slate-800">{item.name}</h5>
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">Qty: {item.qty}</span>
                      </div>
                      <p className="text-xs font-semibold text-blue-600 mt-1">Dosis: {item.dosage}</p>
                      <p className="text-xs text-slate-500 italic mt-0.5">Catatan: {item.notes}</p>
                    </div>
                  </div>
                ))}
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
                    className="flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2 text-sm font-bold text-white hover:bg-blue-700 shadow-md transition-all"
                  >
                    {selectedPrescription.status === 'Menunggu' ? (
                      <>
                        <Loader2 className="h-4 w-4" /> Mulai Raba Obat
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" /> Tandai Selesai Diraba
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
