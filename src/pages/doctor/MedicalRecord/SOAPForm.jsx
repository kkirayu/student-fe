import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Search } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { doctorService } from '../../../services/doctorService';

const SOAPForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Mengambil data transferan dari halaman antrean dokter (jika ada)
  const { appointmentId, petId, doctorId } = location.state || {};

  const [formData, setFormData] = useState({
    appointment_id: appointmentId || '1', // Fallback ke '1' untuk testing jika belum ada page antrean
    pet_id: petId || '',
    doctor_id: doctorId || '1',            // Id dokter yang bertugas
    diagnosis_dictionary_id: '',
    weight: '',
    subjective: '',
    objective: '',
    plan: ''
  });

  // State penampung data API (Wajib default Array kosong agar tidak crash di awal)
  const [petOptions, setPetOptions] = useState([]);
  const [diagnosisOptions, setDiagnosisOptions] = useState([]);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Fetch data awal untuk dropdown dari Backend
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoadingFetch(true);

        const [petsResponse, diagnosesResponse] = await Promise.all([
          doctorService.getPets(),
          doctorService.getDiagnoses()
        ]);

        if (petsResponse) {
          const petsData = petsResponse.data?.data || petsResponse.data || petsResponse;
          setPetOptions(Array.isArray(petsData) ? petsData : []);
        }

        if (diagnosesResponse) {
          const diagnosesData = diagnosesResponse.data?.data || diagnosesResponse.data || diagnosesResponse;
          setDiagnosisOptions(Array.isArray(diagnosesData) ? diagnosesData : []);
        }

      } catch (error) {
        console.error("Gagal mengambil data penunjang:", error);
        // Fallback data dummy jika API bermasalah agar UI tetap bisa dites dijalankan
        setPetOptions([
          { id: '1', name: 'Luna', species: 'Kucing' },
          { id: '2', name: 'Bruno', species: 'Anjing' }
        ]);
        setDiagnosisOptions([
          { id: '1', disease_name: 'Feline Calicivirus' },
          { id: '2', disease_name: 'Scabies' }
        ]);
      } finally {
        setLoadingFetch(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi input wajib sebelum dikirim ke Laravel
    if (!formData.pet_id || !formData.diagnosis_dictionary_id || !formData.subjective || !formData.objective) {
      Swal.fire({
        icon: 'warning',
        title: 'Form Belum Lengkap',
        text: 'Kolom Hewan, Diagnosis, Subjective, dan Objective wajib diisi.',
        confirmButtonColor: '#2563eb'
      });
      return;
    }

    setLoadingSubmit(true);

    try {
      // Kirim payload terstruktur ke API Route: /api/doctor/medical-records
      const response = await doctorService.submitSOAP(formData);

      await Swal.fire({
        icon: 'success',
        title: 'Rekam Medis Disimpan',
        text: response?.message || 'Data SOAP berhasil masuk ke Electronic Medical Record.',
        confirmButtonColor: '#2563eb'
      });

      // Kembali ke halaman dashboard/antrean dokter
      navigate('/doctor');

    } catch (error) {
      console.error("Error submit SOAP:", error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menyimpan',
        text: error.response?.data?.message || 'Terjadi masalah pada server backend.',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  const selectedPet = Array.isArray(petOptions)
    ? petOptions.find(p => String(p.id) === String(formData.pet_id))
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Form Rekam Medis (SOAP)</h1>
          <p className="text-sm text-slate-500">Integrasi EMR ZetaConnect Management System</p>
        </div>

        <Link
          to="/doctor"
          className="inline-flex items-center justify-center gap-2 rounded border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>
      </div>

      {/* Main Content Card */}
      <div className="rounded-sm border border-slate-200 bg-white shadow-sm">
        <div className="p-6 space-y-6">

          {/* Ringkasan Pasien Aktif */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-md border border-slate-100">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Hewan Terpilih</label>
              <p className="text-sm font-medium text-slate-800">
                {selectedPet ? `${selectedPet.name} (${selectedPet.species || 'Spesies'})` : 'Silakan pilih hewan di bawah'}
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Appointment ID / Doctor ID</label>
              <p className="text-xs text-slate-600 font-mono">
                Appt: {formData.appointment_id} | Doc: {formData.doctor_id}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input: Pilih Hewan */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Pilih Hewan (pet_id)</label>
              <div className="relative">
                <select
                  name="pet_id"
                  value={formData.pet_id}
                  onChange={handleChange}
                  disabled={loadingFetch}
                  className="w-full appearance-none rounded border border-slate-300 bg-white py-1.5 pl-3 pr-10 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:bg-slate-100"
                >
                  <option value="">{loadingFetch ? '-- Memuat Data Hewan... --' : '-- Pilih Hewan --'}</option>
                  {/* 🌟 ANTI-CRASH 2: Proteksi map data hewan */}
                  {Array.isArray(petOptions) && petOptions.map(pet => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name} {pet.species ? `(${pet.species})` : ''}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Search className="h-3.5 w-3.5 text-slate-400" />
                </span>
              </div>
            </div>

            {/* Input: Berat Badan */}
            <div>
              <label className="mb-2.5 block font-medium text-slate-800">
                Berat Badan (kg) <span className="text-xs text-slate-400 font-normal">(weight)</span>
              </label>
              <input
                type="number"
                name="weight"
                step="0.01"
                placeholder="0.00"
                value={formData.weight}
                onChange={handleChange}
                className="w-full rounded border border-slate-300 bg-transparent py-2 px-4 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {/* Input: Subjective */}
            <div>
              <label className="mb-2.5 block font-medium text-slate-800">
                Subjective <span className="text-xs text-slate-400 font-normal">(subjective)</span>
              </label>
              <textarea
                rows="3"
                name="subjective"
                placeholder="Catatan keluhan, riwayat penyakit, atau gejala yang disampaikan owner..."
                value={formData.subjective}
                onChange={handleChange}
                className="w-full rounded border border-slate-300 bg-transparent py-2 px-4 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              ></textarea>
            </div>

            {/* Input: Objective */}
            <div>
              <label className="mb-2.5 block font-medium text-slate-800">
                Objective <span className="text-xs text-slate-400 font-normal">(objective)</span>
              </label>
              <textarea
                rows="3"
                name="objective"
                placeholder="Hasil pemeriksaan klinis fisik (suhu tubuh, detak jantung, kondisi kulit, dll)..."
                value={formData.objective}
                onChange={handleChange}
                className="w-full rounded border border-slate-300 bg-transparent py-2 px-4 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              ></textarea>
            </div>

            {/* Input: Assessment (Diagnosis Dictionary) */}
            <div>
              <label className="mb-2.5 block font-medium text-slate-800">
                Assessment <span className="text-xs text-slate-400 font-normal">(diagnosis_dictionary_id)</span>
              </label>
              <div className="relative">
                <select
                  name="diagnosis_dictionary_id"
                  value={formData.diagnosis_dictionary_id}
                  onChange={handleChange}
                  disabled={loadingFetch}
                  className="w-full appearance-none rounded border border-slate-300 bg-transparent py-2 pl-4 pr-10 text-sm outline-none focus:border-blue-600 disabled:bg-slate-100"
                >
                  <option value="">{loadingFetch ? 'Memuat Kamus Diagnosis...' : 'Pilih Diagnosis Penyakit...'}</option>
                  {Array.isArray(diagnosisOptions) && diagnosisOptions.map(diag => (
                    <option key={diag.id} value={diag.id}>
                      {diag.disease_name}
                    </option>
                  ))}
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </span>
              </div>
            </div>

            {/* Input: Plan */}
            <div>
              <label className="mb-2.5 block font-medium text-slate-800">
                Plan <span className="text-xs text-slate-400 font-normal">(plan)</span>
              </label>
              <textarea
                rows="3"
                name="plan"
                placeholder="Rencana pengobatan kelanjutan, tindakan medis lanjutan, resep obat, atau anjuran rawat inap..."
                value={formData.plan}
                onChange={handleChange}
                className="w-full rounded border border-slate-300 bg-transparent py-2 px-4 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              ></textarea>
            </div>

            {/* Action Button */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={loadingSubmit}
                className="inline-flex items-center justify-center gap-2 rounded bg-blue-600 px-10 py-2.5 text-sm font-medium text-white hover:bg-opacity-90 transition-all disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                {loadingSubmit ? 'Menyimpan ke EMR...' : 'Simpan Rekam Medis'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SOAPForm;