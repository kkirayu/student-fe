import React from 'react';
import { 
  Dog, 
  Calendar, 
  Activity, 
  Clock, 
  FileText, 
  AlertCircle,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { Link } from 'react-router-dom';

const OwnerDashboard = () => {
  const stats = [
    {
      title: 'Hewan Peliharaanku',
      value: '3 Ekor',
      subtitle: 'Luna, Bruno, Milo',
      icon: <Dog className="text-blue-600 h-6 w-6" />, 
      bgIcon: 'bg-blue-100',
    },
    {
      title: 'Janji Temu Aktif',
      value: '1 Jadwal',
      subtitle: 'Terdekat: 12 Mei 2026',
      icon: <Calendar className="text-emerald-600 h-6 w-6" />,
      bgIcon: 'bg-emerald-100',
    },
    {
      title: 'Riwayat Rekam Medis',
      value: '8 Catatan',
      subtitle: 'Terakhir: 10 Mei 2026',
      icon: <FileText className="text-orange-600 h-6 w-6" />,
      bgIcon: 'bg-orange-100',
    },
    {
      title: 'Tagihan Tertunda',
      value: 'Rp 350.000',
      subtitle: '1 Invoice Belum Lunas',
      icon: <DollarSign className="text-rose-600 h-6 w-6" />,
      bgIcon: 'bg-rose-100',
    },
  ];

  const upcomingAppointments = [
    {
      petName: 'Luna',
      species: 'Kucing',
      doctor: 'Drh. Bunga',
      date: '12 Mei 2026',
      time: '10:00 WIB',
      purpose: 'Vaksinasi Tricat & Konsultasi Nafsu Makan',
      status: 'Dikonfirmasi',
      statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    },
    {
      petName: 'Bruno',
      species: 'Anjing',
      doctor: 'Drh. Bunga',
      date: '20 Mei 2026',
      time: '14:00 WIB',
      purpose: 'Scaling Gigi (Pembersihan Karang)',
      status: 'Menunggu',
      statusColor: 'text-amber-600 bg-amber-50 border-amber-200'
    }
  ];

  const healthReminders = [
    {
      petName: 'Luna',
      title: 'Vaksinasi Rabies Tahunan',
      dueDate: '15 Juni 2026',
      type: 'Vaksinasi',
      status: 'Penting',
      statusColor: 'bg-rose-100 text-rose-800'
    },
    {
      petName: 'Bruno',
      title: 'Pemberian Obat Cacing Bulanan',
      dueDate: '10 Mei 2026',
      type: 'Pencegahan',
      status: 'Mendekati',
      statusColor: 'bg-amber-100 text-amber-800'
    },
    {
      petName: 'Milo',
      title: 'Check-up Telinga Pascainfeksi',
      dueDate: '24 Mei 2026',
      type: 'Kontrol',
      status: 'Rutin',
      statusColor: 'bg-blue-100 text-blue-800'
    }
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Dashboard */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Halo, Cita Nurcahyani</h1>
          <p className="text-sm text-slate-500">Selamat datang kembali! Berikut adalah ringkasan kesehatan peliharaan Anda.</p>
        </div>
        <div className="text-sm font-medium text-slate-500">Hari ini: 10 Mei 2026</div>
      </div>

      {/* 2. Stat Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col justify-between rounded-sm border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-500">{stat.title}</span>
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${stat.bgIcon}`}>
                {stat.icon}
              </div>
            </div>
            <div>
              <h4 className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</h4>
              <p className="text-xs text-slate-400 font-medium">{stat.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Main Content Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        
        {/* Jadwal Janji Temu Terdekat */}
        <div className="col-span-1 rounded-sm border border-slate-200 bg-white p-6 shadow-sm lg:col-span-8 flex flex-col justify-between">
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Jadwal Janji Temu Terdekat</h3>
              <Link to="/owner/booking/history" className="text-sm font-semibold text-blue-600 hover:underline">
                Lihat Semua Riwayat
              </Link>
            </div>

            <div className="space-y-4">
              {upcomingAppointments.map((appt, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded border border-slate-100 bg-slate-50 gap-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex h-10 w-10 items-center justify-center rounded bg-blue-100 text-blue-600 font-bold">
                      {appt.petName[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900">{appt.petName}</h4>
                        <span className="text-xs text-slate-500">({appt.species})</span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{appt.purpose}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {appt.date} @ {appt.time}
                        </span>
                        <span className="font-medium text-slate-700">
                          Dokter: {appt.doctor}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center rounded border px-2.5 py-1 text-xs font-semibold ${appt.statusColor} self-start sm:self-center`}>
                    {appt.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link 
              to="/owner/booking" 
              className="inline-flex w-full items-center justify-center gap-2 rounded bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              <Calendar className="h-4 w-4" />
              Buat Janji Temu Baru
            </Link>
          </div>
        </div>

        {/* Reminders & Edukasi */}
        <div className="col-span-1 rounded-sm border border-slate-200 bg-white p-6 shadow-sm lg:col-span-4">
          <h3 className="mb-4 text-lg font-bold text-slate-900">Pengingat & Vaksinasi</h3>
          <div className="space-y-4">
            {healthReminders.map((reminder, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-md border border-slate-100 bg-slate-50">
                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">{reminder.type}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${reminder.statusColor}`}>
                      {reminder.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mt-1">{reminder.title}</h4>
                  <p className="text-xs text-slate-600 mt-1">Hewan: <span className="font-semibold">{reminder.petName}</span></p>
                  <p className="text-xs text-slate-400 mt-1">Jatuh Tempo: {reminder.dueDate}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-sm border border-blue-100">
            <div className="flex items-center gap-2 mb-2 text-blue-900">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-bold uppercase tracking-wider">Layanan Darurat</span>
            </div>
            <p className="text-xs text-blue-700 leading-relaxed">
              Klinik beroperasi 24 Jam untuk kondisi darurat. Hubungi Call Center di <span className="font-bold text-blue-900">0812-999-888</span> untuk ambulans hewan.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OwnerDashboard;