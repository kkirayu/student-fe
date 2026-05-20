import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  Activity, 
  Search, 
  Filter, 
  MonitorPlay, 
  Plus 
} from 'lucide-react';

const ReceptionistDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');

  // Dummy stats data
  const stats = [
    {
      title: 'Total Antrian Hari Ini',
      value: '42',
      icon: <Users className="text-blue-600 h-6 w-6" />,
      bgIcon: 'bg-blue-100',
    },
    {
      title: 'Sedang Menunggu',
      value: '12',
      icon: <Clock className="text-orange-600 h-6 w-6" />,
      bgIcon: 'bg-orange-100',
    },
    {
      title: 'Sedang Diperiksa',
      value: '3',
      icon: <Activity className="text-purple-600 h-6 w-6" />,
      bgIcon: 'bg-purple-100',
    },
    {
      title: 'Selesai',
      value: '27',
      icon: <CheckCircle className="text-emerald-600 h-6 w-6" />,
      bgIcon: 'bg-emerald-100',
    },
  ];

  // Dummy patient queue data
  const queueData = [
    {
      id: 'Q-001',
      petName: 'Milo',
      species: 'Kucing',
      ownerName: 'Budi Santoso',
      doctor: 'Drh. Anisa',
      status: 'Sedang Diperiksa',
      time: '08:30',
    },
    {
      id: 'Q-002',
      petName: 'Bella',
      species: 'Anjing',
      ownerName: 'Siti Aminah',
      doctor: 'Drh. Bima',
      status: 'Selesai',
      time: '08:45',
    },
    {
      id: 'Q-003',
      petName: 'Luna',
      species: 'Kucing',
      ownerName: 'Rina',
      doctor: 'Drh. Anisa',
      status: 'Menunggu',
      time: '09:15',
    },
    {
      id: 'Q-004',
      petName: 'Rocky',
      species: 'Anjing',
      ownerName: 'Andi',
      doctor: 'Drh. Cita',
      status: 'Menunggu',
      time: '09:30',
    },
    {
      id: 'Q-005',
      petName: 'Kiko',
      species: 'Burung',
      ownerName: 'Joko',
      doctor: 'Drh. Bima',
      status: 'Menunggu',
      time: '09:40',
    },
  ];

  const filteredQueue = queueData.filter(item => {
    const matchesSearch = 
      item.petName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Semua' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Sedang Diperiksa':
        return 'bg-purple-100 text-purple-700';
      case 'Selesai':
        return 'bg-emerald-100 text-emerald-700';
      case 'Menunggu':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Resepsionis</h1>
          <div className="text-sm font-medium text-slate-500">Kelola antrian dan pendaftaran pasien klinik</div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link 
            to="/receptionist/walk-in-registration" 
            className="flex items-center justify-center gap-2 rounded-sm bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Tambah Pasien
          </Link>
        </div>
      </div>

      {/* 2. Stat Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col rounded-sm border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-slate-500">{stat.title}</span>
                <h4 className="mt-2 text-2xl font-bold text-black sm:text-xl md:text-2xl">{stat.value}</h4>
              </div>
              <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${stat.bgIcon}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Pasien List & Filters */}
      <div className="rounded-sm border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-bold text-black">Daftar Antrian Hari Ini</h3>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Cari pasien / pemilik..." 
                  className="w-full rounded-sm border border-slate-300 py-2 pl-9 pr-4 text-sm outline-none focus:border-blue-500 sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative flex items-center">
                <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select 
                  className="w-full appearance-none rounded-sm border border-slate-300 bg-white py-2 pl-9 pr-8 text-sm outline-none focus:border-blue-500 sm:w-auto"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Menunggu">Menunggu</option>
                  <option value="Sedang Diperiksa">Sedang Diperiksa</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
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
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredQueue.length > 0 ? (
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
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                    Tidak ada data antrian yang sesuai dengan filter.
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

export default ReceptionistDashboard;
