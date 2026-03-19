import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const NavBar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const isAdmin = user.role === 'admin';

  const devLinks = [
    { label: 'Painel', path: '/dashboard' },
    { label: 'Aplicativos e pacotes', path: '/games', highlight: true },
    { label: 'Ferramentas', path: '#' },
    { label: 'Usuários e permissões', path: '#' },
    { label: 'Dados financeiros', path: '#' },
  ];

  const adminLinks = [
    { label: 'Painel', path: '/admin' },
    { label: 'Jogos Submetidos', path: '/admin', highlight: true },
  ];

  const links = isAdmin ? adminLinks : devLinks;

  return (
    <div className="sw-nav-bar">
      <div className="sw-nav-bar-inner">
        <div className="sw-nav-links">
          {links.map((link, i) => (
            <div
              key={i}
              className={`sw-nav-link ${
                location.pathname === link.path || location.pathname.startsWith(link.path + '/') 
                  ? 'active' 
                  : ''
              } ${link.highlight ? '' : ''}`}
              onClick={() => link.path !== '#' && navigate(link.path)}
              style={{ cursor: link.path === '#' ? 'default' : 'pointer', opacity: link.path === '#' ? 0.6 : 1 }}
            >
              {link.label}
              {link.path === '#' && <span style={{ fontSize: '8px', marginLeft: '2px' }}>▼</span>}
            </div>
          ))}
        </div>
        <div className="sw-nav-search">
          <input type="text" placeholder="Buscar (nome ou ID)" />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
