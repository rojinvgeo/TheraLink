import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function SiteFooter(): ReactNode {
  return (
    <footer style={{
      backgroundColor: 'var(--color-canvas-alt)',
      borderTop: '1px solid var(--color-border-base)',
      padding: 'var(--space-12) var(--space-6) var(--space-8)',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 'var(--space-8)',
        marginBottom: 'var(--space-8)'
      }}>
        {/* Info Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem' }}>
            Thera<span style={{ color: 'var(--color-brand-blue)' }}>Link</span>
          </span>
          <p style={{ 
            fontSize: '0.875rem', 
            color: 'var(--color-text-secondary)',
            lineHeight: '1.5'
          }}>
            TheraLink connects qualified therapists with healthcare organizations and families through recruitment and talent solutions.
          </p>
        </div>

        {/* Links Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)' }}>Quick Links</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <Link to="/" style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Home</Link>
            <Link to="/services" style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Services</Link>
            <Link to="/about" style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>About Us</Link>
            <Link to="/vacancies" style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Vacancies</Link>
            <Link to="/contact" style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Contact & Support</Link>
          </div>
        </div>

        {/* Paths Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)' }}>Audience Paths</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <Link to="/for-organizations" style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>For Organizations</Link>
            <Link to="/for-families" style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>For Families</Link>
            <Link to="/for-therapists" style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>For Therapists</Link>
          </div>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-base)', marginBottom: 'var(--space-6)' }} />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 'var(--space-4)',
        fontSize: '0.8rem',
        color: 'var(--color-text-muted)'
      }}>
        <p style={{ maxWidth: '600px', lineHeight: '1.4' }}>
          Disclaimer: TheraLink is a recruiter and placement partner, connecting qualified specialists. We do not provide clinical therapy directly.
        </p>
        <p>© 2026 TheraLink Inc. All rights reserved.</p>
      </div>
    </footer>
  );
}
