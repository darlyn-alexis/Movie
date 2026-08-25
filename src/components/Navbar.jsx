import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, User, X, Home, Tv, Film } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Inicio', path: '/', icon: Home },
    { name: 'Series', path: '/series', icon: Tv },
    { name: 'Películas', path: '/movies', icon: Film },
  ];

  const isActive = (path) => location.pathname === path;

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav className="navbar glass">
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ 
              fontSize: '1.8rem', 
              background: 'var(--accent-gradient)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              fontWeight: '800'
            }}>
              CINEMA+
            </h1>
          </Link>
          <div className="nav-links">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                style={{ color: isActive(link.path) ? 'var(--text-primary)' : 'var(--text-secondary)' }}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <AnimatePresence>
            {showSearch && (
              <motion.input
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 200, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                autoFocus
                className="glass"
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-glass)',
                  color: 'white',
                  outline: 'none'
                }}
              />
            )}
          </AnimatePresence>
          <Search 
            size={22} 
            className="text-secondary" 
            cursor="pointer" 
            onClick={() => setShowSearch(!showSearch)}
          />
          <User size={22} className="text-secondary" cursor="pointer" />
          <button 
            className="mobile-menu-btn" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass"
            style={{
              position: 'fixed',
              top: '60px',
              left: 0,
              right: 0,
              padding: '2rem',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              textAlign: 'center'
            }}
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                onClick={() => setIsMenuOpen(false)}
                style={{ 
                  fontSize: '1.2rem',
                  color: isActive(link.path) ? 'var(--text-primary)' : 'var(--text-secondary)'
                }}
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Barra de Navegación Inferior (Móviles) */}
      <nav className="mobile-bottom-nav">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.path);
          return (
            <Link
              key={`bottom-${link.name}`}
              to={link.path}
              className={`mobile-nav-item ${active ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export default Navbar;
