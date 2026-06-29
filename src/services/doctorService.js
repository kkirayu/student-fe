import api from './api';

export const doctorService = {
  getPets: async () => {
    const response = await api.get('/pets');  
    return response.data;
  },

  // Ambil semua data referensi diagnosis / kamus penyakit
  getDiagnoses: async () => {
    const response = await api.get('/doctor/diagnoses');
    return response.data;
  },

  // Ambil rincian detail 1 data penyakit berdasarkan ID (untuk edit mode)
  getDiagnosisById: async (id) => {
    const response = await api.get(`/doctor/diagnoses/${id}`);
    return response.data;
  },

  // Buat referensi diagnosis baru
  createDiagnosis: async (diagnosisData) => {
    const response = await api.post('/doctor/diagnoses', diagnosisData);
    return response.data;
  },

  // Perbarui referensi diagnosis yang sudah ada
  updateDiagnosis: async (id, diagnosisData) => {
    const response = await api.put(`/doctor/diagnoses/${id}`, diagnosisData);
    return response.data;
  },

  // Hapus referensi diagnosis
  deleteDiagnosis: async (id) => {
    const response = await api.delete(`/doctor/diagnoses/${id}`);
    return response.data;
  },

  submitSOAP: async (soapData) => {
    const response = await api.post('/doctor/medical-records', soapData);
    return response.data;
  },

  submitEReceipt: async (receiptData) => {
    const response = await api.post('/doctor/e-receipts', receiptData);
    return response.data;
  },

  submitSurgeryReport: async (surgeryData) => {
    const response = await api.post('/doctor/surgeries', surgeryData);
    return response.data;
  },

  submitVaccination: async (vaccineData) => {
    const response = await api.post('/doctor/vaccinations', vaccineData);
    return response.data;
  },
  
  /**
   * FITUR HASIL LAB (LAB RESULTS)
   */
  
  // 1. Mengambil riwayat hasil laboratorium dari backend
  getLabResults: async () => {
    const response = await api.get('/doctor/lab-results');
    return response.data;
  },

  // 2. Mengunggah dokumen lab baru menggunakan FormData (Multipart/Form-Data)
  uploadLabResult: async (formData) => {
    const response = await api.post('/doctor/lab-results', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // 3. Menghapus berkas laboratorium berdasarkan ID
  deleteLabResult: async (id) => {
    const response = await api.delete(`/doctor/lab-results/${id}`);
    return response.data;
  }
};