import React from 'react';

const AppointmentHistory = () => {
  // Data riwayat janji temu (Bisa juga diambil dari API nantinya)
  const historyData = [
    { id: 1, pet: 'Milo', service: 'Konsultasi Medis', date: '2026-05-20', time: '10:00', status: 'Menunggu' },
    { id: 2, pet: 'Buster', service: 'Vaksinasi', date: '2026-05-18', time: '13:30', status: 'Disetujui' },
    { id: 3, pet: 'Milo', service: 'Grooming', date: '2026-04-10', time: '09:00', status: 'Selesai' },
    { id: 4, pet: 'Luna', service: 'Konsultasi Medis', date: '2026-03-05', time: '15:00', status: 'Batal' },
  ];

  // Fungsi untuk menentukan warna badge berdasarkan status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Menunggu': return 'bg-yellow-100 text-yellow-800';
      case 'Disetujui': return 'bg-blue-100 text-blue-800';
      case 'Dalam Periksa': return 'bg-purple-100 text-purple-800';
      case 'Selesai': return 'bg-green-100 text-green-800';
      case 'Batal': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Riwayat Janji Temu</h2>
        <p className="text-sm text-slate-500">Daftar riwayat reservasi layanan untuk hewan peliharaan Anda.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
              <th className="p-4 rounded-tl-lg">ID</th>
              <th className="p-4">Hewan Peliharaan</th>
              <th className="p-4">Layanan</th>
              <th className="p-4">Tanggal & Waktu</th>
              <th className="p-4 rounded-tr-lg">Status</th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((item) => (
              <tr 
                key={item.id} 
                className="border-b border-slate-100 hover:bg-slate-50 transition-colors duration-200 text-sm text-slate-700"
              >
                <td className="p-4 font-medium text-slate-900">#{item.id}</td>
                <td className="p-4">{item.pet}</td>
                <td className="p-4">{item.service}</td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-medium">{item.date}</span>
                    <span className="text-xs text-slate-500">{item.time} WIB</span>
                  </div>
                </td>
                <td className="p-4">
                  <span 
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadge(item.status)}`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* State Kosong jika tidak ada data */}
        {historyData.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            Belum ada riwayat janji temu.
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentHistory;