import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle, Loader2, Search } from 'lucide-react';

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://dummyjson.com/users?limit=8');
        const data = await response.json();
        
        const actions = [
          'Menghapus katalog produk PRD-004',
          'Mengubah tarif layanan USG Hewan',
          'Menambahkan staf medis baru',
          'Membatalkan janji temu secara sepihak',
          'Mengubah status resep menjadi Selesai',
          'Melakukan export laporan keuangan bulanan',
          'Mengubah konfigurasi jam operasional klinik',
          'Menyetujui pendaftaran walk-in owner'
        ];

        const roles = ['Admin', 'Admin', 'Admin', 'Resepsionis', 'Apoteker', 'Admin', 'Admin', 'Resepsionis'];

        const mappedLogs = data.users.map((user, index) => ({
          id: user.id,
          user: `${user.firstName} ${user.lastName}`,
          role: roles[index % roles.length],
          action: actions[index % actions.length],
          timestamp: `Hari ini, 0${8 - index}:12 WIB`,
          severity: index % 3 === 0 ? 'Tinggi' : 'Normal'
        }));

        setLogs(mappedLogs);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log =>
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Audit Log Sistem</h1>
        <p className="text-sm text-slate-500 font-medium">Catatan riwayat aktivitas seluruh staf dan perubahan krusial pada sistem klinik.</p>
      </div>

      <div className="flex flex-col gap-4 border border-slate-200 rounded-sm p-4 sm:flex-row sm:items-center sm:justify-between bg-white shadow-sm">
        <div className="relative w-full max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Search className="h-5 w-5" />
          </span>
          <input
            type="text"
            placeholder="Cari pelaku atau tindakan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded border border-slate-300 bg-transparent py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>
      </div>

      <div className="rounded-sm border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-2" />
              <p className="text-sm font-medium">Memuat log aktivitas...</p>
            </div>
          ) : (
            <table className="w-full table-auto text-left">
              <thead>
                <tr className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 border-b border-slate-200">
                  <th className="px-6 py-4">Waktu</th>
                  <th className="px-6 py-4">Pengguna</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Aktivitas / Tindakan</th>
                  <th className="px-6 py-4 text-center">Tingkat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-600">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-xs text-slate-400 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{log.timestamp}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800">
                        {log.user}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {log.role}
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {log.action}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          log.severity === 'Tinggi'
                            ? 'bg-rose-50 text-rose-700 border border-rose-100'
                            : 'bg-slate-50 text-slate-600 border border-slate-200'
                        }`}>
                          <AlertCircle className="h-3 w-3" />
                          {log.severity}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-10 text-center text-slate-400">
                      Log aktivitas tidak ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditLog;