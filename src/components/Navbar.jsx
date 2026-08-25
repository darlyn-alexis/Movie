import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, User, X, Home, Tv, Film } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Inicio', path: '/', icon: Home },
    { name: 'Series', path: '/series', icon: Tv },
    { name: 'Películas', path: '/movies', icon: Film },
  ];

  const isActive = (path) => location.pathname === path;

  const isDetailView = location.pathname.includes('/pelicula/') || location.pathname.includes('/serie/');

  useEffect(() => {
    // Reset to visible on page change
    setShowNavbar(true);
  }, [location.pathname]);

  useEffect(() => {
    if (!isDetailView) {
      setShowNavbar(true);
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down and past threshold
        setShowNavbar(false);
      } else {
        // Scrolling up or at top
        setShowNavbar(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isDetailView]);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav className={`navbar glass ${!showNavbar ? 'navbar-hidden' : ''}`}>
        <AnimatePresence mode="wait">
          {showSearch ? (
            <motion.div
              key="search-active"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                gap: '0.8rem'
              }}
            >
              <Search size={20} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Buscar películas, series..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                autoFocus
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'white',
                  fontSize: '0.95rem'
                }}
              />
              {searchQuery && (
                <X
                  size={18}
                  style={{ color: 'var(--text-secondary)', cursor: 'pointer', flexShrink: 0 }}
                  onClick={() => setSearchQuery('')}
                />
              )}
              <button
                onClick={() => setShowSearch(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={22} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="navbar-normal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                  <h1 className="nav-logo-text" style={{ 
                    fontSize: '1.6rem', 
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
                <Search 
                  size={22} 
                  className="text-secondary" 
                  cursor="pointer" 
                  onClick={() => setShowSearch(true)}
                />
                <User size={22} className="text-secondary" cursor="pointer" />
                <button 
                  className="mobile-menu-btn" 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
              top: '68px',
              left: '4%',
              right: '4%',
              width: '92%',
              padding: '1.5rem',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              gap: '1.2rem',
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
