import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const token = localStorage.getItem('auth_token');
  const userStr = localStorage.getItem('user');

  if (!token || !userStr) {
    // Jika belum login, arahkan ke halaman login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  try {
    const user = JSON.parse(userStr);
    
    // Normalisasi role agar tidak case-sensitive
    const normalizedUserRole = user.role.toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());

    // Pengecekan alias role (misal: 'Owner' di frontend sama dengan 'Pemilik Hewan' di backend)
    let isAllowed = normalizedAllowedRoles.includes(normalizedUserRole);
    
    if (!isAllowed) {
      if (normalizedAllowedRoles.includes('owner') && normalizedUserRole === 'pemilik hewan') isAllowed = true;
      if (normalizedAllowedRoles.includes('pharmacy') && normalizedUserRole === 'apoteker') isAllowed = true;
    }

    if (!isAllowed) {
      // Jika role tidak sesuai, lemparkan ke halaman utama / beranda
      return <Navigate to="/" replace />;
    }

    // Jika role diizinkan, render komponen di dalamnya (Outlet / Children)
    return children;
  } catch (error) {
    console.error("Error parsing user data in ProtectedRoute:", error);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
