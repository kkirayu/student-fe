import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { getStockMutationReport } from '../../../services/adminService';

const StockMutationReport = () => {
  const [stocksData, setStocksData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('Semua Waktu');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        let startDate = '';
        const endDate = new Date().toISOString().split('T')[0];

        if (dateFilter === '7 Hari Terakhir') {
          const start = new Date();
          start.setDate(start.getDate() - 7);
          startDate = start.toISOString().split('T')[0];
        } else if (dateFilter === 'Bulan Ini') {
          const start = new Date();
          start.setDate(1);
          startDate = start.toISOString().split('T')[0];
        } else if (dateFilter === 'Tahun Ini') {
          const start = new Date();
          start.setMonth(0, 1);
          startDate = start.toISOString().split('T')[0];
        }

        const response = await getStockMutationReport(startDate, endDate);
        const data = response?.data?.mutations || response?.mutations || {};

        // Transform object into array
        const mappedStocks = Object.keys(data).map(productName => {
          return {
            name: productName,
            in: Number(data[productName]?.In || 0),
            out: Number(data[productName]?.Out || 0)
          };
        });

        setStocksData(mappedStocks);
      } catch (error) {
        console.error('Error fetching stock mutation report:', error);
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
          <h1 className="text-2xl font-bold text-slate-800">Rekap Mutasi Stok Apotek</h1>
          <p className="text-sm text-slate-500">Pemantauan pergerakan barang masuk dan keluar dari apotek.</p>
        </div>
        <select 
          value={dateFilter} 
          onChange={(e) => setDateFilter(e.target.value)}
          className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none"
        >
          <option value="7 Hari Terakhir">7 Hari Terakhir</option>
          <option value="Bulan Ini">Bulan Ini</option>
          <option value="Tahun Ini">Tahun Ini</option>
          <option value="Semua Waktu">Semua Waktu</option>
        </select>
      </div>

      <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-3 font-semibold">Nama Produk</th>
              <th className="px-6 py-3 font-semibold text-center">Barang Masuk (In)</th>
              <th className="px-6 py-3 font-semibold text-center">Barang Keluar (Out)</th>
              <th className="px-6 py-3 font-semibold text-center">Selisih Periode</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan="4" className="py-10 text-center text-slate-500">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600 mb-2" />
                  Memuat mutasi stok...
                </td>
              </tr>
            ) : stocksData.length > 0 ? (
              stocksData.map((stock, i) => {
                const diff = stock.in - stock.out;
                return (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-black">{stock.name}</div>
                    </td>
                    <td className="px-6 py-4 text-center text-emerald-600 font-bold">+{stock.in}</td>
                    <td className="px-6 py-4 text-center text-red-500 font-bold">-{stock.out}</td>
                    <td className="px-6 py-4 text-center font-bold">
                      <span className={`px-2 py-1 rounded text-xs ${diff > 0 ? 'bg-emerald-50 text-emerald-600' : diff < 0 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600'}`}>
                        {diff > 0 ? `+${diff}` : diff}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="py-10 text-center text-slate-500">
                  Tidak ada pergerakan mutasi stok pada periode ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockMutationReport;