import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { doctorService } from '../../../services/doctorService';

const DiagnosisReferenceList = () => {
  const [diagnosisList, setDiagnosisList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. Ambil data dari Backend saat komponen dimuat
  const fetchDiagnoses = async () => {
    try {
      setLoading(true);
      const response = await doctorService.getDiagnoses();
      // Handle fallback jika dibungkus data.data atau data langsung
      const cleanData = response?.data?.data || response?.data || response;
      setDiagnosisList(Array.isArray(cleanData) ? cleanData : []);
    } catch (error) {
      console.error('Gagal memuat kamus penyakit:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnoses();
  }, []);

  // 2. Fungsi Hapus Data
  const handleDelete = async (id, name) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus "${name}" dari kamus penyakit?`)) {
      try {
        await doctorService.deleteDiagnosis(id);
        alert('Data diagnosis berhasil dihapus');
        fetchDiagnoses(); // Refresh list data
      } catch (error) {
        console.error('Gagal menghapus diagnosis:', error);
        alert('Gagal menghapus data penyakit.');
      }
    }
  };

  // 3. Filter Pencarian Lokal
  const filteredData = diagnosisList.filter((item) => {
    const name = item.disease_name || item.diasese_name || '';
    const desc = item.description || item.Description || '';
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      desc.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Kamus Penyakit (Diagnosis Reference)</h1>
          <p className="text-sm text-slate-500">Kelola daftar referensi penyakit dan diagnosis medis klinik VetCare Connect.</p>
        </div>
        
        <Link 
          to="/doctor/diagnosis/add" 
          className="inline-flex items-center justify-center gap-2 rounded bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-all shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Tambah Referensi Diagnosis
        </Link>
      </div>

      {/* Area Tabel Utama */}
      <div className="rounded-sm border border-slate-200 bg-white shadow-sm">
        
        {/* Toolbar Pencarian */}
        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="h-5 w-5" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama penyakit atau deskripsi..."
              className="w-full rounded border border-slate-300 bg-transparent py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Tabel Data */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-6 py-4">Nama Penyakit</th>
                <th className="px-6 py-4">Deskripsi / Gejala Umum</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-slate-400">
                    Memuat data kamus penyakit...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-slate-400">
                    Tidak ada data diagnosis yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => {
                  const id = item.id;
                  const diseaseName = item.disease_name || item.diasese_name;
                  const description = item.description || item.Description;

                  return (
                    <tr key={id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{diseaseName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-600 max-w-xl truncate">{description}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link 
                            to={`/doctor/diagnosis/add/${id}`} 
                            className="text-blue-600 hover:text-blue-800 transition-colors" 
                            title="Edit Data"
                          >
                            <Edit className="h-5 w-5" />
                          </Link>
                          <button 
                            onClick={() => handleDelete(id, diseaseName)}
                            className="text-red-500 hover:text-red-700 transition-colors" 
                            title="Hapus Penyakit"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        <div className="border-t border-slate-100 p-4 text-right text-xs text-slate-500">
          Menampilkan {filteredData.length} data diagnosis.
        </div>
      </div>
    </div>
  );
};

export default DiagnosisReferenceList;