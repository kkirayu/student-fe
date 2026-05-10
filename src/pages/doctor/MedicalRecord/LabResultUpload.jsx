import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload, FileText, Trash2 } from 'lucide-react';

const LabResultUpload = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // 1. Sesuaikan State dengan kebutuhan Lab (Struktur meniru StaffForm)
  const [formData, setFormData] = useState({
    patientName: '',
    testType: '',
    labNotes: '',
    testDate: new Date().toISOString().split('T')[0],
    status: 'Selesai',
  });

  // 2. Data dummy untuk tabel riwayat (Struktur meniru StaffList)
  const [labHistory] = useState([
    { id: 1, name: 'Mochi', type: 'Cek Darah', date: '2026-05-10', file: 'hasil_lab_mochi.pdf' },
    { id: 2, name: 'Bruno', type: 'Rontgen', date: '2026-05-09', file: 'xray_bruno.jpg' },
  ]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('File Lab disimpan:', formData);
    navigate('/doctor/dashboard');
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      
      {/* Header - Identik dengan StaffForm teman Anda */}
      <div className="flex items-center gap-4">
        <Link 
          to="/doctor/dashboard" 
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isEditMode ? 'Edit Hasil Lab' : 'Upload Hasil Lab Baru'}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Unggah dokumen hasil laboratorium atau radiologi pasien.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Kolom Kiri: Form Input (Identik dengan StaffForm) */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-800">Nama Pasien</label>
                <input
                  type="text" name="patientName" value={formData.patientName} onChange={handleChange}
                  placeholder="Nama Anabul"
                  className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-800">Jenis Tes</label>
                <select
                  name="testType" value={formData.testType} onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm outline-none focus:border-blue-600"
                >
                  <option value="">Pilih Jenis</option>
                  <option value="Darah">Tes Darah</option>
                  <option value="Rontgen">Rontgen / X-Ray</option>
                  <option value="USG">USG</option>
                </select>
              </div>

              {/* Area Upload File */}
              <div className="mt-4 flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-200 p-4 hover:bg-slate-50 transition-all cursor-pointer">
                <Upload className="h-8 w-8 text-slate-400 mb-2" />
                <span className="text-xs text-slate-500 text-center">Klik untuk pilih file (PDF/JPG)</span>
                <input type="file" className="hidden" />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-md bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-all"
              >
                <Save className="h-4 w-4" /> Simpan Hasil
              </button>
            </form>
          </div>
        </div>

        {/* Kolom Kanan: Riwayat Terakhir (Identik dengan StaffList) */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-700 uppercase">Riwayat Upload Terakhir</h3>
            </div>
            <table className="w-full table-auto text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Pasien</th>
                  <th className="px-4 py-3">Tipe</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {labHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">{item.name}</td>
                    <td className="px-4 py-3 text-slate-600">{item.type}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><FileText className="h-4 w-4" /></button>
                        <button className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LabResultUpload;