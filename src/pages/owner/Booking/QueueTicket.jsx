import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Calendar, Clock, X, ChevronRight, Download } from 'lucide-react';

const QueueTicket = () => {
  const navigate = useNavigate();
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Dummy active appointments data
  const activeTickets = [
    {
      id: "A-012",
      clinic_name: "Zeta Pet Care",
      queue_number: "A-012",
      pet_name: "Milo (Kucing)",
      service: "Vaksinasi & Check-up Rutin",
      status: "DISETUJUI",
      schedule: "Sabtu, 16 Mei 2026 | 16:30 WIB",
      date: "16 Mei 2026",
      time: "16:30 WIB",
      statusColor: "bg-emerald-100 text-emerald-700 border-emerald-200"
    },
    {
      id: "B-045",
      clinic_name: "Zeta Pet Care",
      queue_number: "B-045",
      pet_name: "Luna (Anjing)",
      service: "Grooming Medis",
      status: "MENUNGGU KONFIRMASI",
      schedule: "Senin, 18 Mei 2026 | 10:00 WIB",
      date: "18 Mei 2026",
      time: "10:00 WIB",
      statusColor: "bg-amber-100 text-amber-700 border-amber-200"
    }
  ];

  // Fungsi Download QR
  const downloadQR = (queueNumber) => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${queueNumber}`;
    fetch(qrUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `QR_Antrean_${queueNumber}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Info */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Tiket Antrean Aktif</h2>
          <p className="text-sm text-slate-500">Daftar janji temu Anda yang akan datang beserta akses tiket QR.</p>
        </div>
        <button
          onClick={() => navigate('/owner/booking')}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 shadow-sm"
        >
          + Buat Janji Temu Baru
        </button>
      </div>

      {/* Tabel Data Tiket Aktif */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold">Jadwal & Waktu</th>
                <th className="px-6 py-4 font-bold">Detail Pasien</th>
                <th className="px-6 py-4 font-bold">Layanan</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Akses Tiket</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeTickets.length > 0 ? (
                activeTickets.map((ticket, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-blue-500" /> {ticket.date}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                        <Clock className="h-3.5 w-3.5" /> {ticket.time}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{ticket.pet_name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">No: {ticket.queue_number}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-700 font-medium">{ticket.service}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold border uppercase tracking-wider ${ticket.statusColor}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedTicket(ticket)}
                        disabled={ticket.status === 'MENUNGGU KONFIRMASI'}
                        className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-colors shadow-sm ${
                            ticket.status === 'MENUNGGU KONFIRMASI' 
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-slate-800 text-white hover:bg-slate-700'
                        }`}
                      >
                        <QrCode className="h-3.5 w-3.5" /> Tampilkan QR
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-slate-500">
                    Tidak ada tiket antrean aktif saat ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL QR TICKET --- */}
      {selectedTicket && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" 
            onClick={() => setSelectedTicket(null)}
          ></div>
          
          {/* Ticket Card Container */}
          <div className="relative w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-slate-100 bg-white animate-in fade-in zoom-in duration-200">
            
            {/* Close Button Outside/Top */}
            <button 
              onClick={() => setSelectedTicket(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-md transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Ticket Header (Blue Area) */}
            <div className="bg-blue-600 p-6 sm:p-8 text-center text-white relative">
                <div className="text-4xl mb-3">🐾</div>
                <h1 className="text-lg sm:text-xl font-black uppercase tracking-widest">
                    {selectedTicket.clinic_name || "Zeta Pet Care"}
                </h1>
                <p className="text-xs opacity-75 mt-1 font-medium">ANTREAN RESMI KLINIK</p>
                {/* Cutout circles for ticket effect */}
                <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-white rounded-full"></div>
                <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-white rounded-full"></div>
            </div>

            {/* Ticket Body: Queue & QR */}
            <div className="p-6 sm:p-8 flex items-center justify-between border-b-2 border-dashed border-slate-200 bg-white">
                <div className="text-left">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">
                        Nomor Antrean
                    </p>
                    <h2 className="text-5xl sm:text-6xl font-black text-slate-800 tracking-tighter">
                        {selectedTicket.queue_number}
                    </h2>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${selectedTicket.queue_number}`}
                        alt="QR Antrean"
                        className="w-20 h-20"
                    />
                </div>
            </div>

            {/* Ticket Info Details */}
            <div className="p-6 sm:p-8 space-y-5 bg-white">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Pasien</label>
                        <p className="text-base font-black text-slate-800">{selectedTicket.pet_name}</p>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Status</label>
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase ${selectedTicket.statusColor}`}>
                            {selectedTicket.status}
                        </span>
                    </div>
                </div>
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Layanan</label>
                    <p className="text-sm font-bold text-slate-700">{selectedTicket.service}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 text-center">Jadwal Kedatangan</label>
                    <p className="text-sm font-black text-slate-800 text-center">{selectedTicket.schedule}</p>
                </div>
            </div>

            {/* Ticket Footer / Instruction */}
            <div className="px-6 pb-6 pt-2 sm:px-8 sm:pb-8 relative bg-white">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 mb-4">
                    <p className="text-center text-[11px] text-blue-800 font-medium leading-relaxed">
                        Silakan datang 15 menit sebelum jadwal. Scan QR di atas pada mesin mandiri klinik atau tunjukkan ke resepsionis.
                    </p>
                </div>
                
                {/* Download Button */}
                <button 
                  onClick={() => downloadQR(selectedTicket.queue_number)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                >
                  <Download className="h-4 w-4" /> Simpan Tiket ke HP
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueueTicket;