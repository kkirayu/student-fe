import React from 'react';
import { PieChart } from 'lucide-react';

const VisitDemographics = () => {
  const demographics = [
    { label: 'Kucing', count: 85, percentage: 65, color: 'bg-blue-600' },
    { label: 'Anjing', count: 32, percentage: 25, color: 'bg-emerald-500' },
    { label: 'Lainnya (Burung, Kelinci)', count: 13, percentage: 10, color: 'bg-orange-400' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Demografi Pasien</h1>
        <p className="text-sm text-slate-500">Laporan tren jenis hewan peliharaan bulan ini.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-black">Distribusi Spesies</h3>
          <div className="space-y-5">
            {demographics.map((item, i) => (
              <div key={i}>
                <div className="mb-1.5 flex justify-between text-sm font-medium">
                  <span className="text-slate-700">{item.label} ({item.count})</span>
                  <span className="text-black">{item.percentage}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100">
                  <div className={`h-2.5 rounded-full ${item.color}`} style={{ width: `${item.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-black">Layanan Paling Laris</h3>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex justify-between border-b border-slate-50 pb-2">
              <span>1. Vaksinasi Tahunan</span> <span className="font-semibold text-black">45x</span>
            </li>
            <li className="flex justify-between border-b border-slate-50 pb-2">
              <span>2. Konsultasi Umum</span> <span className="font-semibold text-black">38x</span>
            </li>
            <li className="flex justify-between pb-2">
              <span>3. Grooming Kucing</span> <span className="font-semibold text-black">20x</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VisitDemographics;