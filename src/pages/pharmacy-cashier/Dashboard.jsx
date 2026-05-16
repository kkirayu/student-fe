import React, { useState, useEffect } from 'react';
import { BriefcaseMedical ,Users, TrendingUp, AlertTriangle } from 'lucide-react';

const PharmacyDashboard = () => {
  const [medicines, setMedicines] = useState([
    { id: 1, name: 'Paracetamol', stock: 50, minStock: 100, category: 'Analgesik' },
    { id: 2, name: 'Amoxicillin', stock: 75, minStock: 150, category: 'Antibiotik' },
    { id: 3, name: 'Ibuprofen', stock: 200, minStock: 100, category: 'Analgesik' },
    { id: 4, name: 'Vitamin C', stock: 30, minStock: 200, category: 'Vitamin' },
    { id: 5, name: 'Antasida', stock: 120, minStock: 150, category: 'Pencernaan' },
  ]);

  const [stats, setStats] = useState({
    totalItems: 0,
    lowStock: 0,
    outOfStock: 0,
    totalValue: 0,
  });

  useEffect(() => {
    const lowStockCount = medicines.filter(m => m.stock < m.minStock && m.stock > 0).length;
    const outOfStockCount = medicines.filter(m => m.stock === 0).length;
    
    setStats({
      totalItems: medicines.length,
      lowStock: lowStockCount,
      outOfStock: outOfStockCount,
      totalValue: medicines.reduce((sum, m) => sum + m.stock, 0),
    });
  }, [medicines]);

  const lowStockMedicines = medicines.filter(m => m.stock < m.minStock);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Apotek & Inventaris</h1>
          <p className="text-gray-600">Ringkasan ketersediaan stok obat dan barang</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Item</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalItems}</p>
            </div>
            <BriefcaseMedical className="text-blue-500" size={40} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Stok Rendah</p>
              <p className="text-3xl font-bold text-yellow-500">{stats.lowStock}</p>
            </div>
            <TrendingUp className="text-yellow-500" size={40} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Simple CSS Chart for Stock */}
        <div className="col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Grafik Ketersediaan Stok</h2>
          <div className="space-y-4">
            {medicines.map((m) => {
              const percentage = Math.min((m.stock / (m.minStock * 2)) * 100, 100);
              const isLow = m.stock < m.minStock;
              return (
                <div key={m.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{m.name}</span>
                    <span className="text-gray-500">{m.stock} / {m.minStock} {isLow && <span className="text-red-500 font-bold">(Rendah)</span>}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${isLow ? 'bg-red-500' : 'bg-green-500'}`} 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={24} /> Peringatan Stok
          </h2>
          <div className="space-y-3">
            {lowStockMedicines.length > 0 ? (
              lowStockMedicines.map(medicine => (
                <div key={medicine.id} className="bg-red-50 p-3 rounded-md">
                  <p className="font-semibold text-red-900 text-sm">{medicine.name}</p>
                  <p className="text-red-700 text-xs">
                    Sisa Stok: {medicine.stock} (Min: {medicine.minStock})
                  </p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                <p className="text-sm">Semua stok aman</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDashboard;