import React from 'react';
import { useNavigate } from 'react-router-dom';

const QueueTicket = () => {
  const navigate = useNavigate();

  const appointmentData = {
    clinic_name: "Zeta Pet Care",
    queue_number: "A-012",
    pet_name: "Milo (Kucing)",
    service: "Vaksinasi & Check-up Rutin",
    status: "DISETUJUI",
    schedule: "Sabtu, 16 Mei 2026 | 16:30 WIB"
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${appointmentData.queue_number}`;

  // Fungsi Download QR
  const downloadQR = () => {
    fetch(qrUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `QR_Antrean_${appointmentData.queue_number}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
  };
    // 1. Logika Jika Belum Mempunyai Antrean
    if (!appointmentData) {
        return (
            <div className="min-h-[400px] flex items-center justify-center p-6">
                <div className="text-center p-10 bg-white rounded-2xl border-2 border-dashed border-slate-200 max-w-sm">
                    <div className="text-5xl mb-4">📅</div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Anda Belum Booking</h2>
                    <p className="text-sm text-slate-500 mb-6">
                        Sepertinya Anda belum memiliki jadwal janji temu untuk hari ini.
                    </p>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/AppointmentForm')}
                        className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-700 shadow-sm"
                    >
                        Buat Janji Temu
                    </button>
                </div>
            </div>
        );
    }

    // 2. Jika Sudah Ada Antrean (Sisa kode tetap sama)
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
                {/* ... konten tiket ... */}
                <div className="bg-blue-600 p-8 text-center text-white relative">
                    <div className="text-4xl mb-3">🐾</div>
                    <h1 className="text-xl font-black uppercase tracking-widest">
                        {appointmentData.clinic_name || "Zeta Pet Care"}
                    </h1>
                    <p className="text-xs opacity-75 mt-1 font-medium">ANTREAN RESMI KLINIK</p>
                    <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-slate-50 rounded-full"></div>
                    <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-slate-50 rounded-full"></div>
                </div>

                <div className="p-10 flex items-center justify-between border-b-2 border-dashed border-slate-100 bg-white">
                    <div className="text-left">
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">
                            Nomor Antrean
                        </p>
                        <h2 className="text-6xl font-black text-slate-800 tracking-tighter">
                            {appointmentData.queue_number}
                        </h2>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                        <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${appointmentData.queue_number}`}
                            alt="QR Antrean"
                            className="w-20 h-20"
                        />
                    </div>
                </div>

                <div className="p-10 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Pasien</label>
                            <p className="text-base font-black text-slate-800">{appointmentData.pet_name}</p>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Status</label>
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-700 uppercase">
                                {appointmentData.status}
                            </span>
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Layanan</label>
                        <p className="text-sm font-bold text-slate-700">{appointmentData.service}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 text-center">Jadwal Kedatangan</label>
                        <p className="text-sm font-black text-slate-800 text-center">{appointmentData.schedule}</p>
                    </div>
                </div>

                <div className="px-10 pb-10 pt-4 relative">
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <p className="text-center text-[11px] text-blue-800 font-medium leading-relaxed">
                            Silakan datang 15 menit sebelum jadwal. Scan QR di atas pada mesin mandiri atau tunjukkan ke resepsionis.
                        </p>
                    </div>
                    <div className="absolute -bottom-2 left-0 right-0 flex justify-center gap-2 overflow-hidden">
                        {[...Array(15)].map((_, i) => (
                            <div key={i} className="min-w-[16px] h-4 bg-slate-50 rounded-full"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QueueTicket;