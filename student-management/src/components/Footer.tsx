import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="app-footer">
      <p>
        &copy; {currentYear} <strong>Zeta University</strong>. All rights reserved.
      </p>
      <p className="version">
        Zeta Connect v2.0.0
      </p>
    </footer>
  );
}
