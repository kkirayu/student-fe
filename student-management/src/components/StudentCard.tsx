import React from 'react';

interface StudentCardProps {
  name: string;
  nim: string;
  email: string;
  class: string;
  gpa: number;
  status: 'active' | 'graduated' | 'dropout';
  profilePicture?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function StudentCard({
  name,
  nim,
  email,
  class: className,
  gpa,
  status,
  profilePicture,
  onEdit,
  onDelete
}: StudentCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'graduated':
        return 'status-graduated';
      case 'dropout':
        return 'status-dropout';
      default:
        return '';
    }
  };

  const getStatusLabel = () => {
    const labels = {
      'active': 'Aktif',
      'graduated': 'Lulus',
      'dropout': 'Dropout'
    };
    return labels[status];
  };

  return (
    <div className="student-card">
      <div className="student-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem' }}>
        {profilePicture ? (
          <img src={`http://localhost:3001${profilePicture}`} alt={name} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#007bff', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {name.charAt(0).toUpperCase()}
          </div>
        )}
        <div style={{ flex: 1 }}>
          <h3 className="student-name" style={{ margin: 0, marginBottom: '0.25rem' }}>{name}</h3>
          <span className={`status-badge ${getStatusColor()}`}>
            {getStatusLabel()}
          </span>
        </div>
      </div>

      <div className="student-info">
        <div className="info-row">
          <span className="label">NIM:</span>
          <span className="value">{nim}</span>
        </div>
        <div className="info-row">
          <span className="label">Email:</span>
          <span className="value">{email}</span>
        </div>
        <div className="info-row">
          <span className="label">Kelas:</span>
          <span className="value">{className}</span>
        </div>
        <div className="info-row">
          <span className="label">IPK:</span>
          <span className="value">
            {gpa.toFixed(2)}
          </span>
        </div>
      </div>

      {(onEdit || onDelete) && (
        <div className="student-actions">
          {onEdit && (
            <button
              className="btn btn-edit"
              onClick={onEdit}
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              className="btn btn-delete"
              onClick={onDelete}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
