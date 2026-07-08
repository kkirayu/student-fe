import React, { useState, useEffect } from 'react';
import { studentsApi } from './services/api';
import { StudentCard } from './components/StudentCard';
import { StudentForm } from './components/StudentForm';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DialogModal } from './components/DialogModal';
import { Student, StudentFormData } from './types/Student';
import { Login } from './components/Login';
import './App.css';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  
  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const [activeTab, setActiveTab] = useState<'dashboard' | 'students'>('dashboard');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Dialog State
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'confirm';
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  const showDialog = (
    type: 'success' | 'error' | 'confirm',
    title: string,
    message: string,
    onConfirm?: () => void
  ) => {
    setDialog({ isOpen: true, type, title, message, onConfirm });
  };

  const closeDialog = () => {
    setDialog(prev => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    if (token) {
      fetchStudents();
    }
  }, [page, search, statusFilter, token]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await studentsApi.getAll({ page, limit, search, status: statusFilter });
      setStudents(response.data.data);
      setTotalPages(response.data.meta.totalPages);
    } catch (err: any) {
      if (err.response?.status === 401) {
        handleLogout();
      }
      console.error('Error fetching students:', err);
      setError('Failed to load students. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const handleAddStudent = async (studentData: StudentFormData, file?: File) => {
    try {
      const response = await studentsApi.create(studentData);
      if (file) {
        await studentsApi.uploadProfilePicture(response.data._id, file);
      }
      fetchStudents();
      setShowAddForm(false);
      showDialog('success', 'Berhasil', 'Data mahasiswa berhasil ditambahkan.');
    } catch (error) {
      console.error('Error creating student:', error);
      showDialog('error', 'Gagal', 'Terjadi kesalahan saat menambahkan mahasiswa.');
    }
  };

  const handleEditStudent = async (id: string, updates: StudentFormData, file?: File) => {
    try {
      await studentsApi.update(id, updates);
      if (file) {
        await studentsApi.uploadProfilePicture(id, file);
      }
      fetchStudents();
      setEditingStudent(null);
      showDialog('success', 'Berhasil', 'Data mahasiswa berhasil diperbarui.');
    } catch (error) {
      console.error('Error updating student:', error);
      showDialog('error', 'Gagal', 'Terjadi kesalahan saat memperbarui mahasiswa.');
    }
  };

  const handleDeleteStudent = (id: string) => {
    showDialog(
      'confirm',
      'Konfirmasi Hapus',
      'Apakah Anda yakin ingin menghapus data mahasiswa ini? Tindakan ini tidak dapat dibatalkan.',
      async () => {
        try {
          await studentsApi.delete(id);
          setStudents(students.filter(s => s._id !== id));
          closeDialog();
          setTimeout(() => {
            showDialog('success', 'Terhapus', 'Data mahasiswa berhasil dihapus.');
          }, 300);
        } catch (error) {
          console.error('Error deleting student:', error);
          closeDialog();
          setTimeout(() => {
            showDialog('error', 'Gagal', 'Terjadi kesalahan saat menghapus mahasiswa.');
          }, 300);
        }
      }
    );
  };

  const getTotalStudents = () => students.length;
  
  const getActiveStudents = () =>
    students.filter(s => s.status === 'active').length;

  const getAverageGPA = () => {
    if (students.length === 0) return 0;
    const total = students.reduce((sum, s) => sum + s.gpa, 0);
    return (total / students.length).toFixed(2);
  };

  if (!token) {
    return <Login onLoginSuccess={(t) => {
      localStorage.setItem('token', t);
      setToken(t);
    }} />;
  }

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="logo-container">
          <div className="logo-icon">Z</div>
          <div className="logo-text">
            <h1>Zeta Connect</h1>
            <p className="subtitle">Zeta University</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`nav-item ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            👥 List Mahasiswa
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">A</div>
            <div className="user-info">
              <span className="user-name">Admin Zeta</span>
              <span className="user-role">Superuser</span>
            </div>
            <button onClick={handleLogout} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', fontSize: '0.8rem' }}>Logout</button>
          </div>
        </div>
      </aside>

      <div className="main-wrapper">
        <Header />
        
        <main className="app-main">
          {loading ? (
            <div className="loading">Loading students...</div>
          ) : error ? (
            <div className="error">
              <h2>Error</h2>
              <p>{error}</p>
              <button onClick={fetchStudents} className="btn btn-primary">
                Retry
              </button>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <div className="dashboard-view fade-in">
                  <div className="section-title">
                    <h2>Dashboard Overview</h2>
                    <p>Ringkasan data akademik mahasiswa Zeta University.</p>
                  </div>
                  <div className="stats">
                    <div className="stat-card">
                      <h3>{getTotalStudents()}</h3>
                      <p>Total Mahasiswa</p>
                    </div>
                    <div className="stat-card">
                      <h3>{getActiveStudents()}</h3>
                      <p>Mahasiswa Aktif</p>
                    </div>
                    <div className="stat-card">
                      <h3>{getAverageGPA()}</h3>
                      <p>Rata-rata IPK</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'students' && (
                <div className="students-view fade-in">
                  <div className="actions" style={{ marginBottom: '1rem' }}>
                    <div className="section-title" style={{ marginBottom: 0 }}>
                      <h2>Daftar Mahasiswa</h2>
                      <p>Kelola data dan status akademik mahasiswa.</p>
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={() => setShowAddForm(true)}
                    >
                      + Tambah Mahasiswa
                    </button>
                  </div>

                  <div className="filters" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                    <input 
                      type="text" 
                      placeholder="Cari nama atau NIM..." 
                      value={search} 
                      onChange={e => { setSearch(e.target.value); setPage(1); }} 
                      style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', flex: 1, fontSize: '1rem' }}
                    />
                    <select 
                      value={statusFilter} 
                      onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                      style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', minWidth: '150px' }}
                    >
                      <option value="">Semua Status</option>
                      <option value="active">Aktif</option>
                      <option value="graduated">Lulus</option>
                      <option value="dropout">Dropout</option>
                    </select>
                  </div>

                  <div className="students-container">
                    {students.length === 0 ? (
                      <div className="empty-state">
                        <p>Belum ada data mahasiswa.</p>
                        <p>Klik "+ Tambah Mahasiswa" untuk memulai!</p>
                      </div>
                    ) : (
                      <>
                        <div className="students-grid">
                          {students.map(student => (
                            <StudentCard
                              key={student._id}
                              {...student}
                              onEdit={() => setEditingStudent(student)}
                              onDelete={() => handleDeleteStudent(student._id)}
                            />
                          ))}
                        </div>
                        {totalPages > 1 && (
                          <div className="pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
                            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn btn-secondary">Previous</button>
                            <span style={{ fontSize: '0.9rem', color: '#666' }}>Page {page} of {totalPages}</span>
                            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="btn btn-secondary">Next</button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        <Footer />
      </div>

      {showAddForm && (
        <StudentForm
          onSubmit={handleAddStudent}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {editingStudent && (
        <StudentForm
          initialData={editingStudent}
          onSubmit={(updates, file) => handleEditStudent(editingStudent._id, updates, file)}
          onClose={() => setEditingStudent(null)}
        />
      )}

      <DialogModal
        isOpen={dialog.isOpen}
        type={dialog.type}
        title={dialog.title}
        message={dialog.message}
        onConfirm={() => {
          if (dialog.onConfirm) {
            dialog.onConfirm();
          } else {
            closeDialog();
          }
        }}
        onCancel={closeDialog}
      />
    </div>
  );
}

export default App;
