import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, History as HistoryIcon } from 'lucide-react';

const ReceptionistHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`https://zeta-connect-api.vercel.app/api/appointments?date=${selectedDate}`, config);
        setAppointments(response.data.data.data || []);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [selectedDate]);

  const queueData = appointments
    .filter(a => a.status === 'Selesai')
    .map(a => ({
      rawId: a.id,
      id: a.queue_number,
      petName: a.pet?.name || '-',
      species: a.pet?.species || '-',
      ownerName: a.owner?.name || '-',
      doctor: a.doctor?.name || '-',
      time: a.schedule_time?.slice(0,5) || '-',
    }));

  const filteredQueue = queueData.filter(item => {
    return item.petName.toLowerCase().includes(searchTerm.toLowerCase()) || 
           item.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <HistoryIcon className="h-6 w-6 text-emerald-600" />
            Riwayat Selesai
          </h1>
          <div className="text-sm font-medium text-slate-500">Daftar pasien yang telah selesai diperiksa</div>
        </div>
      </div>

      <div className="rounded-sm border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-bold text-black">
              Daftar Riwayat {selectedDate === new Date().toISOString().split('T')[0] ? 'Hari Ini' : selectedDate}
            </h3>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input 
                type="date"
                className="rounded-sm border border-slate-300 py-2 px-3 text-sm outline-none focus:border-emerald-500"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Cari pasien / pemilik..." 
                  className="w-full rounded-sm border border-slate-300 py-2 pl-9 pr-4 text-sm outline-none focus:border-emerald-500 sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-6 py-4 font-semibold">No. Antrian</th>
                <th className="px-6 py-4 font-semibold">Nama Pasien (Pet)</th>
                <th className="px-6 py-4 font-semibold">Pemilik</th>
                <th className="px-6 py-4 font-semibold">Dokter</th>
                <th className="px-6 py-4 font-semibold">Jam</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">Memuat data...</td>
                </tr>
              ) : filteredQueue.length > 0 ? (
                filteredQueue.map((item, index) => (
                  <tr key={index} className="transition-all hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-black">{item.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{item.petName}</div>
                      <div className="text-xs text-slate-500">{item.species}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{item.ownerName}</td>
                    <td className="px-6 py-4 text-slate-600">{item.doctor}</td>
                    <td className="px-6 py-4 text-slate-600">{item.time}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700">
                        Selesai
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                    Tidak ada riwayat selesai yang sesuai dengan filter.
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

export default ReceptionistHistory;
