import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      localStorage.setItem('auth_token', token);
      
      const fetchUser = async () => {
        try {
          const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
          const response = await axios.get(`${apiUrl}/user`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const user = response.data;
          localStorage.setItem('user', JSON.stringify(user));
          
          const role = user.role;
          if (role === 'Admin') navigate('/admin');
          else if (role === 'Pemilik Hewan' || role === 'Owner') navigate('/owner');
          else if (role === 'Dokter') navigate('/doctor');
          else if (role === 'Farmasi' || role === 'Apoteker') navigate('/pharmacy');
          else if (role === 'Kasir') navigate('/cashier');
          else if (role === 'Resepsionis') navigate('/receptionist');
          else navigate('/');
        } catch (error) {
          console.error('Failed to fetch user:', error);
          navigate('/login?error=google_auth_failed');
        }
      };

      fetchUser();
    } else {
      navigate('/login?error=no_token');
    }
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-slate-600 font-medium">Memproses otentikasi Google...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
