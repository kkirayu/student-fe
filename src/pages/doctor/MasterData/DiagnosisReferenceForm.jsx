import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import Swal from 'sweetalert2'; 
import { doctorService } from '../../../services/doctorService';

const DiagnosisReferenceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    disease_name: '', 
    description: '', 
  });
  const [submitting, setSubmitting] = useState(false);

  // Load data jika dalam mode Edit
  useEffect(() => {
    const loadDiagnosisDetail = async () => {
      if (isEditMode) {
        try {
          const response = await doctorService.getDiagnosisById(id);
          const cleanData = response?.data || response;
          setFormData({
            disease_name: cleanData.disease_name || cleanData.diasese_name || '',
            description: cleanData.description || cleanData.Description || '',
          });
        } catch (error) {
          console.error('Gagal mengambil detail data penyakit:', error);
          
          // Ganti dengan SweetAlert error
          Swal.fire({
            icon: 'error',
            title: 'Gagal Memuat Data',
            text: 'Rincian data penyakit tidak ditemukan atau gagal dimuat.',
            confirmButtonColor: '#3085d6',
          });
          
          navigate('/doctor/diagnosis');
        }
      }
    };
    loadDiagnosisDetail();
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (isEditMode) {
        // Kirim update (PUT)
        await doctorService.updateDiagnosis(id, formData);
        
        // 2. SweetAlert Sukses untuk Edit Mode
        await Swal.fire({
          icon: 'success',
          title: 'Berhasil Diperbarui',
          text: 'Data referensi diagnosis sukses disimpan!',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        // Kirim data baru (POST)
        await doctorService.createDiagnosis(formData);
        
        // 3. SweetAlert Sukses untuk Tambah Mode
        await Swal.fire({
          icon: 'success',
          title: 'Berhasil Ditambahkan',
          text: 'Referensi penyakit baru berhasil didaftarkan!',
          timer: 2000,
          showConfirmButton: false
        });
      }
      navigate('/doctor/diagnosis');
    } catch (error) {
      console.error('Gagal menyimpan data diagnosis:', error);
      
      // 4. SweetAlert Gagal/Error saat submit
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menyimpan',
        text: error.response?.data?.message || 'Terjadi kesalahan sistem saat menyimpan data.',
        confirmButtonColor: '#d33',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          to="/doctor/diagnosis" 
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isEditMode ? 'Edit Data Diagnosis' : 'Tambah Referensi Diagnosis'}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {isEditMode ? 'Perbarui informasi medis penyakit pada kamus.' : 'Masukkan data istilah medis penyakit baru untuk referensi dokter.'}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <form onSubmit={handleSubmit}>
          
          {/* Area Input Utama */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-6">
              
              {/* Disease Name */}
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-800">
                  Nama Penyakit (Disease Name) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" 
                  name="disease_name" 
                  value={formData.disease_name} 
                  onChange={handleChange}
                  placeholder="Contoh: Feline Panleukopenia, Flu, Scabies"
                  className="w-full rounded-md border border-slate-300 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-800">
                  Deskripsi / Keterangan Penyakit <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tuliskan keterangan klinis, gejala umum, atau penanganan primer..."
                  className="w-full rounded-md border border-slate-300 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  required
                />
              </div>

            </div>
          </div>

          {/* Area Footer / Tombol Aksi */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:px-8">
            <Link
              to="/doctor/diagnosis"
              className="rounded-md px-6 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-200 hover:text-slate-900"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 disabled:bg-blue-400"
            >
              <Save className="h-4 w-4" />
              {submitting ? 'Menyimpan...' : 'Simpan Data'}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default DiagnosisReferenceForm;