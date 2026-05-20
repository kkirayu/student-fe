import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import Layouts
import AdminLayout from '../layouts/AdminLayout';
import MainLayout from '../layouts/MainLayouts';
import Feedback from '../layouts/Feedback';
import InfoLayanan from '../layouts/ServiceInfo';
import Register from '../pages/auth/Register';
import Login from '../pages/auth/Login';
import OTPVerification from '../pages/auth/OTPVerification';
import ForgotPassword from '../pages/auth/ForgotPassword';

// ================= IMPORT PAGES =================

// Modul Admin
import AdminDashboard from '../pages/admin/Dashboard';
import StaffList from '../pages/admin/StaffManagement/StaffList';
import StaffForm from '../pages/admin/StaffManagement/StaffForm';
import ClinicSettings from '../pages/admin/ClinicSettings';
import ServiceRatesList from '../pages/admin/ServiceRates/ServiceRatesList';

// Modul Admin - Reports
import FinancialReport from '../pages/admin/Reports/FinancialReport';
import VisitDemographics from '../pages/admin/Reports/VisitDemographics';
import TransactionLog from '../pages/admin/Reports/TransactionLog';
import InvoiceDetail from '../pages/admin/Reports/InvoiceDetail';
import StockMutationReport from '../pages/admin/Reports/StockMutationReport';

// Modul Owner
import OwnerDashboard from '../pages/owner/Dashboard';
import PetList from '../pages/owner/MyPets/PetList';
import PetForm from '../pages/owner/MyPets/PetForm';
import MedicalHistory from '../pages/owner/MedicalHistory';
import AppointmentForm from '../pages/owner/Booking/AppointmentForm';
import AppointmentHistory from '../pages/owner/Booking/AppointmentHistory';

// Modul Dokter
import DiagnosisReferenceList from '../pages/doctor/MasterData/DiagnosisReference';
import DiagnosisReferenceForm from '../pages/doctor/MasterData/DiagnosisReferenceForm';
import LabResultUpload from '../pages/doctor/MedicalRecord/LabResultUpload';
import DoctorDashboard from '../pages/doctor/Dashboard';
import PatientMedicalProfile from '../pages/doctor/MedicalRecord/PatientMedicalProfile';
import Billing from '../pages/owner/Billing';
import QueueTicket from '../pages/owner/Booking/QueueTicket';
import PetDetail from '../pages/owner/MyPets/PetDetail';


