import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import Layouts
import AdminLayout from '../layouts/AdminLayout';

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

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />

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

          {/* Diagnosis Reference */}
          <Route path="DiagnosisReferenceList" element={<DiagnosisReferenceList />} />

        </Route>

    

        

        

        <Route path="*" element={<div className="p-10 text-center text-2xl">404 - Halaman Tidak Ditemukan</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;