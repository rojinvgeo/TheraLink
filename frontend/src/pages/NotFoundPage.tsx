import type { ReactNode } from 'react';
import { Button } from '../components/ui';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage(): ReactNode {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', alignItems: 'center', textAlign: 'center', padding: 'var(--space-12) 0' }}>
      <h2 style={{ fontSize: '3rem', fontFamily: 'var(--font-display)', color: 'var(--color-brand-blue)' }}>404</h2>
      <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)' }}>Page Not Found</h3>
      <p style={{ color: 'var(--color-text-secondary)', maxWidth: '400px', marginBottom: 'var(--space-4)' }}>
        We couldn't find the page you are looking for. Let's get you back to the right path.
      </p>
      <Button variant="primary" onClick={() => navigate('/')}>Return Home</Button>
    </div>
  );
}
