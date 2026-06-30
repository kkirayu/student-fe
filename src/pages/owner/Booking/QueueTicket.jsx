import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { QrCode, Calendar, Clock, X, Download, Loader2, AlertCircle, ClipboardList, Tag, Stethoscope, User } from 'lucide-react';
import { getMyAppointments } from '../../../services/ownerService';

// ── helpers ──────────────────────────────────────────────────────────────────

const STATUS_MAP = {
  Menunggu: {
    label: 'MENUNGGU KONFIRMASI',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    dot: 'bg-amber-400',
    canShowQR: false,
  },
  Disetujui: {
    label: 'DISETUJUI',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    canShowQR: true,
  },
  'Dalam Periksa': {
    label: 'DALAM PERIKSA',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    dot: 'bg-purple-500',
    canShowQR: true,
  },
  Selesai: {
    label: 'SELESAI',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    dot: 'bg-blue-400',
    canShowQR: false,
  },
  Batal: {
    label: 'BATAL',
    color: 'bg-red-100 text-red-700 border-red-200',
    dot: 'bg-red-400',
    canShowQR: false,
  },
};

const getStatusMeta = (status) =>
  STATUS_MAP[status] ?? {
    label: status?.toUpperCase() ?? '-',
    color: 'bg-slate-100 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
    canShowQR: false,
  };

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// Format nomor antrian: "ZETA-A-001" atau "ZETA-001"
const formatQueueNumber = (queueNumber) => {
  if (!queueNumber) return 'ZETA-???';
  return `ZETA-${queueNumber}`;
};

// Normalisasi response API — handle flat { owner_id } atau { success, data: { owner_id } }
const normalizeTicket = (raw) => {
  if (!raw) return null;
  if (raw?.owner_id !== undefined || raw?.queue_number !== undefined) return raw;
  if (raw?.data?.owner_id !== undefined || raw?.data?.queue_number !== undefined) return raw.data;
  return raw;
};

// ── component ─────────────────────────────────────────────────────────────────

