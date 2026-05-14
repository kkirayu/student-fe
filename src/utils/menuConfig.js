// src/utils/menuConfig.js
import { 
  LayoutDashboard, 
  Users, 
  User, 
  Box, 
  FileText, 
  Activity, 
  Pill, 
  Monitor,
  History 
} from 'lucide-react';

export const roleMenus = {
  admin: [
    { title: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { title: 'Manajemen Staf', path: '/admin/staff', icon: Users },
    { title: 'Layanan & Tarif', path: '/admin/services', icon: Box },
    { title: 'Laporan Klinik', path: '/admin/reports', icon: FileText },
    { title: 'Pengaturan', path: '/admin/settings', icon: Monitor },
  ],
  doctor: [
    { title: 'Kamus Penyakit', path: '/doctor/diagnosis', icon: FileText },
    { title: 'Hasil Lab', path: '/doctor/lab-results', icon: Activity },
    // Nanti bisa ditambah menu Antrean Pasien di sini
  ],
  owner: [
    { title: 'Dashboard', path: '/owner', icon: LayoutDashboard },
    { title: 'Hewan Peliharaanku', path: '/owner/pets', icon: User },
    { title: 'Buat Janji Temu', path: '/owner/booking', icon: FileText },
    
    // ======== INI MENU BARUNYA ========
    { title: 'Riwayat Medis', path: '/owner/medical-history', icon: History },
    // ==================================
    
    { title: 'Tagihan & Pembayaran', path: '/owner/billing', icon: Activity },
  ],
  pharmacy: [
    { title: 'Dashboard Apotek', path: '/pharmacy', icon: LayoutDashboard },
    { title: 'Katalog Obat', path: '/pharmacy/inventory', icon: Pill },
    { title: 'Restock Barang', path: '/pharmacy/restock', icon: Box },
    { title: 'Data Supplier', path: '/pharmacy/supplier', icon: Users },
  ],
  cashier: [
    { title: 'Dashboard Kasir', path: '/cashier', icon: LayoutDashboard },
    { title: 'Antrean Pembayaran', path: '/cashier/queue', icon: Users },
    { title: 'Shift Closing', path: '/cashier/closing', icon: FileText },
  ]
};