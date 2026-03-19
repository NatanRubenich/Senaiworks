import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const TopBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sw-top-bar">
      <div className="sw-top-bar-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={() => navigate('/')}
          >
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>
              SENAI
            </span>
            <span style={{ fontSize: '16px', fontWeight: 300, color: '#c7d5e0', letterSpacing: '-0.5px' }}>
              WORKS
            </span>
            <span style={{ display: 'inline-block', width: 8, height: 8, background: '#66c0f4', marginLeft: 1, marginBottom: 8 }}></span>
            <span style={{ display: 'inline-block', width: 8, height: 8, background: '#1b2838', border: '1px solid #66c0f4', marginBottom: 0 }}></span>
          </div>
          <div className="sw-top-bar-links">
            <a href="/#" onClick={e => { e.preventDefault(); }}>Documentação</a>
            <a href="/#" onClick={e => { e.preventDefault(); }}>Recursos</a>
            <a href="/#" onClick={e => { e.preventDefault(); }}>Notícias e atualizações</a>
            <a href="/#" onClick={e => { e.preventDefault(); }}>Suporte</a>
          </div>
        </div>
        {user && (
          <div className="sw-top-bar-user">
            <span className="user-name">{user.email?.split('@')[0]?.toUpperCase()}</span>
            <span style={{ cursor: 'pointer', color: '#8f98a0', fontSize: '11px' }} onClick={handleLogout}>
              Sair
            </span>
            <div className="user-avatar">
              {user.email?.[0]?.toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
