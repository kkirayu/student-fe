import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import Layouts
import AdminLayout from '../layouts/AdminLayout';
import MainLayout from '../layouts/MainLayouts';
import Feedback from '../layouts/Feedback';
import InfoLayanan from '../layouts/InfoLayanan';
import Register from '../pages/auth/Register';
import Login from '../pages/auth/Login';
import OTPVerification from '../pages/auth/OTPVerification';
import ForgotPassword from '../pages/auth/ForgotPassword';

// Import Pages (Modul Admin)
import AdminDashboard from '../pages/admin/Dashboard';
import StaffList from '../pages/admin/StaffManagement/StaffList';
import StaffForm from '../pages/admin/StaffManagement/StaffForm';
import ClinicSettings from '../pages/admin/ClinicSettings';

// Import Pages (Modul Reports - Fitur 6-10)
import FinancialReport from '../pages/admin/Reports/FinancialReport';
import VisitDemographics from '../pages/admin/Reports/VisitDemographics';
import TransactionLog from '../pages/admin/Reports/TransactionLog';
import InvoiceDetail from '../pages/admin/Reports/InvoiceDetail';
import StockMutationReport from '../pages/admin/Reports/StockMutationReport';
import ServiceRatesList from '../pages/admin/ServiceRates/ServiceRatesList';
import PetList from '../pages/owner/MyPets/PetList';
import PetForm from '../pages/owner/MyPets/PetForm';
import DiagnosisReferenceList from '../pages/doctor/MasterData/DiagnosisReference';
import DiagnosisReferenceForm from '../pages/doctor/MasterData/DiagnosisReferenceForm';
import LabResultUpload from '../pages/doctor/MedicalRecord/LabResultUpload';
<<<<<<< HEAD
import DoctorDashboard from '../pages/doctor/Dashboard';
import PatientMedicalProfile from '../pages/doctor/MedicalRecord/PatientMedicalProfile';
=======
import OwnerDashboard from '../pages/owner/Dashboard';
import MedicalHistory from '../pages/owner/MedicalHistory';
>>>>>>> bc803acf22130f82b1362d384f1dff8d573a71e5

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Navigate to="/admin" replace />} /> */}

        <Route path="/" element={<MainLayout />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/info-layanan" element={<InfoLayanan />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Rute Admin Utama */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />

          {/* Manajemen Staf */}
          <Route path="staff" element={<StaffList />} />
          <Route path="staff/add" element={<StaffForm />} />
          <Route path="staff/edit/:id" element={<StaffForm />} />

          {/* Pengaturan Klinik */}
          <Route path="settings" element={<ClinicSettings />} />

          {/* Grup Laporan (Reports) */}
          <Route path="reports">
            <Route path="financial" element={<FinancialReport />} />
            <Route path="demographics" element={<VisitDemographics />} />
            <Route path="transactions" element={<TransactionLog />} />
            <Route path="invoice/:id" element={<InvoiceDetail />} />
            <Route path="stock-mutation" element={<StockMutationReport />} />
          </Route>

          <Route path="services" element={<ServiceRatesList />} />

          {/* Owner */}
          <Route path="PetList" element={<PetList />} />
          <Route path="PetList/add" element={<PetForm />} />
          <Route path="PetList/edit/:id" element={<PetForm />} />
          <Route path="OwnerDashboard" element={<OwnerDashboard />} />
          <Route path="MedicalHistory" element={<MedicalHistory />} />

          {/* Diagnosis Reference */}
          <Route path="DiagnosisReferenceList" element={<DiagnosisReferenceList />} />
          <Route path="DiagnosisReferenceList/add" element={<DiagnosisReferenceForm />} />
          <Route path="DiagnosisReferenceList/edit/:id" element={<DiagnosisReferenceForm />} />

          {/* Diagnosis Reference */}
          <Route path="LabResultUpload" element={<LabResultUpload />} />
          <Route path="LabResultUpload/add" element={<LabResultUpload />} />
          <Route path="LabResultUpload/edit/:id" element={<LabResultUpload />} />

           {/* DoctorDasboard */}
          <Route path="DoctorDasboard" element={<DoctorDashboard />} />
          <Route path="DoctorDasboard/add" element={<DoctorDashboard />} />
          <Route path="DoctorDasboard/edit/:id" element={<DoctorDashboard />} />

          {/* PatientMedicalProfile */}
          <Route path="PatientMedicalProfile" element={<PatientMedicalProfile />} />
          <Route path="PatientMedicalProfile/add" element={<PatientMedicalProfile />} />
          <Route path="PatientMedicalProfile/edit/:id" element={<PatientMedicalProfile />} />


        </Route>








        <Route path="*" element={<div className="p-10 text-center text-2xl">404 - Halaman Tidak Ditemukan</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;