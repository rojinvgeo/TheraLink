import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Inbox, 
  Briefcase, 
  LogOut, 
  Menu, 
  X, 
  Shield,
  User
} from 'lucide-react';

export interface AdminLayoutProps {
  children: ReactNode;
  activeTab: 'inquiries' | 'vacancies';
  setActiveTab: (tab: 'inquiries' | 'vacancies') => void;
}

export function AdminLayout({ children, activeTab, setActiveTab }: AdminLayoutProps): ReactNode {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar drawer automatically when transitioning from mobile to desktop
  useEffect(() => {
    if (!isMobile) {
      setMobileMenuOpen(false);
    }
  }, [isMobile]);

  const handleLogout = () => {
    localStorage.removeItem('theralink_admin_token');
    navigate('/admin/login', { replace: true });
  };

  const navItems = [
    {
      id: 'inquiries' as const,
      label: 'Inquiries',
      icon: <Inbox size={20} />,
    },
    {
      id: 'vacancies' as const,
      label: 'Vacancies',
      icon: <Briefcase size={20} />,
    },
  ];

  const handleNavClick = (tabId: 'inquiries' | 'vacancies') => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const sidebarContent = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'var(--color-canvas-base, #ffffff)',
      borderRight: '1px solid var(--color-border-base, #e2e8f0)',
    }}>
      {/* Sidebar Header */}
      <div style={{
        padding: 'var(--space-6) var(--space-6)',
        borderBottom: '1px solid var(--color-border-base, #e2e8f0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: 'var(--color-accent-purple-tint, #f5f3ff)',
            color: 'var(--color-accent-purple, #8b5cf6)',
          }}>
            <Shield size={22} />
          </div>
          <div>
            <h2 style={{
              fontSize: '1.15rem',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              color: 'var(--color-text-primary, #0f172a)',
              lineHeight: 1.2,
            }}>
              TheraLink
            </h2>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: 'var(--color-accent-purple, #8b5cf6)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Staff Portal
            </span>
          </div>
        </div>

        {isMobile && (
          <button
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-secondary, #64748b)',
              padding: 'var(--space-1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Sidebar Nav links */}
      <nav style={{
        flex: 1,
        padding: 'var(--space-6) var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
      }}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: '8px',
                border: 'none',
                width: '100%',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: 600,
                fontSize: '0.95rem',
                fontFamily: 'var(--font-sans)',
                transition: 'all 0.2s ease',
                backgroundColor: isActive 
                  ? 'var(--color-accent-purple-tint, #f5f3ff)' 
                  : 'transparent',
                color: isActive 
                  ? 'var(--color-accent-purple, #8b5cf6)' 
                  : 'var(--color-text-secondary, #475569)',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--color-canvas-alt, #f8fafc)';
                  e.currentTarget.style.color = 'var(--color-text-primary, #0f172a)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--color-text-secondary, #475569)';
                }
              }}
            >
              <span style={{
                color: isActive 
                  ? 'var(--color-accent-purple, #8b5cf6)' 
                  : 'var(--color-text-muted, #94a3b8)',
                transition: 'color 0.2s ease',
              }}>
                {item.icon}
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer User Info & Logout */}
      <div style={{
        padding: 'var(--space-4) var(--space-4)',
        borderTop: '1px solid var(--color-border-base, #e2e8f0)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          padding: 'var(--space-2)',
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-border-base, #e2e8f0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text-secondary, #475569)',
          }}>
            <User size={18} />
          </div>
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <div style={{
              fontWeight: 600,
              fontSize: '0.85rem',
              color: 'var(--color-text-primary, #0f172a)',
              lineHeight: 1.2,
            }}>
              Staff Member
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-muted, #94a3b8)',
              lineHeight: 1.2,
              marginTop: '2px',
            }}>
              admin@theralink.com
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-2.5) var(--space-4)',
            borderRadius: '8px',
            border: '1px solid var(--color-border-base, #e2e8f0)',
            backgroundColor: 'transparent',
            color: 'var(--color-text-primary, #0f172a)',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.9rem',
            fontFamily: 'var(--font-sans)',
            transition: 'all 0.2s ease',
            width: '100%',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#fef2f2';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
            e.currentTarget.style.color = 'var(--color-error, #ef4444)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = 'var(--color-border-base, #e2e8f0)';
            e.currentTarget.style.color = 'var(--color-text-primary, #0f172a)';
          }}
        >
          <LogOut size={16} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: 'var(--color-canvas-alt, #f8fafc)',
      color: 'var(--color-text-primary, #0f172a)',
      fontFamily: 'var(--font-sans)',
    }}>
      {/* Desktop Sidebar (Persistent) */}
      {!isMobile && (
        <aside style={{
          width: '260px',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 10,
        }}>
          {sidebarContent}
        </aside>
      )}

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {isMobile && mobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: '#000000',
                zIndex: 40,
              }}
            />

            {/* Sidebar Slide-in Panel */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed',
                top: 0,
                bottom: 0,
                left: 0,
                width: '280px',
                zIndex: 50,
                boxShadow: 'var(--shadow-xl)',
              }}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        marginLeft: isMobile ? 0 : '260px',
        minHeight: '100vh',
      }}>
        {/* Topbar Header */}
        <header style={{
          height: '64px',
          backgroundColor: 'var(--color-canvas-base, #ffffff)',
          borderBottom: '1px solid var(--color-border-base, #e2e8f0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 var(--space-6)',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            {isMobile && (
              <button
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
                style={{
                  background: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-primary, #0f172a)',
                  padding: 'var(--space-1.5)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--color-canvas-alt, #f8fafc)',
                  border: '1px solid var(--color-border-base, #e2e8f0)',
                }}
              >
                <Menu size={20} />
              </button>
            )}
            <h1 style={{
              fontSize: '1.25rem',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              color: 'var(--color-text-primary, #0f172a)',
            }}>
              {activeTab === 'inquiries' ? 'Inquiries Management' : 'Vacancies Publisher'}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              backgroundColor: 'var(--color-canvas-alt, #f8fafc)',
              padding: 'var(--space-1.5) var(--space-3)',
              borderRadius: '20px',
              border: '1px solid var(--color-border-base, #e2e8f0)',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--color-text-secondary, #475569)',
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-success, #10b981)',
                display: 'inline-block',
              }}></span>
              <span>Live Console</span>
            </div>
          </div>
        </header>

        {/* Content Panel */}
        <main style={{
          flex: 1,
          padding: 'var(--space-6)',
          overflowY: 'auto',
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