const QueueTicket = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Jika navigasi dari AppointmentForm, langsung buka modal tiket baru
  const newAppointment = location.state?.appointment ?? null;

  useEffect(() => {
    const extractArray = (res) => {
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.data)) return res.data;
      if (Array.isArray(res?.data?.data)) return res.data.data;
      return [];
    };

    const fetchTickets = async () => {
      try {
        setIsLoading(true);
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const ownerId = storedUser.id;
        
        const res = await getMyAppointments({ owner_id: ownerId });
        const data = extractArray(res).map(normalizeTicket);
        setTickets(data);

        if (newAppointment) {
          window.history.replaceState({}, '');
        }
      } catch (err) {
        console.error('Gagal memuat tiket:', err);
        setErrorMessage('Gagal memuat data tiket. Silakan refresh halaman.');
        if (newAppointment) {
          setTickets([normalizeTicket(newAppointment)]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const downloadQR = (queueNumber) => {
    const formatted = formatQueueNumber(queueNumber);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${formatted}`;
    fetch(qrUrl)
      .then((r) => r.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Tiket_${formatted}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
  };

  // ── render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Tiket Antrean Aktif</h2>
          <p className="text-sm text-slate-500">
            Daftar janji temu Anda yang akan datang beserta akses tiket QR.
          </p>
        </div>
        <button
          onClick={() => navigate('/owner/booking')}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700"
        >
          + Buat Janji Temu Baru
        </button>
      </div>

      {/* Error */}
      {errorMessage && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4 font-bold">No. Antrean</th>
                <th className="px-6 py-4 font-bold">Jadwal &amp; Waktu</th>
                <th className="px-6 py-4 font-bold">Tipe</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Akses Tiket</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-500" />
                    <p className="mt-2 text-sm text-slate-500">Memuat data tiket...</p>
                  </td>
                </tr>
              ) : tickets.length > 0 ? (
                tickets.map((ticket, index) => {
                  const meta = getStatusMeta(ticket.status);
                  const formatted = formatQueueNumber(ticket.queue_number);
                  return (
                    <tr key={ticket.id ?? index} className="transition-colors hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <span className="rounded-md bg-blue-50 px-2.5 py-1 text-sm font-black text-blue-700 tracking-wide">
                          {formatted}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          {formatDate(ticket.appointment_date)}
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="h-3.5 w-3.5" />
                          {ticket.appointment_time} WIB
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">
                        {ticket.booking_type ?? '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${meta.color}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                          {meta.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {meta.canShowQR ? (
                          <button
                            onClick={() => setSelectedTicket(normalizeTicket(ticket))}
                            className="inline-flex items-center gap-1.5 rounded-md bg-slate-800 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-slate-700"
                          >
                            <QrCode className="h-3.5 w-3.5" /> Lihat Tiket
                          </button>
                        ) : ticket.status === 'Menunggu' ? (
                          <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-600">
                            ⏳ Menunggu Konfirmasi
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-400">
                            Tidak Tersedia
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-slate-500">
                    Tidak ada tiket antrean saat ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MODAL TIKET QR
      ══════════════════════════════════════════ */}
      {selectedTicket && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
            onClick={() => setSelectedTicket(null)}
          />

          {/* Ticket Card */}
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl">

            {/* Close Button */}
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/20 p-1.5 text-white backdrop-blur-md transition-colors hover:bg-white/40"
            >
              <X className="h-5 w-5" />
            </button>

            {/* ── HEADER GRADIENT ── */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 px-8 pb-8 pt-8 text-center text-white">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

              <div className="relative">
                <div className="mb-2 text-3xl">🐾</div>
                <h1 className="text-xl font-black uppercase tracking-widest">Zeta Pet Care</h1>
                <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.25em] opacity-70">
                  Tiket Antrean Resmi
                </p>
              </div>

              {/* Cutout circles */}
              <div className="absolute -bottom-4 -left-4 h-8 w-8 rounded-full bg-slate-100" />
              <div className="absolute -bottom-4 -right-4 h-8 w-8 rounded-full bg-slate-100" />
            </div>

            {/* ── NOMOR ANTRIAN + QR ── */}
            <div className="border-b-2 border-dashed border-slate-200 bg-white px-8 py-6">
              <div className="flex items-center justify-between gap-4">
                {/* Queue Number */}
                <div>
                  <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                    Nomor Antrean
                  </p>
                  <h2 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                    {formatQueueNumber(selectedTicket.queue_number)}
                  </h2>
                  <div className="mt-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${getStatusMeta(selectedTicket.status).color}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${getStatusMeta(selectedTicket.status).dot}`} />
                      {getStatusMeta(selectedTicket.status).label}
                    </span>
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex-shrink-0 rounded-2xl border-2 border-slate-100 bg-white p-2 shadow-md">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=96x96&data=${formatQueueNumber(selectedTicket.queue_number)}&margin=4`}
                    alt="QR Antrean"
                    className="h-24 w-24 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* ── DATA PEMESANAN ── */}
            <div className="bg-slate-50 px-8 py-5">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Detail Pemesanan
              </p>
              <div className="space-y-3">

                {/* Jadwal */}
                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100">
                    <Calendar className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Jadwal</p>
                    <p className="text-sm font-bold text-slate-800">
                      {formatDate(selectedTicket.appointment_date)}
                    </p>
                    <p className="text-xs text-slate-500">{selectedTicket.appointment_time} WIB</p>
                  </div>
                </div>

                {/* Pet & Tipe */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                      <User className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pet ID</p>
                      <p className="text-sm font-bold text-slate-800">#{selectedTicket.pet_id}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100">
                      <Tag className="h-3.5 w-3.5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tipe</p>
                      <p className="text-sm font-bold text-slate-800">{selectedTicket.booking_type ?? 'Online'}</p>
                    </div>
                  </div>
                </div>

                {/* Layanan */}
                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100">
                    <Stethoscope className="h-3.5 w-3.5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Layanan</p>
                    <p className="text-sm font-bold text-slate-800">
                      {selectedTicket.service_name ?? `Service #${selectedTicket.service_id}`}
                    </p>
                  </div>
                </div>

                {/* Keluhan */}
                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-rose-100">
                    <ClipboardList className="h-3.5 w-3.5 text-rose-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Keluhan Awal</p>
                    <p className="mt-0.5 text-sm font-semibold leading-snug text-slate-700">
                      {selectedTicket.initial_complaint ?? '-'}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* ── FOOTER ── */}
            <div className="bg-white px-8 pb-6 pt-4">
              <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                <p className="text-center text-[11px] font-medium leading-relaxed text-blue-800">
                  📌 Tunjukkan tiket ini atau scan QR di resepsionis klinik.<br />
                  Harap datang <span className="font-black">15 menit</span> sebelum jadwal.
                </p>
              </div>
              <button
                onClick={() => downloadQR(selectedTicket.queue_number)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
              >
                <Download className="h-4 w-4" /> Unduh Tiket QR
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default QueueTicket;