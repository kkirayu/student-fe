import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

const AppointmentForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        pet_id: '', service_id: '', schedule_date: '', schedule_time: '', initial_complaint: '',
    });

    useEffect(() => {
        if (isEditMode) {
            setFormData({
                pet_id: 1, service_id: 1, schedule_date: '2026-16-05', schedule_time: '1:50:55', initial_complaint: 'pilek, lemes, gamau makan, tidur seharian',
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
                        {isEditMode ? 'Edit Data Pets' : 'Buat Janji Temu'}
                    </h1>
                    <p className="mt-0.5 text-sm text-slate-500">
                        {isEditMode ? 'Perbarui informasi pets.' : 'Buat janji temu untuk mengamankan jadwal anda.'}
                    </p>
                </div>
            </div>

            {/* Form Card */}
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                <form onSubmit={handleSubmit}>

                    {/* Area Input Utama */}
                    <div className="p-6 sm:p-8">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">

                            {/* Pet id */}
                            <div>
                                <label className="mb-2.5 block text-sm font-semibold text-slate-800">
                                    Pet_Id <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="pet_id" value={formData.pet_id} onChange={handleChange}
                                    className="w-full rounded-md border border-slate-300 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                    required
                                >
                                    <option value="" disabled>Pilih pet</option>
                                    <option value="Jantan">Arifin</option>
                                    <option value="Betina">Mei-Mei</option>
                                    <option value="Betina">Troton</option>
                                    <option value="Betina">Bebek</option>
                                </select>
                            </div>

                            {/* Service Id */}
                            <div>
                                <label className="mb-2.5 block text-sm font-semibold text-slate-800">
                                    Service_Id <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="service_id" value={formData.service_id} onChange={handleChange}
                                    className="w-full rounded-md border border-slate-300 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                    required
                                >
                                    <option value="" disabled>Pilih layanan</option>
                                    {/* Value di bawah ini contoh ID layanan dari database */}
                                    <option value="1">Grooming Kucing</option>
                                    <option value="2">Grooming Anjing</option>
                                    <option value="3">Vaksinasi</option>
                                    <option value="4">Penitipan Hewan</option>
                                </select>
                            </div>

                            {/* schedule_date */}
                            <div>
                                <label className="mb-2.5 block text-sm font-semibold text-slate-800">
                                    schedule_date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date" name="name" value={formData.schedule_date} onChange={handleChange}
                                    placeholder="Masukkan nama pets"
                                    className="w-full rounded-md border border-slate-300 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                    required
                                />
                            </div>

                            {/* schedule_time */}
                            <div>
                                <label className="mb-2.5 block text-sm font-semibold text-slate-800">
                                    schedule_time <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="service_id" value={formData.service_id} onChange={handleChange}
                                    className="w-full rounded-md border border-slate-300 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                    required
                                >
                                    <option value="" disabled>Pilih Waktu</option>
                                    {/* Value di bawah ini contoh ID layanan dari database */}
                                    <option value="1">10.00 - 11.30</option>
                                    <option value="2">13.00 - 14.30</option>
                                    <option value="3">15.00 - 16.30</option>
                                    <option value="4">19.00 - 20.30</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Keluhan Awal / Catatan</label>
                                <textarea name="initial_complaint" rows="3" onChange={handleChange} placeholder="Contoh: Kucing saya muntah-muntah sejak pagi..." required className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"></textarea>
                            </div>


                        </div>
                    </div>

                    {/* Area Footer / Tombol Aksi */}
                    <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:px-8">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/staff')}
                            className="rounded-md px-6 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-200 hover:text-slate-900"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700"
                        >
                            <Save className="h-4 w-4" />
                           Ajukan Janji Temu
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AppointmentForm;