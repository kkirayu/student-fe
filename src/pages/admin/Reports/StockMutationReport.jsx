import React from 'react';

const StockMutationReport = () => {
  const stocks = [
    { name: 'Vaksin Felocell 4', category: 'Vaksin', in: 50, out: 12, remain: 38, status: 'Aman' },
    { name: 'Royal Canin Recovery', category: 'Makanan', in: 0, out: 8, remain: 4, status: 'Stok Menipis' },
    { name: 'Obat Cacing Drontal', category: 'Obat', in: 100, out: 98, remain: 2, status: 'Kritis' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Rekap Mutasi Stok Apotek</h1>
      <p className="text-sm text-slate-500">Pemantauan pergerakan barang masuk dan keluar dari apotek.</p>

      <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-3 font-semibold">Nama Barang</th>
              <th className="px-6 py-3 font-semibold text-center">Masuk (In)</th>
              <th className="px-6 py-3 font-semibold text-center">Keluar (Out)</th>
              <th className="px-6 py-3 font-semibold text-center">Sisa Stok</th>
              <th className="px-6 py-3 font-semibold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {stocks.map((stock, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-black">{stock.name}</div>
                  <div className="text-xs text-slate-500">{stock.category}</div>
                </td>
                <td className="px-6 py-4 text-center text-emerald-600 font-medium">+{stock.in}</td>
                <td className="px-6 py-4 text-center text-red-500 font-medium">-{stock.out}</td>
                <td className="px-6 py-4 text-center font-bold text-black">{stock.remain}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                    stock.status === 'Aman' ? 'bg-emerald-100 text-emerald-700' : 
                    stock.status === 'Kritis' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {stock.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockMutationReport;