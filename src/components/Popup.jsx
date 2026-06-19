import React from 'react';

const Popup = ({ isOpen, type, title, message, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" 
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-sm p-8 text-center animate-in zoom-in-95 duration-200">
        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 shadow-inner ${
          isSuccess ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'
        }`}>
          <i className={`fa-solid text-4xl ${isSuccess ? 'fa-check' : 'fa-xmark'}`}></i>
        </div>
        
        <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 mb-8 leading-relaxed text-sm">{message}</p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={onConfirm || onClose}
            className={`w-full font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${
              isSuccess 
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20' 
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20'
            }`}
          >
            {isSuccess ? (
              <><i className="fa-solid fa-arrow-right"></i> Lanjutkan</>
            ) : (
              'Tutup'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
