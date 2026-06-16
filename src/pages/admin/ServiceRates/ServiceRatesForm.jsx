import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Tag } from 'lucide-react';
import { getServiceById, createService, updateService } from '../../../services/adminService';

const ServiceRatesForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    status: 'Tersedia',
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchDetail = async () => {
        setIsLoadingData(true);
        try {
          const response = await getServiceById(id);
          const data = response?.data || response;
          setFormData({
            name: data.name || '',
            category: data.category || '',
            price: data.price ? String(data.price) : '',
            status: data.status || 'Tersedia',
            description: data.description || ''
          });
        } catch (error) {
          console.error('Failed to fetch service detail:', error);
          alert('Gagal mengambil data layanan.');
          navigate('/admin/services');
        } finally {
          setIsLoadingData(false);
        }
      };
      fetchDetail();
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const payload = {
        ...formData,
        price: Number(formData.price)
      };

      if (isEditMode) {
        await updateService(id, payload);
        alert('Layanan berhasil diperbarui!');
      } else {
        await createService(payload);
        alert('Layanan baru berhasil ditambahkan!');
      }
      navigate('/admin/services');
    } catch (error) {
      console.error('Failed to save service:', error);
      alert('Terjadi kesalahan saat menyimpan data layanan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/services')}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isEditMode ? 'Edit Layanan & Tarif' : 'Tambah Layanan Baru'}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {isEditMode ? 'Perbarui rincian tarif layanan.' : 'Tambahkan layanan medis atau fasilitas baru ke dalam sistem.'}
          </p>
        </div>
      </div>

      <div className="rounded-sm border border-slate-200 bg-white shadow-sm">
        {isLoadingData ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-2" />
            <p className="text-sm font-medium">Mengambil data layanan...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                
                <div className="sm:col-span-2">
                  <label className="mb-2.5 block text-sm font-semibold text-slate-800">
                    Nama Layanan <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Tag className="h-5 w-5" />
                    </span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Contoh: Operasi Steril Kucing Jantan"
                      className="w-full rounded-md border border-slate-300 bg-transparent py-2.5 pl-12 pr-4 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2.5 block text-sm font-semibold text-slate-800">
                    Kategori <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-md border border-slate-300 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    required
                  >
                    <option value="" disabled>Pilih kategori</option>
                    <option value="Medis">Medis</option>
                    <option value="Vaksin">Vaksin</option>
                    <option value="Grooming">Grooming</option>
                    <option value="Bedah">Bedah</option>
                    <option value="Fasilitas">Fasilitas</option>
                    <option value="Laboratorium">Laboratorium</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2.5 block text-sm font-semibold text-slate-800">
                    Status Layanan <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded-md border border-slate-300 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    required
                  >
                    <option value="Tersedia">Tersedia</option>
                    <option value="Penuh">Penuh / Tidak Tersedia</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2.5 block text-sm font-semibold text-slate-800">
                    Harga / Tarif Dasar (Rp) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">
                      Rp
                    </span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      className="w-full rounded-md border border-slate-300 bg-transparent py-2.5 pl-12 pr-4 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2.5 block text-sm font-semibold text-slate-800">
                    Deskripsi / Catatan Tambahan
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Masukkan detail mengenai prosedur layanan ini..."
                    className="w-full rounded-md border border-slate-300 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  ></textarea>
                </div>

              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:px-8">
              <button
                type="button"
                onClick={() => navigate('/admin/services')}
                className="rounded-md px-6 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-200 hover:text-slate-900"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {isEditMode ? 'Simpan Perubahan' : 'Simpan Layanan'}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ServiceRatesForm;