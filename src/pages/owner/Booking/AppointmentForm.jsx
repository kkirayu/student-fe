import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

const AppointmentForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        pet_id: '', 
        service_id: '', 
        schedule_date: '', 
        schedule_time: '', 
        initial_complaint: '',
    });

    const [petsData, setPetsData] = useState([]);
    const [servicesData, setServicesData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const petsResponse = await fetch('https://dummyjson.com/users?limit=4');
                const petsJson = await petsResponse.json();
                
                const dummyPetNames = ['Arifin', 'Mei-Mei', 'Troton', 'Bebek'];
                const mappedPets = petsJson.users.map((user, index) => ({
                    id: user.id,
                    name: dummyPetNames[index] || user.firstName
                }));
                
                const servicesResponse = await fetch('https://dummyjson.com/products/categories');
                const servicesJson = await servicesResponse.json();
                
                const dummyServiceNames = ['Grooming Kucing', 'Grooming Anjing', 'Vaksinasi', 'Penitipan Hewan'];
                const mappedServices = servicesJson.slice(0, 4).map((category, index) => ({
                    id: index + 1,
                    name: dummyServiceNames[index] || category.name
                }));

                setPetsData(mappedPets);
                setServicesData(mappedServices);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDropdownData();

        if (isEditMode) {
            setFormData({
                pet_id: '1', 
                service_id: '1', 
                schedule_date: '2026-05-16', 
                schedule_time: '10.00 - 11.30', 
                initial_complaint: 'pilek, lemes, gamau makan, tidur seharian',
            });
        }
    }, [isEditMode]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        setTimeout(() => {
            setIsSubmitting(false);
            navigate('/owner/booking/ticket');
        }, 1500);
    };

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-50"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        {isEditMode ? 'Edit Data Janji Temu' : 'Buat Janji Temu'}
                    </h1>
                    <p className="mt-0.5 text-sm text-slate-500">
                        {isEditMode ? 'Perbarui informasi janji temu Anda.' : 'Buat janji temu untuk mengamankan jadwal Anda.'}
                    </p>
                </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                <form onSubmit={handleSubmit}>
                    <div className="p-6 sm:p-8">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                            <div>
                                <label className="mb-2.5 block text-sm font-semibold text-slate-800">
                                    Pilih Pet <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="pet_id" 
                                    value={formData.pet_id} 
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="w-full rounded-md border border-slate-300 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:bg-slate-50 disabled:text-slate-400"
                                    required
                                >
                                    <option value="" disabled>
                                        {isLoading ? 'Memuat data pets...' : 'Pilih pet'}
                                    </option>
                                    {petsData.map(pet => (
                                        <option key={pet.id} value={pet.id}>{pet.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2.5 block text-sm font-semibold text-slate-800">
                                    Layanan <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="service_id" 
                                    value={formData.service_id} 
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="w-full rounded-md border border-slate-300 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:bg-slate-50 disabled:text-slate-400"
                                    required
                                >
                                    <option value="" disabled>
                                        {isLoading ? 'Memuat layanan...' : 'Pilih layanan'}
                                    </option>
                                    {servicesData.map(service => (
                                        <option key={service.id} value={service.id}>{service.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2.5 block text-sm font-semibold text-slate-800">
                                    Tanggal Jadwal <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date" 
                                    name="schedule_date" 
                                    value={formData.schedule_date} 
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-slate-300 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-2.5 block text-sm font-semibold text-slate-800">
                                    Waktu Jadwal <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="schedule_time" 
                                    value={formData.schedule_time} 
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-slate-300 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                    required
                                >
                                    <option value="" disabled>Pilih Waktu</option>
                                    <option value="10.00 - 11.30">10.00 - 11.30</option>
                                    <option value="13.00 - 14.30">13.00 - 14.30</option>
                                    <option value="15.00 - 16.30">15.00 - 16.30</option>
                                    <option value="19.00 - 20.30">19.00 - 20.30</option>
                                </select>
                            </div>

                            <div className="sm:col-span-2">
                                <label className="mb-2.5 block text-sm font-semibold text-slate-800">
                                    Keluhan Awal / Catatan <span className="text-red-500">*</span>
                                </label>
                                <textarea 
                                    name="initial_complaint" 
                                    value={formData.initial_complaint}
                                    onChange={handleChange} 
                                    rows="3" 
                                    placeholder="Contoh: Kucing saya muntah-muntah sejak pagi..." 
                                    required 
                                    className="w-full rounded-md border border-slate-300 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                ></textarea>
                            </div>

                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:px-8">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
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
                                    {isEditMode ? 'Simpan Perubahan' : 'Ajukan Janji Temu'}
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AppointmentForm;