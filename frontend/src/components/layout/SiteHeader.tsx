import type { ReactNode } from 'react';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui';

export function SiteHeader(): ReactNode {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'For Organizations', path: '/for-organizations' },
    { name: 'For Families', path: '/for-families' },
    { name: 'For Therapists', path: '/for-therapists' },
    { name: 'Vacancies', path: '/vacancies' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const activeStyle = {
    color: 'var(--color-brand-blue)',
    fontWeight: 600,
    borderBottom: '2px solid var(--color-brand-blue)'
  };

  const idleStyle = {
    color: 'var(--color-text-secondary)',
    fontWeight: 500
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'var(--color-canvas-base)',
      borderBottom: '1px solid var(--color-border-base)',
      padding: '0 var(--space-6)',
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Brand logo */}
      <div 
        onClick={() => navigate('/')}
        style={{ 
          cursor: 'pointer', 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--space-2)' 
        }}
      >
        <div style={{
          backgroundColor: 'var(--color-brand-blue-tint)',
          color: 'var(--color-brand-blue)',
          width: '34px',
          height: '34px',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '1rem'
        }}>TL</div>
        <span style={{ 
          fontFamily: 'var(--font-display)', 
          fontWeight: 700, 
          fontSize: '1.2rem',
          letterSpacing: '-0.02em',
          color: 'var(--color-text-primary)'
        }}>
          Thera<span style={{ color: 'var(--color-brand-blue)' }}>Link</span>
        </span>
      </div>

      {/* Desktop Navigation */}
      <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="nav-link"
              style={({ isActive }) => ({
                display: 'inline-block',
                padding: 'var(--space-2) 0',
                fontSize: '0.9rem',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                ...(isActive ? activeStyle : idleStyle)
              })}
            >
              {item.name}
            </NavLink>
          ))}
        </div>
        <Button 
          variant="primary" 
          size="sm" 
          onClick={() => navigate('/contact')}
        >
          Contact TheraLink
        </Button>
      </nav>

      {/* Mobile Toggle Button */}
      <button 
        className="mobile-nav-toggle"
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
        style={{
          border: 'none',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          padding: 'var(--space-1)',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isOpen ? <X size={24} color="var(--color-text-primary)" /> : <Menu size={24} color="var(--color-text-primary)" />}
      </button>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'calc(100vh - 70px)' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              top: '70px',
              left: 0,
              width: '100%',
              backgroundColor: 'var(--color-canvas-base)',
              zIndex: 99,
              padding: 'var(--space-6)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-6)',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
              overflow: 'hidden'
            }}
          >
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMenu}
                  style={({ isActive }) => ({
                    fontSize: '1.1rem',
                    textDecoration: 'none',
                    padding: 'var(--space-2) var(--space-3)',
                    borderBottom: '1px solid var(--color-border-base)',
                    display: 'block',
                    transition: 'all 0.15s ease',
                    ...(isActive ? { 
                      color: 'var(--color-brand-blue)', 
                      fontWeight: 600,
                      borderLeft: '3px solid var(--color-brand-blue)',
                      paddingLeft: 'var(--space-3)'
                    } : { 
                      color: 'var(--color-text-secondary)' 
                    })
                  })}
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>
            <Button 
              variant="primary" 
              size="md" 
              onClick={() => {
                closeMenu();
                navigate('/contact');
              }}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Contact TheraLink
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layout media query classes injection helper */}
      <style>{`
        @media (max-width: 1024px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-nav-toggle {
            display: flex !important;
          }
        }
        .nav-link {
          position: relative;
        }
        .nav-link:hover {
          color: var(--color-brand-blue) !important;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          width: 100%;
          transform: scaleX(0);
          height: 2px;
          bottom: 0;
          left: 0;
          background-color: var(--color-brand-blue);
          transform-origin: bottom right;
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .nav-link:hover::after {
          transform: scaleX(1);
          transform-origin: bottom left;
        }
      `}</style>
    </header>
  );
}
