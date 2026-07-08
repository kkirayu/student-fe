import React from 'react';

export type DialogProps = {
  isOpen: boolean;
  type: 'success' | 'error' | 'confirm';
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function DialogModal({ isOpen, type, title, message, onConfirm, onCancel }: DialogProps) {
  if (!isOpen) return null;

  const renderIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'confirm':
        return '!';
    }
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <div className="dialog-icon-wrapper">
          <div className={`dialog-icon icon-${type}`}>
            {renderIcon()}
          </div>
        </div>
        <div className="dialog-header">
          <h2>{title}</h2>
        </div>
        <div className="dialog-body">
          <p>{message}</p>
        </div>
        <div className="dialog-actions">
          {type === 'confirm' && (
            <button className="btn btn-secondary" onClick={onCancel} style={{ flex: 1 }}>
              Batal
            </button>
          )}
          <button 
            className={`btn ${type === 'confirm' ? 'btn-primary' : 'btn-primary'}`} 
            onClick={onConfirm}
            style={{ flex: 1 }}
          >
            {type === 'confirm' ? 'Ya, Lanjutkan' : 'Tutup'}
          </button>
        </div>
      </div>
    </div>
  );
}
