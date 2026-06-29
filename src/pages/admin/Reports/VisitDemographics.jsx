import React, { useState, useEffect } from 'react';
import { PieChart, Loader2 } from 'lucide-react';
import { getVisitDemographics } from '../../../services/adminService';

const VisitDemographics = () => {
  const [speciesData, setSpeciesData] = useState([]);
  const [breedData, setBreedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('Bulan Ini');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        let startDate = '';
        const endDate = new Date().toISOString().split('T')[0];

        if (dateFilter === 'Bulan Ini') {
          const start = new Date();
          start.setDate(1);
          startDate = start.toISOString().split('T')[0];
        } else if (dateFilter === 'Tahun Ini') {
          const start = new Date();
          start.setMonth(0, 1);
          startDate = start.toISOString().split('T')[0];
        }

        const response = await getVisitDemographics(startDate, endDate);
        const data = response?.data || response || {};
        
        const species = data.visits_by_species || [];
        const breeds = data.visits_by_breed || [];

        // Calculate total for percentage
        const totalSpecies = species.reduce((acc, curr) => acc + Number(curr.total_visits), 0);
        
        const colors = ['bg-blue-600', 'bg-emerald-500', 'bg-orange-400', 'bg-purple-500', 'bg-pink-500'];

        const mappedSpecies = species.map((item, index) => ({
          label: item.species || 'Lainnya',
          count: Number(item.total_visits),
          percentage: totalSpecies > 0 ? Math.round((Number(item.total_visits) / totalSpecies) * 100) : 0,
          color: colors[index % colors.length]
        }));

        setSpeciesData(mappedSpecies);
        setBreedData(breeds);
      } catch (error) {
        console.error('Error fetching demographics report:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dateFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Demografi Pasien</h1>
          <p className="text-sm text-slate-500">Laporan tren jenis hewan peliharaan yang ditangani klinik.</p>
        </div>
        <select 
          value={dateFilter} 
          onChange={(e) => setDateFilter(e.target.value)}
          className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none"
        >
          <option value="Bulan Ini">Bulan Ini</option>
          <option value="Tahun Ini">Tahun Ini</option>
          <option value="Semua Waktu">Semua Waktu</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-sm">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-2" />
          <p className="text-sm text-slate-500">Memuat data demografi...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-bold text-black">Distribusi Spesies</h3>
            <div className="space-y-5">
              {speciesData.length > 0 ? speciesData.map((item, i) => (
                <div key={i}>
                  <div className="mb-1.5 flex justify-between text-sm font-medium">
                    <span className="text-slate-700">{item.label} ({item.count})</span>
                    <span className="text-black">{item.percentage}%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-100">
                    <div className={`h-2.5 rounded-full ${item.color}`} style={{ width: `${item.percentage}%` }}></div>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-slate-500 text-center py-4">Belum ada data kunjungan.</p>
              )}
            </div>
          </div>

          <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-black">Distribusi Ras (Breed) Teratas</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              {breedData.length > 0 ? breedData.slice(0, 10).map((breed, i) => (
                <li key={i} className="flex justify-between border-b border-slate-50 pb-2">
                  <span>{i + 1}. {breed.breed || 'Tidak Diketahui'}</span> 
                  <span className="font-semibold text-black">{breed.total_visits} kunjungan</span>
                </li>
              )) : (
                <p className="text-sm text-slate-500 text-center py-4">Belum ada data kunjungan ras.</p>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitDemographics;