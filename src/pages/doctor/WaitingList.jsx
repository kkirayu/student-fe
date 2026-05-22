import React, { useState } from 'react';
import { Search, Eye, Edit, Trash2, Calendar, Clock, CheckCircle, Timer, X, Save } from 'lucide-react';

const WaitingList = () => {
  // Data antrian dengan tambahan field status
  const [waitingData, setWaitingData] = useState([
    {
      id: 1,
      queue_number: 'A001',
      pet_name: 'Luna',
      species: 'Kucing',
      owner_name: 'Siti Aminah',
      service: 'Konsultasi Medis (SOAP)',
      date: '2024-05-16',
      time: '09:00',
      status: 'Antrian'
    },
    {
      id: 2,
      queue_number: 'A002',
      pet_name: 'Bruno',
      species: 'Anjing',
      owner_name: 'Budi Santoso',
      service: 'Vaksinasi',
      date: '2024-05-16',
      time: '10:30',
      status: 'Antrian'
    }
  ]);

  // State untuk melacak baris mana yang sedang diedit
  const [editingId, setEditingId] = useState(null);
  const [tempStatus, setTempStatus] = useState('');

  // Handler untuk mulai edit
  const handleEditClick = (id, currentStatus) => {
    setEditingId(id);
    setTempStatus(currentStatus);
  };

  // Handler untuk simpan perubahan status
  const handleSaveStatus = (id) => {
    setWaitingData(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, status: tempStatus } : item
      )
    );
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Daftar Antrian (Waiting List)</h1>
        <p className="text-sm text-slate-500">Kelola status kedatangan dan pemeriksaan pasien.</p>
      </div>

      <div className="overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">No. Antrian</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">Pasien & Pemilik</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">Service</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">Jadwal</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">Status</th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase text-slate-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {waitingData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-bold text-blue-700">{item.queue_number}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-800">{item.pet_name}</div>
                    <div className="text-xs text-slate-500">Pemilik: {item.owner_name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{item.service}</td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-slate-600">
                      <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {item.date}</div>
                      <div className="flex items-center gap-1 mt-1"><Clock className="h-3 w-3" /> {item.time}</div>
                    </div>
                  </td>
                  
                  {/* Kolom Status */}
                  <td className="px-6 py-4">
                    {editingId === item.id ? (
                      <select 
                        value={tempStatus}
                        onChange={(e) => setTempStatus(e.target.value)}
                        className="rounded border border-blue-400 bg-white py-1 px-2 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="Antrian">Antrian</option>
                        <option value="Selesai">Selesai</option>
                      </select>
                    ) : (
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        item.status === 'Selesai' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {item.status === 'Selesai' ? <CheckCircle className="h-3 w-3" /> : <Timer className="h-3 w-3" />}
                        {item.status}
                      </span>
                    )}
                  </td>

                  {/* Kolom Aksi dengan Logika Edit */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {editingId === item.id ? (
                        <>
                          <button 
                            onClick={() => handleSaveStatus(item.id)}
                            className="rounded p-1.5 text-emerald-600 hover:bg-emerald-50"
                            title="Simpan"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => setEditingId(null)}
                            className="rounded p-1.5 text-red-600 hover:bg-red-50"
                            title="Batal"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="p-1.5 text-slate-400 hover:text-blue-600"><Eye className="h-4 w-4" /></button>
                          <button 
                            onClick={() => handleEditClick(item.id, item.status)}
                            className="p-1.5 text-slate-400 hover:text-amber-600"
                            title="Ubah Status"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WaitingList;