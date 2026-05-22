import React, { useState, useEffect } from 'react';
import { Users, Clock, CheckCircle, Search, Loader2 } from 'lucide-react';

const WaitingList = () => {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('https://dummyjson.com/users?limit=8');
        const data = await response.json();

        const petNames = ['Milo', 'Luna', 'Kuro', 'Bella', 'Simba', 'Chloe', 'Max', 'Oreo'];
        const petTypes = ['Kucing', 'Anjing', 'Kucing', 'Hamster', 'Anjing', 'Kelinci', 'Burung', 'Kucing'];
        
        const mappedPatients = data.users.map((user, index) => ({
          id: user.id,
          ownerName: `${user.firstName} ${user.lastName}`,
          petName: petNames[index],
          petType: petTypes[index],
          status: index < 2 ? 'Sedang Diperiksa' : 'Menunggu',
          time: `0${9 + index}:00 AM`, // Waktu simulasi
          image: user.image
        }));

        setPatients(mappedPatients);
      } catch (error) {
        console.error("Gagal mengambil data dari API:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(p => 
    p.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.petName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header Info */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Antrean Pasien</h2>
          <p className="text-sm text-slate-500">Daftar hewan peliharaan yang menunggu pemeriksaan hari ini.</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input 
            type="text" 
            placeholder="Cari pasien atau owner..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-slate-300 py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:w-64"
          />
        </div>
      </div>

      {/* Tabel Data */}
      <div className="rounded-sm border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">No. Antrean</th>
                <th className="px-6 py-4 font-medium">Informasi Pasien</th>
                <th className="px-6 py-4 font-medium">Pemilik (Owner)</th>
                <th className="px-6 py-4 font-medium">Waktu</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center">
                    <div className="flex flex-col items-center justify-center text-blue-500">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <span className="mt-2 text-sm text-slate-500">Memuat data API...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredPatients.length > 0 ? (
                filteredPatients.map((patient, index) => (
                  <tr key={patient.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-800">
                      #{String(index + 1).padStart(3, '0')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{patient.petName}</div>
                      <div className="text-xs text-slate-500">{patient.petType}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={patient.image} alt="owner" className="h-8 w-8 rounded-full bg-slate-200" />
                        <span className="font-medium">{patient.ownerName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-slate-500">
                        <Clock className="h-4 w-4" />
                        <span>{patient.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        patient.status === 'Sedang Diperiksa' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors">
                        Mulai Periksa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-slate-500">
                    Tidak ada antrean pasien yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WaitingList;