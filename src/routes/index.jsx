import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import Layouts
import AdminLayout from '../layouts/AdminLayout';
import MainLayout from '../layouts/MainLayouts';
import Feedback from '../layouts/Feedback';
import InfoLayanan from '../layouts/ServiceInfo';
import TermsAndConditions from '../layouts/TermsAndConditions';
import PrivacyPolicy from '../layouts/PrivacyPolicy';
import Register from '../pages/auth/Register';
import Login from '../pages/auth/Login';
import OTPVerification from '../pages/auth/OTPVerification';
import ForgotPassword from '../pages/auth/ForgotPassword';

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
import PetDetail from '../pages/owner/MyPets/PetDetail';
import MedicalHistory from '../pages/owner/MedicalHistory';
import AppointmentForm from '../pages/owner/Booking/AppointmentForm';
import AppointmentHistory from '../pages/owner/Booking/AppointmentHistory';
import QueueTicket from '../pages/owner/Booking/QueueTicket';
import Billing from '../pages/owner/Billing';

// Modul Dokter
import DoctorDashboard from '../pages/doctor/Dashboard';
import DiagnosisReferenceList from '../pages/doctor/MasterData/DiagnosisReference';
import DiagnosisReferenceForm from '../pages/doctor/MasterData/DiagnosisReferenceForm';
import LabResultUpload from '../pages/doctor/MedicalRecord/LabResultUpload';
import PatientMedicalProfile from '../pages/doctor/MedicalRecord/PatientMedicalProfile';

// Modul Pharmacy & Cashier
import PharmacyDashboard from '../pages/pharmacy-cashier/Dashboard';
import ProductCatalog from '../pages/pharmacy-cashier/Inventory/ProductCatalog';
import FormRestockBarang from '../pages/pharmacy-cashier/Inventory/RestockForm';
import StockMonitoring from '../pages/pharmacy-cashier/Inventory/StockMonitoring';
import SupplierList from '../pages/pharmacy-cashier/Supplier/SupplierList';

import CashierDashboard from '../pages/pharmacy-cashier/Cashier/CashierDashboard';
import BillingQueue from '../pages/pharmacy-cashier/Cashier/BillingQueue';
import CheckoutPOS from '../pages/pharmacy-cashier/Cashier/CheckoutPOS';
import InvoiceTemplate from '../pages/pharmacy-cashier/Cashier/InvoiceTemplate';
import ShiftClosing from '../pages/pharmacy-cashier/Cashier/ShiftClosing';

// Modul Resepsionis
import ReceptionistDashboard from '../pages/receptionist/Dashboard';
import WalkInRegistration from '../pages/receptionist/WalkInRegistration';
import QueueMonitor from '../pages/receptionist/QueueMonitor';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<MainLayout />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/info-layanan" element={<InfoLayanan />} />
        <Route path="/syarat-dan-ketentuan" element={<TermsAndConditions />} />
        <Route path="/kebijakan-privasi" element={<PrivacyPolicy />} />
        
        {/* ================= AUTH ROUTES ================= */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ================= 1. RUTE ADMIN ================= */}
        <Route path="/admin" element={<AdminLayout userRole="admin" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="staff" element={<StaffList />} />
          <Route path="staff/add" element={<StaffForm />} />
          <Route path="staff/edit/:id" element={<StaffForm />} />
          <Route path="settings" element={<ClinicSettings />} />
          <Route path="services" element={<ServiceRatesList />} />
          
          <Route path="reports">
            <Route path="financial" element={<FinancialReport />} />
            <Route path="demographics" element={<VisitDemographics />} />
            <Route path="transactions" element={<TransactionLog />} />
            <Route path="invoice/:id" element={<InvoiceDetail />} />
            <Route path="stock-mutation" element={<StockMutationReport />} />
          </Route>
        </Route>

        {/* ================= 2. RUTE OWNER ================= */}
        <Route path="/owner" element={<AdminLayout userRole="owner" />}>
          <Route index element={<OwnerDashboard />} />
          
          <Route path="pets" element={<PetList />} />
          <Route path="pets/add" element={<PetForm />} />
          <Route path="pets/edit/:id" element={<PetForm />} />
          <Route path="pets/detail/:id" element={<PetDetail />} />
          
          <Route path="booking" element={<AppointmentForm />} />
          <Route path="booking/history" element={<AppointmentHistory />} />
          <Route path="booking/ticket" element={<QueueTicket />} />
          
          <Route path="medical-history" element={<MedicalHistory />} />
          <Route path="billing" element={<Billing />} />
        </Route>

        {/* ================= 3. RUTE DOKTER ================= */}
        <Route path="/doctor" element={<AdminLayout userRole="doctor" />}>
          <Route index element={<DoctorDashboard />} />
          
          <Route path="diagnosis" element={<DiagnosisReferenceList />} />
          <Route path="diagnosis/add" element={<DiagnosisReferenceForm />} />
          <Route path="diagnosis/edit/:id" element={<DiagnosisReferenceForm />} />
          
          <Route path="lab-results" element={<LabResultUpload />} />
          <Route path="lab-results/add" element={<LabResultUpload />} />
          
          <Route path="patient-profile/:id" element={<PatientMedicalProfile />} />
        </Route>

        {/* ================= 4. RUTE APOTEK ================= */}
        <Route path="/pharmacy" element={<AdminLayout userRole="pharmacy" />}>
          <Route index element={<PharmacyDashboard />} />
          <Route path="inventory" element={<ProductCatalog />} />
          <Route path="inventory/monitoring" element={<StockMonitoring />} />
          <Route path="restock" element={<FormRestockBarang />} />
          <Route path="supplier" element={<SupplierList />} />
        </Route>

        {/* ================= 5. RUTE KASIR ================= */}
        <Route path="/cashier" element={<AdminLayout userRole="cashier" />}>
          <Route index element={<CashierDashboard />} />
          <Route path="queue" element={<BillingQueue />} />
          <Route path="checkout" element={<CheckoutPOS />} />
          <Route path="invoice" element={<InvoiceTemplate />} />
          <Route path="closing" element={<ShiftClosing />} />
        </Route>

        {/* ================= 6. RUTE RESEPSIONIS ================= */}
        <Route path="/receptionist" element={<AdminLayout userRole="receptionist" />}>
          <Route index element={<ReceptionistDashboard />} />
          <Route path="walk-in-registration" element={<WalkInRegistration />} />
          <Route path="queue-monitor" element={<QueueMonitor />} />
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