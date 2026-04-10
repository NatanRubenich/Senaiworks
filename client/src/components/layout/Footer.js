import React from 'react';

const Footer = () => {
  return (
    <footer className="sw-footer" style={{ padding: '14px 16px', marginTop: '40px' }}>
      <div className="sw-footer-inner" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#8f98a0' }}>SENAI</span>
          <span style={{ fontSize: '13px', fontWeight: 300, color: '#556772' }}>WORKS</span>
          <span style={{ display: 'inline-block', width: 5, height: 5, background: '#556772', marginLeft: 1, marginBottom: 5 }}></span>
          <span style={{ display: 'inline-block', width: 5, height: 5, background: '#2a475e' }}></span>
        </div>
        <span style={{ fontSize: '10px', color: '#556772', textAlign: 'center', flex: 1 }}>
          Conteúdo confidencial — Acesso restrito SENAI/SESI
        </span>
        <span style={{ fontSize: '10px', color: '#556772' }}>
          © {new Date().getFullYear()} SenaiWorks
        </span>
      </div>
    </footer>
  );
};

export default Footer;
