import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Search, User, LogOut, Menu, X, Library } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../controllers/AuthContext';

const Logo = () => (
  <Link to="/" className="font-headline text-2xl font-black tracking-tighter italic flex items-center gap-1">
    <span className="text-primary-container">SENAI</span>
    <span className="text-slate-400">WORKS</span>
    <span className="ml-3 text-sm font-bold uppercase tracking-widest text-secondary-container not-italic">Store</span>
  </Link>
);

const NavItem = ({ to, label, end }) => (
  <NavLink to={to} end={end}>
    {({ isActive }) => (
      <span
        className={`font-headline text-sm uppercase tracking-tight transition-colors duration-200 relative ${
          isActive ? 'text-primary-container font-bold' : 'text-slate-500 hover:text-secondary-container font-medium'
        }`}
      >
        {label}
        {isActive && (
          <motion.span
            layoutId="nav-underline"
            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-secondary-container"
          />
        )}
      </span>
    )}
  </NavLink>
);

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const onSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/catalogo?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  return (
    <header className="bg-white fixed top-0 inset-x-0 z-50 shadow-sm gamer-accent">
      <nav className="flex justify-between items-center w-full px-6 lg:px-12 py-5 max-w-[1920px] mx-auto">
        <div className="flex items-center gap-12">
          <Logo />
          <div className="hidden md:flex gap-8 items-center">
            <NavItem to="/" label="Início" end />
            <NavItem to="/catalogo" label="Catálogo" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={onSearch} className="relative hidden lg:block">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Buscar jogos..."
              className="bg-surface-container-high border-none rounded-full pl-5 pr-12 py-2 w-64 text-sm focus:ring-2 focus:ring-primary-container outline-none"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary-container"
              aria-label="Buscar"
            >
              <Search size={18} />
            </button>
          </form>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 bg-surface-container-high px-3 py-2 rounded-full hover:bg-surface-container-highest transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-primary-gradient text-white grid place-items-center text-xs font-bold">
                  {user.email?.[0]?.toUpperCase() || '?'}
                </div>
                <span className="hidden md:inline text-sm font-bold text-primary-container max-w-[140px] truncate">
                  {user.email?.split('@')[0]}
                </span>
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-ambient border border-outline-variant/10 overflow-hidden"
                  >
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        navigate('/perfil');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low text-sm font-medium"
                    >
                      <User size={16} /> Meu Perfil
                    </button>
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        navigate('/perfil?tab=library');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low text-sm font-medium"
                    >
                      <Library size={16} /> Minha Biblioteca
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-error/10 text-sm font-medium text-error border-t border-outline-variant/10"
                    >
                      <LogOut size={16} /> Sair
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login', { state: { from: location.pathname } })}
              className="btn-orange text-sm"
            >
              Entrar
            </button>
          )}

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden text-primary-container"
            aria-label="Menu"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="md:hidden overflow-hidden border-t border-outline-variant/10"
          >
            <div className="flex flex-col gap-4 p-6">
              <NavItem to="/" label="Início" end />
              <NavItem to="/catalogo" label="Catálogo" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
