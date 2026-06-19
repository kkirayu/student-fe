import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { createPet, getPetById, updatePet } from '../../../services/ownerService';

const PetForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    gender: '',
    dob: '',
    color: '',
    distinctive_traits: '',
    allergies: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      const fetchPet = async () => {
        setIsFetching(true);
        try {
          const data = await getPetById(id);
          const pet = data.data ?? data;
          setFormData({
            name: pet.name ?? '',
            species: pet.species ?? '',
            breed: pet.breed ?? '',
            gender: pet.gender ?? '',
            dob: pet.dob ?? '',
            color: pet.color ?? '',
            distinctive_traits: pet.distinctive_traits ?? '',
            allergies: pet.allergies ?? '',
          });
        } catch (err) {
          console.error(err);
          setError('Gagal memuat data pet.');
        } finally {
          setIsFetching(false);
        }
      };
      fetchPet();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    // TODO: ganti owner_id dengan ID dari auth context setelah fitur login selesai
    const payload = { owner_id: 1, ...formData };
    try {
      if (isEditMode) {
        await updatePet(id, payload);
      } else {
        await createPet(payload);
      }
      navigate('/owner/pets');
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message ?? 'Terjadi kesalahan. Silakan coba lagi.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-blue-500">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-sm text-slate-500">Memuat data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/owner/pets"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isEditMode ? 'Edit Data Pets' : 'Tambah Pets Baru'}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {isEditMode ? 'Perbarui informasi pets.' : 'Daftarkan akun pets baru beserta detailnya.'}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <form onSubmit={handleSubmit}>

          {/* Error Banner */}
          {error && (
            <div className="mx-6 mt-6 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Area Input Utama */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">

              {/* Nama Pet */}
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-800">
                  Nama Pets <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" name="name" value={formData.name} onChange={handleChange}
                  placeholder="Masukkan nama pets"
                  className="w-full rounded-md border border-slate-300 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  required
                />
              </div>

              {/* Species */}
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-800">
                  Species <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" name="species" value={formData.species} onChange={handleChange}
                  placeholder="Contoh: Anjing, Kucing"
                  className="w-full rounded-md border border-slate-300 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  required
                />
              </div>

              {/* Breed */}
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-800">
                  Breed <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" name="breed" value={formData.breed} onChange={handleChange}
                  placeholder="Contoh: Golden Retriever"
                  className="w-full rounded-md border border-slate-300 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  required
                />
              </div>

              {/* Gender */}
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-800">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender" value={formData.gender} onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  required
                >
                  <option value="" disabled>Pilih Gender</option>
                  <option value="Jantan">Jantan</option>
                  <option value="Betina">Betina</option>
                </select>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-800">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date" name="dob" value={formData.dob} onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  required
                />
              </div>

              {/* Color */}
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-800">
                  Color <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" name="color" value={formData.color} onChange={handleChange}
                  placeholder="Contoh: Coklat, Putih"
                  className="w-full rounded-md border border-slate-300 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  required
                />
              </div>

              {/* Ciri Khas / Distinctive Traits */}
              <div className="sm:col-span-2">
                <label className="mb-2.5 block text-sm font-semibold text-slate-800">
                  Ciri Khas
                </label>
                <input
                  type="text" name="distinctive_traits" value={formData.distinctive_traits} onChange={handleChange}
                  placeholder="Contoh: Punya tompel di telinga"
                  className="w-full rounded-md border border-slate-300 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* Allergies */}
              <div className="sm:col-span-2">
                <label className="mb-2.5 block text-sm font-semibold text-slate-800">
                  Alergi
                </label>
                <input
                  type="text" name="allergies" value={formData.allergies} onChange={handleChange}
                  placeholder="Contoh: Ayam, Ikan"
                  className="w-full rounded-md border border-slate-300 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

            </div>
          </div>

          {/* Area Footer / Tombol Aksi */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:px-8">
            <button
              type="button"
              onClick={() => navigate('/owner/pets')}
              className="rounded-md px-6 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-200 hover:text-slate-900"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isLoading ? 'Menyimpan...' : 'Simpan Data'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default PetForm;