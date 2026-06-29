import React, { useState, useEffect } from 'react';
import { Pill, User, Plus, Trash2, FileText, Loader2, ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { doctorService } from '../../../services/doctorService';

const EReceiptForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Menangkap context data pasien aktif dari SOAP / Waiting List
  const { activeAppointment } = location.state || {};

  // State data dari API
  const [pets, setPets] = useState([]);
  const [isLoadingPets, setIsLoadingPets] = useState(!activeAppointment);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Formulir Utama
  const [selectedPetId, setSelectedPetId] = useState(activeAppointment?.pet_id || '');
  const [appointmentId, setAppointmentId] = useState(activeAppointment?.id || '1'); // Default '1' untuk uji coba
  const [petName, setPetName] = useState(activeAppointment?.pet?.name || '');
  const [petType, setPetType] = useState(activeAppointment?.pet?.species || '');
  const [prescriptionNotes, setPrescriptionNotes] = useState('');
  
  // State Item Obat Dinamis
  const [prescribedItems, setPrescribedItems] = useState([
    { medicine_name: '', dosage: '', frequency: '', quantity: 1, doctor_instructions: '' }
  ]);

  // Ambil daftar hewan jika tidak di-pass dari halaman sebelumnya
  useEffect(() => {
    if (activeAppointment) return;
    const fetchPetsData = async () => {
      try {
        setIsLoadingPets(true);
        const response = await doctorService.getPets();
        const petsData = response?.data?.data || response?.data || response;
        setPets(Array.isArray(petsData) ? petsData : []);
      } catch (error) {
        console.error('Gagal mengambil data pasien:', error);
      } finally {
        setIsLoadingPets(false);
      }
    };
    fetchPetsData();
  }, [activeAppointment]);

  const handlePetChange = (petId) => {
    setSelectedPetId(petId);
    const selectedPet = pets.find(p => p.id === parseInt(petId));
    if (selectedPet) {
      setPetName(selectedPet.name);
      setPetType(selectedPet.species);
    } else {
      setPetName('');
      setPetType('');
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...prescribedItems];
    updatedItems[index][field] = value;
    setPrescribedItems(updatedItems);
  };

  const addPrescriptionRow = () => {
    setPrescribedItems([
      ...prescribedItems,
      { medicine_name: '', dosage: '', frequency: '', quantity: 1 }
    ]);
  };

  const removePrescriptionRow = (index) => {
    if (prescribedItems.length > 1) {
      const updatedItems = prescribedItems.filter((_, i) => i !== index);
      setPrescribedItems(updatedItems);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi input minimal sebelum dikirim
    const isItemsValid = prescribedItems.every(item => item.medicine_name.trim() !== '' && item.quantity > 0);
    if (!isItemsValid || (!selectedPetId && !activeAppointment)) {
      Swal.fire({
        icon: 'warning',
        title: 'Form Belum Lengkap',
        text: 'Pastikan Anda telah memilih hewan dan mengisi nama obat di setiap baris.',
        confirmButtonColor: '#2563eb'
      });
      return;
    }

    setIsSubmitting(true);

    // Kirim payload berstruktur nested object agar ditangkap sekaligus di backend
    const payload = {
      appointment_id: appointmentId,
      pet_id: selectedPetId || activeAppointment?.pet_id,
      doctor_id: 1, // Fallback ID dokter bertugas
      doctor_instructions: prescriptionNotes,
      items: prescribedItems // Array berisi objek medicine_name, dosage, frequency, quantity
    };

    try {
      const response = await doctorService.submitEReceipt(payload);
      
      await Swal.fire({
        icon: 'success',
        title: 'E-Resep Berhasil Dibuat!',
        text: response?.message || 'Resep digital telah diteruskan ke bagian Kasir & Farmasi.',
        confirmButtonColor: '#10b981'
      });

      navigate('/doctor');
    } catch (error) {
      console.error('Gagal mengirim E-Resep:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menyimpan E-Resep',
        text: error.response?.data?.message || 'Terjadi kesalahan sistem (422/500). Periksa validasi backend Anda.',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Pembuatan E-Resep</h2>
          <p className="text-sm text-slate-500">Formulir digital pembuatan resep obat terintegrasi database klinik.</p>
        </div>
        <Link 
          to="/doctor"
          className="inline-flex items-center gap-2 rounded border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* KARTU 1: INFORMASI PASIEN */}
        <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="h-5 w-5 text-blue-600" />
            <h3 className="font-bold text-slate-800">Pilih Pasien / Hewan</h3>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Registrasi Pasien (Pet)</label>
              {activeAppointment ? (
                <div className="rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 font-semibold">
                  {activeAppointment?.pet?.name || 'Pasien Aktif'}
                </div>
              ) : isLoadingPets ? (
                <div className="flex h-10 items-center justify-center rounded border border-slate-200 bg-slate-50 text-xs text-slate-400">
                  <Loader2 className="h-4 w-4 animate-spin mr-2 text-blue-500" /> Memuat Pasien...
                </div>
              ) : (
                <select
                  required
                  value={selectedPetId}
                  onChange={(e) => handlePetChange(e.target.value)}
                  className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white"
                >
                  <option value="">-- Pilih Hewan --</option>
                  {pets.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Owner: {p.owner?.name || 'N/A'})</option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Nama Hewan</label>
              <input
                type="text"
                disabled
                placeholder="Terisi otomatis..."
                value={petName}
                className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Jenis Hewan</label>
              <input
                type="text"
                disabled
                placeholder="Terisi otomatis..."
                value={petType}
                className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 outline-none"
              />
            </div>
          </div>
        </div>

        {/* KARTU 2: DETAIL REKOMENDASI OBAT */}
        <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-blue-600" />
              <h3 className="font-bold text-slate-800">Daftar Obat / Racikan</h3>
            </div>
            <button
              type="button"
              onClick={addPrescriptionRow}
              className="flex items-center gap-1.5 rounded bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition"
            >
              <Plus className="h-4 w-4" /> Tambah Obat
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {prescribedItems.map((item, index) => (
              <div 
                key={index} 
                className="relative grid grid-cols-1 gap-3 rounded border border-slate-100 bg-slate-50 p-4 pt-8 shadow-inner sm:grid-cols-12 sm:pt-4 items-end"
              >
                <div className="flex flex-col gap-1 sm:col-span-4">
                  <label className="text-xs font-semibold text-slate-600">Nama Obat</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Amoxicillin 150mg Vet"
                    value={item.medicine_name}
                    onChange={(e) => handleItemChange(index, 'medicine_name', e.target.value)}
                    className="rounded border border-slate-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                {/* Takaran Dosis */}
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-600">Takaran Dosis</label>
                  <input
                    type="text"
                    required
                    placeholder="Misal: 1 tab / 5ml"
                    value={item.dosage}
                    onChange={(e) => handleItemChange(index, 'dosage', e.target.value)}
                    className="rounded border border-slate-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                {/* Frekuensi */}
                <div className="flex flex-col gap-1 sm:col-span-3">
                  <label className="text-xs font-semibold text-slate-600">Frekuensi</label>
                  <input
                    type="text"
                    required
                    placeholder="Misal: 3x sehari"
                    value={item.frequency}
                    onChange={(e) => handleItemChange(index, 'frequency', e.target.value)}
                    className="rounded border border-slate-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                {/* Jumlah Kuantitas */}
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-600">Jumlah Qty</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                    className="rounded border border-slate-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                {/* Tombol Hapus Baris */}
                <button
                  type="button"
                  disabled={prescribedItems.length === 1}
                  onClick={() => removePrescriptionRow(index)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-rose-500 disabled:opacity-30 sm:static sm:col-span-1 sm:flex sm:items-center sm:justify-center sm:mb-1.5"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* KARTU 3: INTRUKSI KHUSUS */}
        <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText className="h-5 w-5 text-blue-600" />
            <h3 className="font-bold text-slate-800">Instruksi Tambahan</h3>
          </div>
          <div className="flex flex-col gap-1.5">
            <textarea
              rows="3"
              placeholder="Berikan instruksi tambahan jika diperlukan, misalnya: Simpan di dalam kulkas, habiskan antibiotik, dst."
              value={prescriptionNotes}
              onChange={(e) => setPrescriptionNotes(e.target.value)}
              className="w-full rounded border border-slate-300 p-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>

        {/* AKSI BUTTONS */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/doctor')}
            className="rounded border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting || (!selectedPetId && !activeAppointment)}
            className="flex items-center gap-2 rounded bg-blue-600 px-6 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition shadow-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...
              </>
            ) : (
              'Simpan & Kirim E-Resep'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EReceiptForm;