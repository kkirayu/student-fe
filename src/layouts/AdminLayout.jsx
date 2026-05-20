import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, Box, Search, ChevronDown, BarChart3 } from 'lucide-react'; 

// Pastikan file ini sudah kamu buat sesuai instruksi sebelumnya
import { roleMenus } from '../utils/menuConfig'; 

const AdminLayout = ({ userRole = 'admin' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false); 
  const location = useLocation();

  // Fungsi untuk mengecek menu aktif
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);
  
  // Variable to check if current path is a report/medical profile
  const isReportsPath = isActive('/admin/PatientMedicalProfile') || isActive('/admin/reports') || isActive('/admin/pharmacy-cashier');

  // Mengambil daftar menu sesuai role yang sedang login
  const currentMenus = roleMenus[userRole] || [];

  return (
    <div className="flex h-screen overflow-hidden bg-[#F1F5F9] font-sans text-slate-600">
      
      {/* ================== OVERLAY MOBILE ================== */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* ================== SIDEBAR DINAMIS ================== */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#1C2434] transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-6">
          <Link to={`/${userRole}`} className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded bg-blue-600">
              <Box className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">Zeta Connect</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white lg:hidden">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Menu List */}
        <div className="no-scrollbar mt-4 flex flex-col overflow-y-auto px-4 py-4 lg:px-6">
          <h3 className="mb-4 ml-4 text-xs font-semibold uppercase tracking-widest text-[#8A99AF]">MENU UTAMA</h3>
          <ul className="mb-6 flex flex-col gap-1.5">
            
            {/* Menu List yang di-Render Otomatis */}
            {currentMenus.map((menu, index) => {
              const Icon = menu.icon;
              const isMenuSelected = isActive(menu.path);
              
              return (
                <li key={index}>
                  <Link 
                    to={menu.path} 
                    className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium transition-all duration-300 ease-in-out hover:bg-[#333A48] hover:text-white ${
                      isMenuSelected ? 'bg-[#333A48] text-white' : 'text-[#DEE4EE]'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {menu.title}
                  </Link>
                </li>
              ); 
            })} 

            {/* Menu Admin Tambahan (Hardcoded) */}
            {userRole === 'admin' && (
              <>
                {/* Petlist */}
            <li>
              <Link to="/admin/PetList" className={`flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium text-[#DEE4EE] transition-all hover:bg-[#333A48] ${isActive('/admin/PetList') ? 'bg-[#333A48]' : ''}`}>
                <Box className="h-5 w-5" />
                Daftar Hewan Peliharaan
              </Link>
            </li>

            {/* AppointmentForm */}
            <li>
              <Link to="/admin/AppointmentForm" className={`flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium text-[#DEE4EE] transition-all hover:bg-[#333A48] ${isActive('/admin/AppointmentForm') ? 'bg-[#333A48]' : ''}`}>
                <Box className="h-5 w-5" />
                Appointment Form
              </Link>
            </li>

            {/* Appointment History */}
            <li>
              <Link to="/admin/AppointmentHistory" className={`flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium text-[#DEE4EE] transition-all hover:bg-[#333A48] ${isActive('/admin/AppointmentHistory') ? 'bg-[#333A48]' : ''}`}>
                <Box className="h-5 w-5" />
                Appointment History
              </Link>
            </li>

            {/* Billing */}
            <li>
              <Link to="/admin/Billing" className={`flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium text-[#DEE4EE] transition-all hover:bg-[#333A48] ${isActive('/admin/Billing') ? 'bg-[#333A48]' : ''}`}>
                <Box className="h-5 w-5" />
                Billing
              </Link>
            </li>

            {/* QueueTicket */}
            <li>
              <Link to="/admin/QueueTicket" className={`flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium text-[#DEE4EE] transition-all hover:bg-[#333A48] ${isActive('/admin/QueueTicket') ? 'bg-[#333A48]' : ''}`}>
                <Box className="h-5 w-5" />
                Queue Ticket
              </Link>
            </li>

            {/* PetDetail */}
            <li>
              <Link to="/admin/PetDetail" className={`flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium text-[#DEE4EE] transition-all hover:bg-[#333A48] ${isActive('/admin/PetDetail') ? 'bg-[#333A48]' : ''}`}>
                <Box className="h-5 w-5" />
                Pet Detail
              </Link>
            </li>

            {/* DiagnosisReferenceList */}
            <li>
              <Link to="/admin/DiagnosisReferenceList" className={`flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium text-[#DEE4EE] transition-all hover:bg-[#333A48] ${isActive('/admin/DiagnosisReferenceList') ? 'bg-[#333A48]' : ''}`}>
                <Box className="h-5 w-5" />
                Diagnosis Reference
              </Link>
            </li>

            {/* LabResultUpload */}
            <li>
              <Link to="/admin/LabResultUpload" className={`flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium text-[#DEE4EE] transition-all hover:bg-[#333A48] ${isActive('/admin/LabResultUpload') ? 'bg-[#333A48]' : ''}`}>
                <Box className="h-5 w-5" />
                Lab Result Upload
              </Link>
            </li>

            {/* DoctorDashboard */}
            <li>
              <Link to="/admin/DoctorDasboard" className={`flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium text-[#DEE4EE] transition-all hover:bg-[#333A48] ${isActive('/admin/DoctorDasboard') ? 'bg-[#333A48]' : ''}`}>
                <Box className="h-5 w-5" />
                Doctor Dashboard
              </Link>
            </li>

            {/* Patient Medical Profile */}
            <li>
              <button
                onClick={() => setReportsOpen(!reportsOpen)}
                className={`flex w-full items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium text-[#DEE4EE] transition-all hover:bg-[#333A48] ${isReportsPath ? 'bg-[#333A48]' : ''}`}
              >
                <BarChart3 className="h-5 w-5" />
                Medical Record
                <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${reportsOpen || isReportsPath ? 'rotate-180' : ''}`} />
              </button>
              <ul className={`mt-2 flex flex-col gap-1.5 pl-9 ${(reportsOpen || isReportsPath) ? 'block' : 'hidden'}`}>
                <li><Link to="/admin/PatientMedicalProfile" className={`text-sm text-[#8A99AF] transition-colors hover:text-white ${isActive('/admin/PatientMedicalProfile') ? 'font-semibold text-white' : ''}`}>Pasien Profile</Link></li>
                <li><Link to="/admin/PatientMedicalProfile" className={`text-sm text-[#8A99AF] transition-colors hover:text-white ${isActive('/admin/reports/demographics') ? 'font-semibold text-white' : ''}`}>Demografi Pasien</Link></li>
                <li><Link to="/admin/PatientMedicalProfile" className={`text-sm text-[#8A99AF] transition-colors hover:text-white ${isActive('/admin/reports/transactions') ? 'font-semibold text-white' : ''}`}>Log Transaksi</Link></li>
                <li><Link to="/admin/PatientMedicalProfile" className={`text-sm text-[#8A99AF] transition-colors hover:text-white ${isActive('/admin/reports/stock-mutation') ? 'font-semibold text-white' : ''}`}>Mutasi Stok</Link></li>
              </ul>
            </li>

            {/* OwnerDashboard */}
            <li>
              <Link to="/admin/OwnerDashboard" className={`flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium text-[#DEE4EE] transition-all hover:bg-[#333A48] ${isActive('/admin/OwnerDashboard') ? 'bg-[#333A48]' : ''}`}>
                <Box className="h-5 w-5" />
                Owner Dashboard
              </Link>
            </li>

            {/* MedicalHistory */}
            <li>
              <Link to="/admin/MedicalHistory" className={`flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium text-[#DEE4EE] transition-all hover:bg-[#333A48] ${isActive('/admin/MedicalHistory') ? 'bg-[#333A48]' : ''}`}>
                <Box className="h-5 w-5" />
                Medical History
              </Link>
            </li>

            <li>
                {/* Pharmacy Cashier */}
                  <Link to="/admin/pharmacy-cashier" className={`flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium text-[#DEE4EE] transition-all hover:bg-[#333A48] ${isActive('/admin/pharmacy-cashier') ? 'bg-[#333A48]' : ''}`}>
                    <Box className="h-5 w-5" />
                    Pharmacy Cashier
                  </Link>
                </li>

                {/* Product Catalog */}
                <li>
                  <Link to="/admin/pharmacy-cashier/inventory/ProductCatalog" className={`flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium text-[#DEE4EE] transition-all hover:bg-[#333A48] ${isActive('/admin/pharmacy-cashier/inventory/ProductCatalog') ? 'bg-[#333A48]' : ''}`}>
                    <Box className="h-5 w-5" />
                    Product Catalog
                  </Link>
                </li>

                {/* Restock Form */}
                <li>
                  <Link to="/admin/pharmacy-cashier/inventory/FormRestockBarang" className={`flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium text-[#DEE4EE] transition-all hover:bg-[#333A48] ${isActive('/admin/pharmacy-cashier/inventory/FormRestockBarang') ? 'bg-[#333A48]' : ''}`}>
                    <Box className="h-5 w-5" />
                    Restock Form
                  </Link>
                </li>

                {/* Stock Monitoring */}
                <li>
                  <Link to="/admin/pharmacy-cashier/inventory/StockMonitoring" className={`flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium text-[#DEE4EE] transition-all hover:bg-[#333A48] ${isActive('/admin/pharmacy-cashier/inventory/StockMonitoring') ? 'bg-[#333A48]' : ''}`}>
                    <Box className="h-5 w-5" />
                    Stock Monitoring
                  </Link>
                </li>
                  {/* Supplier List */}
                <li>
                  <Link to="/admin/pharmacy-cashier/supplier/SupplierList" className={`flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium text-[#DEE4EE] transition-all hover:bg-[#333A48] ${isActive('/admin/pharmacy-cashier/supplier/SupplierList') ? 'bg-[#333A48]' : ''}`}>
                    <Box className="h-5 w-5" />
                    Supplier List
                  </Link>
                </li>
                {/* Cashier Dashboard */}
                <li>
                  <Link to="/admin/pharmacy-cashier/cashier/CashierDashboard" className={`flex items-center gap-2.5 rounded-sm px-4 py-2.5 font-medium text-[#DEE4EE] transition-all hover:bg-[#333A48] ${isActive('/admin/pharmacy-cashier/cashier/CashierDashboard') ? 'bg-[#333A48]' : ''}`}>
                    <Box className="h-5 w-5" />
                    Cashier Dashboard
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </aside>

      {/* ================== MAIN AREA ================== */}
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        
        {/* Header Lengkap */}
        <header className="sticky top-0 z-40 flex w-full border-b border-slate-200 bg-white shadow-sm">
          <div className="flex flex-grow items-center justify-between px-4 py-4 md:px-6 2xl:px-11">
            
            <div className="flex items-center gap-4">
              {/* Tombol Hamburger untuk Mobile */}
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)} 
                className="flex items-center justify-center rounded-md border border-slate-200 bg-white p-1.5 shadow-sm lg:hidden"
              >
                <Menu className="h-5 w-5 text-black" />
              </button>
              
              {/* Search Bar */}
              <div className="hidden sm:block">
                <div className="relative">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400">
                    <Search className="h-5 w-5" />
                  </span>
                  <input 
                    type="text" 
                    placeholder="Ketik untuk mencari..." 
                    className="w-72 bg-transparent pl-9 pr-4 text-sm font-medium outline-none xl:w-125" 
                  />
                </div>
              </div>
            </div>

            {/* Profil User & Indikator Role */}
            <div className="flex items-center gap-4">
              <div className="hidden rounded bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600 sm:block">
                Role: {userRole}
              </div>
              <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                <div className="hidden text-right lg:block">
                  <p className="text-sm font-bold leading-tight text-black">Muhammad Danil</p>
                  <p className="text-xs font-medium text-slate-500">Quality Assurance</p>
                </div>
                <div className="h-10 w-10 rounded-full border border-slate-200 p-0.5">
                  <img src="https://ui-avatars.com/api/?name=Muhammad+Danil&background=3b82f6&color=fff&bold=true" alt="User" className="h-full w-full rounded-full" />
                </div>
              </div>
            </div>

          </div>
        </header>

        {/* Konten Halaman */}
        <div className="flex flex-grow flex-col">
          <main className="w-full flex-grow p-4 md:p-6 2xl:p-10">
            <Outlet />
          </main>

          {/* Footer */}
          <footer className="w-full border-t border-slate-200 bg-white px-4 py-6 md:px-10">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-sm font-medium text-slate-500">
                &copy; {new Date().getFullYear()} <span className="font-bold text-slate-800">Zeta Connect</span>. All rights reserved.
              </p>
            </div>
          </footer>
        </div>

      </div>
    </div>
  );
};

export default AdminLayout;