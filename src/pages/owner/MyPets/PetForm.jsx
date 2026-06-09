import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

const PetForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '', species: '', breed: '', gender: '', dob: '', color: '',
  });

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        name: 'Oren', species: 'Kucing', breed: 'Persia', gender: 'Jantan', dob: '2020-05-15', color: 'Oranye',
      });
    }
  }, [isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Data disimpan:', formData);
    navigate('/owner/pets');
  };

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

          {/* Area Input Utama */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">

              {/* Nama Lengkap */}
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
                  placeholder="species"
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
                  placeholder="breed"
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

              {/* Dob */}
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-800">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date" name="dob" value={formData.dob} onChange={handleChange}
                  placeholder="Date of Birth"
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
                  placeholder="Color "
                  className="w-full rounded-md border border-slate-300 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  required
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
              className="flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              Simpan Data
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default PetForm;