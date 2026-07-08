import React, { useState } from 'react';
import { StudentFormData } from '../types/Student';

interface StudentFormProps {
  onSubmit: (data: StudentFormData, file?: File) => void;
  onClose: () => void;
  initialData?: StudentFormData;
}

export function StudentForm({ onSubmit, onClose, initialData }: StudentFormProps) {
  const [file, setFile] = useState<File>();
  const [formData, setFormData] = useState<StudentFormData>(
    initialData || {
      name: '',
      nim: '',
      email: '',
      class: '',
      year: 2023,
      gpa: 0,
      status: 'active'
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: Number(value)
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.nim || !formData.email) {
      alert('Please fill all required fields');
      return;
    }
    onSubmit(formData, file);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{initialData ? 'Edit' : 'Add'} Student</h2>
          <button
            className="close-button"
            onClick={onClose}
            type="button"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="name">
                Nama Lengkap <span className="required">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Contoh: Ahmad Santoso"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="nim">
                NIM <span className="required">*</span>
              </label>
              <input
                id="nim"
                name="nim"
                type="text"
                value={formData.nim}
                onChange={handleChange}
                placeholder="Contoh: 23.11.5001"
                pattern="[0-9]{2}\.[0-9]{2}\.[0-9]{4}"
                title="Format: XX.XX.XXXX"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Email <span className="required">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="nama@student.amikom.ac.id"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="class">
                Kelas <span className="required">*</span>
              </label>
              <input
                id="class"
                name="class"
                type="text"
                value={formData.class}
                onChange={handleChange}
                placeholder="Contoh: IF-A"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="year">
                Tahun Masuk <span className="required">*</span>
              </label>
              <input
                id="year"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleNumberChange}
                min="2020"
                max="2030"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="gpa">
                IPK <span className="required">*</span>
              </label>
              <input
                id="gpa"
                name="gpa"
                type="number"
                value={formData.gpa}
                onChange={handleNumberChange}
                step="0.01"
                min="0"
                max="4"
                placeholder="0.00 - 4.00"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">
                Status <span className="required">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="active">Aktif</option>
                <option value="graduated">Lulus</option>
                <option value="dropout">Dropout</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="file">Profile Picture (Optional)</label>
              <input
                id="file"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0])}
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
            >
              {initialData ? 'Update' : 'Save'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