// Modul Pharmacy & Cashier
import PharmacyDashboard from '../pages/pharmacy-cashier/Dashboard';
import ProductCatalog from '../pages/pharmacy-cashier/Inventory/ProductCatalog';
import FormRestockBarang from '../pages/pharmacy-cashier/Inventory/RestockForm';
import StockMonitoring from '../pages/pharmacy-cashier/Inventory/StockMonitoring';
import SupplierList from '../pages/pharmacy-cashier/Supplier/SupplierList';
import CashierDashboard from '../pages/pharmacy-cashier/Cashier/CashierDashboard';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/info-layanan" element={<InfoLayanan />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ================= 1. RUTE ADMIN ================= */}
        <Route path="/admin" element={<AdminLayout userRole="admin" />}>
          <Route index element={<AdminDashboard />} />

          {/* Manajemen Staf */}
          <Route path="staff" element={<StaffList />} />
          <Route path="staff/add" element={<StaffForm />} />
          <Route path="staff/edit/:id" element={<StaffForm />} />

          {/* Pengaturan & Layanan */}
          <Route path="settings" element={<ClinicSettings />} />
          <Route path="services" element={<ServiceRatesList />} />

          {/* Laporan (Reports) */}
          <Route path="reports">
            <Route path="financial" element={<FinancialReport />} />
            <Route path="demographics" element={<VisitDemographics />} />
            <Route path="transactions" element={<TransactionLog />} />
            <Route path="invoice/:id" element={<InvoiceDetail />} />
            <Route path="stock-mutation" element={<StockMutationReport />} />
          </Route>
          {/* DIHAPUS: Tag </Route> penutup yang salah tempat sebelumnya ada di sini */}

          {/* Owner */}
          <Route path="PetList" element={<PetList />} />
          <Route path="PetList/add" element={<PetForm />} />
          <Route path="PetList/edit/:id" element={<PetForm />} />
          <Route path="OwnerDashboard" element={<OwnerDashboard />} />
          <Route path="MedicalHistory" element={<MedicalHistory />} />
          <Route path='AppointmentForm' element={<AppointmentForm />} /> 
          <Route path='AppointmentHistory' element={<AppointmentHistory />} />
          <Route path='Billing' element={<Billing />} />
          <Route path='QueueTicket' element={<QueueTicket />} />
          <Route path='PetDetail' element={<PetDetail />} />

          {/* Diagnosis Reference */}
          <Route path="DiagnosisReferenceList" element={<DiagnosisReferenceList />} />
          <Route path="DiagnosisReferenceList/add" element={<DiagnosisReferenceForm />} />
          <Route path="DiagnosisReferenceList/edit/:id" element={<DiagnosisReferenceForm />} />

          {/* Lab Result Upload */}
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

          <Route path="pharmacy-cashier" element={<PharmacyDashboard />} />

          {/* Product Catalog */}
          <Route path="pharmacy-cashier/Inventory/ProductCatalog" element={<ProductCatalog />} />

          {/* Restock Form */}
          <Route path="pharmacy-cashier/Inventory/FormRestockBarang" element={<FormRestockBarang />} />

          {/* Stock Monitoring */}
          <Route path="pharmacy-cashier/Inventory/StockMonitoring" element={<StockMonitoring />} />
          {/* Supplier List */}
          <Route path="pharmacy-cashier/supplier/SupplierList" element={<SupplierList />} />

          {/* Cashier Dashboard */}
          <Route path="pharmacy-cashier/cashier/CashierDashboard" element={<CashierDashboard />} />

        </Route> {/* Ini adalah penutup yang benar untuk <Route path="/admin"> */}

        {/* ================= 3. RUTE DOKTER ================= */}
        <Route path="/doctor" element={<AdminLayout userRole="doctor" />}>
          {/* Sementara di-direct ke list diagnosis jika belum ada dashboard dokter */}
          <Route index element={<Navigate to="diagnosis" replace />} />

          {/* Master Data Diagnosis */}
          <Route path="diagnosis" element={<DiagnosisReferenceList />} />
          <Route path="diagnosis/add" element={<DiagnosisReferenceForm />} />
          <Route path="diagnosis/edit/:id" element={<DiagnosisReferenceForm />} />

          {/* Rekam Medis / Hasil Lab */}
          <Route path="lab-results" element={<LabResultUpload />} />
          <Route path="lab-results/add" element={<LabResultUpload />} />
          <Route path="lab-results/edit/:id" element={<LabResultUpload />} />

          {/* Pharmacy Cashier */}
          <Route path="pharmacy-cashier" element={<PharmacyDashboard />} />

          {/* Product Catalog */}
          <Route path="pharmacy-cashier/Inventory/ProductCatalog" element={<ProductCatalog />} />

          {/* Restock Form */}
          <Route path="pharmacy-cashier/Inventory/FormRestockBarang" element={<FormRestockBarang />} />

          {/* Supplier List */}
          <Route path="pharmacy-cashier/supplier/SupplierList" element={<SupplierList />} />

          {/* Cashier Dashboard */}
          <Route path="pharmacy-cashier/cashier/CashierDashboard" element={<CashierDashboard />} />
        </Route>

        {/* ================= HALAMAN 404 ================= */}
        <Route path="*" element={
          <div className="flex h-screen items-center justify-center bg-slate-50">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-slate-800">404</h1>
              <p className="text-slate-500">Halaman tidak ditemukan.</p>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;