import React from 'react';

export function Header() {
  return (
    <header className="app-header">
      <div className="header-search">
        <input type="text" placeholder="Cari sesuatu..." className="search-input" />
      </div>
      <div className="header-actions">
        <span className="date-display">
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>
    </header>
  );
}
