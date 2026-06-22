import api from './api';

export const doctorService = {
  getPets: async () => {
    const response = await api.get('/pets'); 
    return response.data;
  },

  getDiagnoses: async () => {
    const response = await api.get('/doctor/diagnoses');
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